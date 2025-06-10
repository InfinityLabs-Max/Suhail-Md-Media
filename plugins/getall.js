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
//                                                                                                      //
//                                                                                                      //
//══════════════════════════════════════════════════════════════════════════════════════════════════════//

CURRENTLY RUNNING ON BETA VERSION!!

*
   * @project_name : Suhail-Md
   * @author : Suhail <https://github.com/SuhailTechInfo>
   * @youtube : https://www.youtube.com/c/@SuhailTechInfo
   * @infoription : Suhail-Md ,A Multi-functional whatsapp user bot.
   * @version 1.2.5 
*
   * Licensed under the  GPL-3.0 License;
* 
   * ┌┤Created By Suhail Tech Info.
   * © 2023 Suhail-Md ✭ ⛥.
   * plugin date : 10/12/2023
* 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
**/

const {
    smd,
    tlang,
    prefix,
    sleep
} = require('../lib');

let sentMessages = []; // to track sent messages for deletion

smd({
    cmdname: "getall",
    desc: "Send message/block/delete for all contacts or get JIDs",
    type: "owner",
    fromMe: true,
    use: "msg <message> | block | delmsg | members | user | groups",
    usage: `getall msg Hello everyone!
getall block
getall delmsg
getall members
getall user
getall groups`,
    filename: __filename,
    public: false,
},
async (citel, text, { store }) => {
    try {
        if (!text) return citel.reply(`Please specify a sub-command.\nUsage:\n${prefix}getall msg <message>\n${prefix}getall block\n${prefix}getall delmsg\n${prefix}getall members\n${prefix}getall user\n${prefix}getall groups`);

        const [cmd, ...args] = text.trim().split(" ");
        const msgText = args.join(" ");

        if (cmd === "msg") {
            if (!msgText) return citel.reply(`Please provide a message to send.\nUsage: ${prefix}getall msg <message>`);

            let contacts = (await store.chats.all()).filter(chat => chat.id.endsWith('.net'));
            if (contacts.length === 0) return citel.reply("No personal contacts found.");

            sentMessages = []; // reset previous messages

            let sentCount = 0;
            for (let contact of contacts) {
                try {
                    let sentMsg = await citel.sendMessage(contact.id, { text: msgText });
                    sentMessages.push({ chatId: contact.id, messageId: sentMsg.key.id });
                    sentCount++;
                    await sleep(100); // small delay
                } catch (e) {
                    console.error(`Failed to send to ${contact.id}`, e);
                }
            }
            return citel.reply(`Message sent to ${sentCount} contacts.`);

        } else if (cmd === "block") {
            let contacts = (await store.chats.all()).filter(chat => chat.id.endsWith('.net'));
            if (contacts.length === 0) return citel.reply("No personal contacts found to block.");

            let blockedCount = 0;
            for (let contact of contacts) {
                try {
                    await citel.blockUser(contact.id, "add"); // adjust if your API differs
                    blockedCount++;
                    await sleep(100);
                } catch (e) {
                    console.error(`Failed to block ${contact.id}`, e);
                }
            }
            return citel.reply(`Blocked ${blockedCount} contacts.`);

        } else if (cmd === "delmsg") {
            if (sentMessages.length === 0) return citel.reply("No sent messages to delete.");

            let deletedCount = 0;
            for (let m of sentMessages) {
                try {
                    await citel.deleteMessage(m.chatId, { id: m.messageId, remoteJid: m.chatId, fromMe: true });
                    deletedCount++;
                    await sleep(100);
                } catch (e) {
                    console.error(`Failed to delete message in ${m.chatId}`, e);
                }
            }
            sentMessages = [];
            return citel.reply(`Deleted ${deletedCount} messages sent by getall msg.`);

        } else if (cmd === "members" || cmd === "member") {
            if (!citel.isGroup) return citel.reply(tlang("group"));
            const participants = citel.metadata.participants || [];
            let str = "";
            for (let i of participants) {
                str += `📍 ${i.id}\n`;
            }
            return str ? citel.reply(`*「 LIST OF GROUP MEMBER'S JID 」*\n\n${str}`) : citel.reply("*Request Denied!*");

        } else if (cmd === "user" || cmd === "pm" || cmd === "pc") {
            let anu = (await store.chats.all()).filter(v => v.id.endsWith('.net'));
            let str = "";
            for (let i of anu) {
                str += `📍 ${i.id}\n`;
            }
            return str ? citel.reply(`*「 LIST OF PERSONAL CHAT JIDS 」*\n\nTotal ${anu.length} users are text in personal chat.\n\n${str}`) : citel.reply("*Request Denied!*");

        } else if (cmd === "group" || cmd === "groups" || cmd === "gc") {
            let allGroups = await citel.bot.groupFetchAllParticipating();
            const groupList = Object.entries(allGroups).map(t => t[1]);
            let str = "";
            for (let group of groupList) {
                str += `📍 ${group.id}\n`;
            }
            return str ? citel.reply(`*「 LIST OF GROUP CHAT JIDS」*\n\n${str}`) : citel.reply("*Request Denied!*");

        } else {
            return citel.reply(`Invalid sub-command.\nUsage:\n${prefix}getall msg <message>\n${prefix}getall block\n${prefix}getall delmsg\n${prefix}getall members\n${prefix}getall user\n${prefix}getall groups`);
        }
    } catch (e) {
        citel.error(`${e}\n\nCommand getall`, e);
        return citel.reply("An error occurred while executing the command.");
    }
});
