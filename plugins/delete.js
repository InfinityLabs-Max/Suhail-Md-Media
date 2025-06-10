/**
 * WHATSAPP BOT - MD BETA
 * Version: 1.2.2 (Improved by ChatGPT)
 * Author: Suhail Tech Info (Original)
 * Maintainer: [Your Name]
 * Description: Multi-functional WhatsApp user bot with Anti-Delete feature.
 * License: GPL-3.0
 */

const { smd, tlang, botpic, prefix, Config, bot_ } = require('../lib');
const { stor, isGroup } = require('../lib');

const OWNER = "SuhailTechInfo";
const DELETE_FORWARD_TARGET = process.env.DELCHAT || "pm"; // "pm" or "chat"
let antiDeleteEnabled = false;

// Utility: Logger
function log(...args) {
  console.log('[AntiDelete]', ...args);
}

// Utility: Send a reply message with error handling
async function safeReply(ctx, message) {
  try {
    await ctx.reply(message);
  } catch (err) {
    log('Reply failed:', err);
  }
}

// Command: Toggle Anti-Delete feature
smd({
  pattern: 'antidelete',
  alias: ['deletewatcher', 'nodelete'],
  desc: "Turn On/Off auto-download of deleted messages",
  fromMe: true,
  category: "general",
  use: "<on/off>",
  filename: __filename,
}, async (ctx, match) => {
  try {
    let chatId = `bot_${ctx.user}`;

    // Fetch bot config for user
    let botConfig = await bot_.findOne({ id: chatId }) || await bot_.findOne({ id: chatId });

    // Parse input argument
    let input = match.trim().toLowerCase();
    if (input !== 'on' && input !== 'off') {
      return safeReply(ctx, '*Usage:* antidelete <on/off>');
    }

    // Check current status
    if (input === 'on') {
      if (botConfig?.antidelete === true) {
        return safeReply(ctx, '*Anti_Delete is already enabled!*');
      }
      await bot_.updateOne({ id: chatId }, { antidelete: true }, { upsert: true });
      antiDeleteEnabled = true;
      log('Anti_Delete enabled');
      return safeReply(ctx, '*Anti_Delete Successfully enabled*');
    } else {
      if (botConfig?.antidelete === false) {
        return safeReply(ctx, '*Anti_Delete is already disabled*');
      }
      await bot_.updateOne({ id: chatId }, { antidelete: false }, { upsert: true });
      antiDeleteEnabled = false;
      log('Anti_Delete disabled');
      return safeReply(ctx, '*Anti_Delete Successfully disabled*');
    }
  } catch (error) {
    log('Error toggling antidelete:', error);
    safeReply(ctx, '⚠️ An error occurred toggling Anti_Delete feature.');
  }
});

// Event: On message delete detected
smd({ on: 'delete' }, async (ctx, match, { store }) => {
  try {
    // Check if antidelete is enabled for this user/chat
    const botConfig = await bot_.findOne({ id: `bot_${ctx.user}` });
    if (!botConfig || !botConfig.antidelete) return;

    // Identify who deleted and which message
    let msgId = ctx.msg.key.id;
    let chatId = ctx.msg.key.remoteJid;
    let deleter = ctx.msg.key.fromMe ? ctx.user : ctx.msg.key.participant || ctx.user;

    // Fetch the deleted message from store
    const allMessages = await stor();
    const cachedMessages = allMessages.messages[chatId] || [];
    const deletedMessage = cachedMessages.find(m => m.message && m.message.key?.id === msgId);

    if (!deletedMessage) {
      log(`Deleted message not found in cache for msgId: ${msgId}`);
      return;
    }

    // Prepare warning text
    const deleterTag = `@${deleter.split('@')[0]}`;
    const timeStamp = new Date().toLocaleString();
    const warningText = `*[ANTIDELETE DETECTED]*\n\n*DELETED BY:* ${deleterTag}\n*TIME:* ${timeStamp}\n\n*DELETED MESSAGE:*`;

    // Send deleted message back with warning
    await ctx.forwardOrBroadCast(
      DELETE_FORWARD_TARGET === "pm" ? ctx.user : chatId,
      deletedMessage.message,
      { quoted: ctx.msg }
    );
    await ctx.sendMessage(
      DELETE_FORWARD_TARGET === "pm" ? ctx.user : chatId,
      { text: warningText },
      { quoted: ctx.msg }
    );

    log(`AntiDelete: Message restored for chat ${chatId} deleted by ${deleterTag}`);
  } catch (error) {
    log('Error handling deleted message:', error);
  }
});

// Optional: Additional utility command to check status
smd({
  pattern: 'antideletestatus',
  desc: "Check Anti-Delete status",
  fromMe: true,
  category: "general",
  filename: __filename,
}, async (ctx) => {
  try {
    let chatId = `bot_${ctx.user}`;
    let botConfig = await bot_.findOne({ id: chatId }) || { antidelete: false };
    const status = botConfig.antidelete ? 'Enabled ✅' : 'Disabled ❌';
    return safeReply(ctx, `*Anti_Delete status:* ${status}`);
  } catch (error) {
    log('Error checking antidelete status:', error);
    safeReply(ctx, '⚠️ Failed to fetch Anti_Delete status.');
  }
});
