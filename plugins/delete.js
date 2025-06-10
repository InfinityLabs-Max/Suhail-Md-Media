const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');
const P = require('pino');
const qrcode = require('qrcode-terminal');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const { version, isLatest } = await fetchLatestBaileysVersion();
  console.log(`Using WhatsApp Web v${version.join('.')}, isLatest: ${isLatest}`);

  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state,
    logger: P({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  // Display QR code in terminal for scanning
  sock.ev.on('connection.update', (update) => {
    const { connection, qr, lastDisconnect } = update;
    if (qr) {
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR code above to log in.');
    }
    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting:', shouldReconnect);
      if (shouldReconnect) {
        startBot();
      }
    } else if (connection === 'open') {
      console.log('Connected to WhatsApp!');
    }
  });

  // Store messages for anti-delete
  const messageStore = new Map();

  // Listen to all messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type === 'notify') {
      for (const msg of messages) {
        if (!msg.message) continue;
        const messageId = msg.key.id;
        const from = msg.key.remoteJid;

        // Store messages to catch deletions later
        messageStore.set(messageId, msg);

        // Log incoming message
        const text = getMessageContent(msg.message);
        console.log(`[${from}] Message received: ${text}`);
      }
    }
  });

  // Listen to message deletion (MessageInfo type: "messages.delete")
  sock.ev.on('messages.delete', async (deletes) => {
    for (const msg of deletes) {
      const { remoteJid, id, fromMe } = msg;
      const deletedMsg = messageStore.get(id);
      if (deletedMsg) {
        const sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
        const deletedText = getMessageContent(deletedMsg.message);

        console.log(`Message deleted by ${sender} in ${remoteJid}: ${deletedText}`);

        // Anti-delete: Send message info back to the chat
        await sock.sendMessage(remoteJid, {
          text: `⚠️ Someone deleted a message:\n${deletedText}`
        });
      }
    }
  });

  function getMessageContent(message) {
    if (message.conversation) return message.conversation;
    if (message.extendedTextMessage) return message.extendedTextMessage.text;
    if (message.imageMessage && message.imageMessage.caption) return message.imageMessage.caption;
    if (message.videoMessage && message.videoMessage.caption) return message.videoMessage.caption;
    if (message.documentMessage && message.documentMessage.caption) return message.documentMessage.caption;
    if (message.stickerMessage) return '[Sticker]';
    if (message.audioMessage) return '[Audio]';
    if (message.contactMessage) return '[Contact]';
    if (message.locationMessage) return '[Location]';
    return '[Unknown message type]';
  }
}

startBot();
