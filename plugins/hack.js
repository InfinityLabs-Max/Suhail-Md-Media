/**

//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                               ＷＨＡＴＳＡＰＰ ＢＯＴ－ＭＤ ＢＥＴＡ                                  //
//                                                                                                      //
//                                         Ｖ：1．2．6                                                   //
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
* @author : Suhail <https://github.com/SuhailTechInfo>
* @youtube : https://www.youtube.com/c/@SuhailTechInfo
* @description : Suhail-Md, A Multi-functional WhatsApp User Bot.
* @version 1.2.6

* Licensed under the GPL-3.0 License;

* Created By Suhail Tech Info.
* © 2023 Suhail-Md ✭ ⛥.
* Plugin date : 18/12/2023

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
    prefix,
    Config,
    sleep
} = require('../lib');

smd({
    cmdname: "hack",
    type: "fun",
    info: "Hacking prank simulation",
    filename: __filename,
},
async (citel) => {
    const progressStages = [
        "Injecting malware...",
        "█ 10%",
        "█ █ 20%",
        "█ █ █ 30%",
        "█ █ █ █ 40%",
        "█ █ █ █ █ 50%",
        "█ █ █ █ █ █ 60%",
        "█ █ █ █ █ █ █ 70%",
        "█ █ █ █ █ █ █ █ 80%",
        "█ █ █ █ █ █ █ █ █ 90%",
        "█ █ █ █ █ █ █ █ █ █ 100%",
        "System hijacking in progress...",
        "Connecting to server... ERROR 404 - Server not found!",
        "Device successfully connected.",
        "Receiving data...",
        "Data hijack 100% complete.",
        "Erasing all traces and malware...",
        "HACKING COMPLETED ✅",
        "Sending log documents...",
        "Data successfully sent. Connection terminated.",
        "Clearing backlog logs..."
    ];

    for (let stage of progressStages) {
        await citel.send(stage);
        await sleep(1000);
    }

    return await citel.send('BACKLOGS CLEARED ✔️');
});
