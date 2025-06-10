/** ──────────────────────────────────────────────────────────────────────────────
 *  ANTICALL PLUGIN for WhatsApp Bot
 *  
 *  Auto-declines calls and sends a custom message.
 *  
 *  @author         Savin Dewasingha
 *  @version        1.0
 *  @since          10/6/2025
 *  @license        MIT
 * ────────────────────────────────────────────────────────────────────────────── */

const {
  smd,
  bot_,
} = require("../lib");

// Custom anti-call message
let antiCallMessage = process.env.ANTICALL_MESSAGE || 
`\`\`\`
Hi! This is Savin's Personal Assistant – Infinity Lab Bot 🚀

📵 I do not accept calls (personal or group).
If you need help or request a feature, please contact the Owner: Savin Dewasingha.

Powered by Infinity Lab 🤖
\`\`\``;

// Countries to block calls from (empty = disabled)
let antiCallCountries = [];
let antiCallUsers = {};
let botsConfig = false;

// Owner command to enable/disable anticall
smd({
  pattern: "anticall",
  desc: "Detects and blocks incoming calls if enabled.",
  category: "owner",
  use: "`.anticall on`\n`.anticall off`\n`.anticall all`\n`.anticall 94,91,212`",
  filename: __filename
}, async (message, text) => {
  const chatId = message.chat;
  botsConfig = botsConfig || await bot_.findOne({ id: `bot_${chatId}` });

  let arg = (text || "").trim().toLowerCase();

  if (["on", "off", "all"].includes(arg)) {
    const enabled = arg === "on" || arg === "all";
    antiCallCountries = arg === "all" ? ["all"] : enabled ? ["94", "91"] : [];
    await bot_.updateOne(
      { id: `bot_${chatId}` },
      { anticall: arg }
    );
    const status = enabled ? `enabled (${arg})` : "disabled";
    return message.reply(`✔️ Auto-call is now *${status}* in this chat.`);
  }

  const current = (botsConfig && botsConfig.anticall) || "off";
  return message.reply(
    `📞 Auto-call status: *${current}*\n` +
    `To change: .anticall on|off|all|<CC1,CC2>`
  );
});

// Listen for call events
smd({
  call: true
}, async (callMessage) => {
  try {
    const chatId = callMessage.chat;
    botsConfig = botsConfig || await bot_.findOne({ id: `bot_${chatId}` });
    antiCallCountries = botsConfig?.anticall
      ? botsConfig.anticall === "all"
        ? ["all"]
        : botsConfig.anticall.split(",").map(code => code.trim())
      : [];

    if (!antiCallCountries.length) return;

    const from = callMessage.from.split("@")[0];
    const countryMatch = antiCallCountries.includes("all")
      || antiCallCountries.some(cc => from.startsWith(cc));
    if (!countryMatch) return;

    antiCallUsers[from] = antiCallUsers[from] || { warn: 0 };
    if (antiCallUsers[from].warn < 2) {
      antiCallUsers[from].warn++;
      await callMessage.reply(antiCallMessage);
      await callMessage.client.sendMessage(chatId, {
        text: `⚠️ Call warning #${antiCallUsers[from].warn} from @${from}`
      }, { mentions: [callMessage.from] });
    }

    await callMessage.client.sendNode({
      tag: "call",
      attrs: { to: callMessage.from, from: callMessage.to },
      content: [
        {
          tag: "reject",
          attrs: { reason: "busy" }
        }
      ]
    });
  } catch (e) {
    console.error("AntiCall plugin error:", e);
  }
});
