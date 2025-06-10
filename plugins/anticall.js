/**

//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                                ＷＨＡＴＳＡＰＰ ＢＯＴ－ＭＤ ＢＥＴＡ                                   //
//                                                                                                      // 
//                                         Ｖ：1．2．2                                                   //
//                                                                                                      //
//            ███████╗██╗   ██╗██╗  ██╗ █████╗ ██╗██╗         ███╗   ███╗██████╗                        //
//            ██╔════╝██║   ██║██║  ██║██╔══██╗██║██║         ████╗ ████║██╔══██╗                       //
//            ███████╗██║   ██║███████║███████║██║██║         ██╔████╔██║██║  ██║                       //
//            ╚════██║██║   ██║██╔══██║██╔══██║██║██║         ██║╚██╔╝██║██║  ██║                       //
//            ███████║╚██████╔╝██║  ██║██║  ██║██║███████╗    ██║ ╚═╝ ██║██████╔╝                       //
//            ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚══════╝    ╚═╝     ╚═╝╚═════╝                        //
//                                                                                                      //
//══════════════════════════════════════════════════════════════════════════════════════════════════════//

CURRENTLY RUNNING ON BETA VERSION!!

* @project_name : Suhail-Md
* @author : Savin Dewasingha (Customized)
* @youtube : https://youtube.com/@eworldlk
* @description : Enhanced anti-call system with user, country, and global toggle + logs
* @version 1.3.0 (customized)

* Licensed under GPL-3.0 License;

**/

// Your custom rejection message
let antiCallMessage = `
\`\`\`Hi! This is Savin Dewasingha, your personal assistant from EWorld LK.

Sorry, calls are not accepted right now (personal or group).

For help or feature requests, please contact the owner.

Powered by Savin Dewasingha | EWorld LK
https://youtube.com/@eworldlk
\`\`\`
`;

// Data stores for anti-call settings and logs
let antiCallGlobal = true; // true = anticall enabled globally
let antiCallUsers = new Set(); // user IDs to block calls from (can be empty)
let antiCallWhitelist = new Set(); // user IDs allowed to call despite anticall on
let antiCallCountryCodes = new Set(); // country calling codes blocked (e.g. '212', '91')

// Call log for rejected calls
let rejectedCallsLog = [];

// Function to check if a call should be rejected
function shouldRejectCall(callerId, callerCountryCode) {
  if (!antiCallGlobal) return false; // anticall globally disabled
  if (antiCallWhitelist.has(callerId)) return false; // user whitelisted
  if (antiCallUsers.has(callerId)) return true; // specific user blocked
  if (antiCallCountryCodes.has(callerCountryCode)) return true; // country blocked
  return true; // default reject if anticall global is true
}

// Function to log rejected call
function logRejectedCall(callerId, callerCountryCode, timestamp) {
  rejectedCallsLog.push({
    callerId,
    callerCountryCode,
    timestamp,
  });
}

// Example function that runs on incoming call event (pseudo-code)
async function onIncomingCall(callerId, callerCountryCode, sendMessage, declineCall) {
  if (shouldRejectCall(callerId, callerCountryCode)) {
    logRejectedCall(callerId, callerCountryCode, new Date().toISOString());
    await sendMessage(callerId, antiCallMessage);
    await declineCall(callerId);
  }
}

// Example commands to toggle anticall and manage lists (pseudo-code handlers)
async function handleAntiCallCommand(command, params, chatId, sendMessage) {
  switch(command) {
    case 'on':
      antiCallGlobal = true;
      await sendMessage(chatId, '*AntiCall Enabled Globally* ✅');
      break;
    case 'off':
      antiCallGlobal = false;
      await sendMessage(chatId, '*AntiCall Disabled Globally* ❌');
      break;
    case 'blockuser':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify user ID to block.');
        break;
      }
      antiCallUsers.add(params[0]);
      await sendMessage(chatId, `User ${params[0]} is now blocked from calling.`);
      break;
    case 'unblockuser':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify user ID to unblock.');
        break;
      }
      antiCallUsers.delete(params[0]);
      await sendMessage(chatId, `User ${params[0]} is unblocked.`);
      break;
    case 'whitelist':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify user ID to whitelist.');
        break;
      }
      antiCallWhitelist.add(params[0]);
      await sendMessage(chatId, `User ${params[0]} added to whitelist.`);
      break;
    case 'unwhitelist':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify user ID to remove from whitelist.');
        break;
      }
      antiCallWhitelist.delete(params[0]);
      await sendMessage(chatId, `User ${params[0]} removed from whitelist.`);
      break;
    case 'blockcountry':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify country code(s) to block. Example: 212,91');
        break;
      }
      params.forEach(code => antiCallCountryCodes.add(code));
      await sendMessage(chatId, `Blocked country codes: ${[...antiCallCountryCodes].join(', ')}`);
      break;
    case 'unblockcountry':
      if(params.length < 1) {
        await sendMessage(chatId, 'Please specify country code(s) to unblock.');
        break;
      }
      params.forEach(code => antiCallCountryCodes.delete(code));
      await sendMessage(chatId, `Updated blocked country codes: ${[...antiCallCountryCodes].join(', ')}`);
      break;
    case 'status':
      await sendMessage(chatId, `AntiCall Status:\nGlobal: ${antiCallGlobal}\nBlocked Users: ${[...antiCallUsers].join(', ') || 'None'}\nWhitelisted Users: ${[...antiCallWhitelist].join(', ') || 'None'}\nBlocked Countries: ${[...antiCallCountryCodes].join(', ') || 'None'}`);
      break;
    case 'log':
      if (rejectedCallsLog.length === 0) {
        await sendMessage(chatId, 'No rejected calls logged yet.');
      } else {
        let logText = rejectedCallsLog.map(log => `User: ${log.callerId}, Country: ${log.callerCountryCode}, Time: ${log.timestamp}`).join('\n');
        await sendMessage(chatId, `Rejected Calls Log:\n${logText}`);
      }
      break;
    default:
      await sendMessage(chatId, 'Invalid anticall command. Commands: on, off, blockuser, unblockuser, whitelist, unwhitelist, blockcountry, unblockcountry, status, log');
  }
}

// Export or integrate the above functions into your bot command handler and call handler accordingly

