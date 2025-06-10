const { default: makeWASocket, useSingleFileAuthState, DisconnectReason } = require('@adiwajshing/baileys');
const P = require('pino');
const fs = require('fs');

const authFile = './auth_info.json';
const { state, saveState } = useSingleFileAuthState(authFile);

const store = {}; // In-memory store of messages: { chatId: { msgId: messageObject } }
const antiDeleteChats = new Set(); // Chats with Anti-Delete ON

async function startBot() {
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: P({ level: 'silent' }),
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if(connection === 'close') {
            if(lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            } else {
                console.log('Logged out, please delete auth file and restart.');
            }
        } else if(connection === 'open') {
            console.log('Bot connected');
        }
    });

    sock.ev.on('creds.update', saveState);

    // Store incoming messages
    sock.ev.on('messages.upsert', async (m) => {
        if(m.type !== 'notify') return;

        for(const msg of m.messages) {
            if(!msg.message) continue;
            if(msg.key && msg.key.remoteJid && msg.key.id) {
                const chatId = msg.key.remoteJid;
                const msgId = msg.key.id;

                // Initialize chat storage
                if(!store[chatId]) store[chatId] = {};

                // Store the message object for recovery
                store[chatId][msgId] = msg;

                // Optional: Clean old messages to save memory (e.g., older than 1 hour)
                // TODO: Implement cleanup if needed
            }
        }
    });

    // Listen to message delete events
    sock.ev.on('messages.update', async (updates) => {
        for(const update of updates) {
            if(update.updateType === 'message-revoke') {
                const { key } = update;
                const chatId = key.remoteJid;
                const msgId = key.id;

                if(antiDeleteChats.has(chatId) && store[chatId] && store[chatId][msgId]) {
                    const deletedMsg = store[chatId][msgId];
                    const sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
                    const messageContent = extractMessageContent(deletedMsg.message);

                    const senderTag = sender.includes('@') ? `@${sender.split('@')[0]}` : sender;

                    const infoText = `*🚫 Deleted message detected!* \n` +
                                     `*Deleted by:* ${senderTag}\n` +
                                     `*Content:* ${messageContent}`;

                    await sock.sendMessage(chatId, {
                        text: infoText,
                        mentions: [sender]
                    });
                }
            }
        }
    });

    // Command handler to toggle anti-delete per chat
    sock.ev.on('messages.upsert', async (m) => {
        if(m.type !== 'notify') return;

        for(const msg of m.messages) {
            if(!msg.message || !msg.key.fromMe) continue; // Only react to own messages (bot commands)
            const chatId = msg.key.remoteJid;
            const text = getMessageText(msg.message);

            if(!text) continue;

            if(text.toLowerCase() === '!antidelete on') {
                antiDeleteChats.add(chatId);
                await sock.sendMessage(chatId, { text: '✅ Anti-Delete is now *ON* for this chat.' });
            } else if(text.toLowerCase() === '!antidelete off') {
                antiDeleteChats.delete(chatId);
                await sock.sendMessage(chatId, { text: '❌ Anti-Delete is now *OFF* for this chat.' });
            }
        }
    });

    return sock;
}

// Helper: Extract text content from various WhatsApp message types
function extractMessageContent(message) {
    if(message.conversation) return message.conversation;
    if(message.extendedTextMessage && message.extendedTextMessage.text) return message.extendedTextMessage.text;
    if(message.imageMessage && message.imageMessage.caption) return message.imageMessage.caption;
    if(message.videoMessage && message.videoMessage.caption) return message.videoMessage.caption;
    if(message.stickerMessage) return '[Sticker]';
    if(message.audioMessage) return '[Audio]';
    if(message.documentMessage) return '[Document]';
    if(message.contactMessage) return '[Contact Card]';
    return '[Unsupported message type]';
}

// Helper: Get raw text from message for command processing
function getMessageText(message) {
    if(message.conversation) return message.conversation;
    if(message.extendedTextMessage && message.extendedTextMessage.text) return message.extendedTextMessage.text;
    return '';
}

startBot().catch(console.error);
