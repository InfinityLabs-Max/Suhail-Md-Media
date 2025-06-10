const {
    smd,
    prefix,
    Config,
    sleep
} = require('../lib');

smd({
    cmdname: "hack",
    type: "fun",
    info: "Realistic Advanced Hacking Prank",
    filename: __filename,
},
async (citel) => {

    await citel.send("🖥️ *Initializing Hack Engine v4.2.1...*");
    await sleep(2000);

    await citel.send("🔍 *Scanning Target Device...*\n```[##########] 100%```");
    await sleep(2000);

    await citel.send("🌐 *Connecting to Target Network...*");
    await sleep(2000);

    await citel.send("✅ *Connection Established!*\n```IP: 192.168.1.100\nMAC: 4F:5C:3A:8D:12:BB\nVPN: DISABLED```");
    await sleep(2000);

    await citel.send("🔓 *Bypassing Security Layers...*");
    await sleep(2000);

    await citel.send("```[+] Firewall Rules Overwritten\n[+] Antivirus Bypass Injected\n[+] Root Access Granted```");
    await sleep(2000);

    await citel.send("🛠️ *Deploying Exploit Toolkit...*\n```[*] Keylogger Activated\n[*] Packet Sniffer Running\n[*] Microphone Stream Open\n[*] Webcam Stream Established```");
    await sleep(2500);

    // Fake code lines loop
    const fakeCodeLines = [
        "0x1f2d4ac >> Injecting Kernel Payload...",
        ">>> root@infinitylab.local ~# echo 1 > /proc/sys/net/ipv4/ip_forward",
        "[+] Kernel Module Loaded: exploit_mod_v2.3",
        "[*] Dumping /etc/passwd ... success",
        "[*] Dumping browser cookies ... 1024 entries found",
        "[*] Stealing OAuth tokens ...",
        "[*] Capturing live webcam feed...",
        "[*] Extracting WhatsApp chat database...",
        "[*] Dumping SMS and Call Logs...",
        "[*] Hashing extracted files with SHA-256...",
        "Hash: a3f7c15d9f2b7a1c9e0124a9efb912fc52d3e...",
        "Uploading to https://secure.infinitylab.lk/api/upload",
        "[**********] Upload Progress: 76%",
        "[***********] Upload Progress: 92%",
        "[************] Upload Complete: 100%",
        ">>> Starting cleanup...",
        "[+] Deleting traces...",
        "[+] Wiping temporary files...",
        "[+] Disabling log persistence...",
        "[*] Disconnecting from Target Network..."
    ];

    for (let line of fakeCodeLines) {
        await citel.send("```" + line + "```");
        await sleep(1200);
    }

    await citel.send("✅ *All Operations Completed Successfully!*");
    await sleep(1500);

    await citel.send("📂 *Final Report:* \n```Target Device: Compromised ✅\nData Sent To: https://secure.infinitylab.lk\nStatus: CLEAN EXIT```");

    await sleep(2000);

    await citel.send("💥 *Self-destruct sequence initialized.*\n```[##########] 100% COMPLETED```");
    await sleep(1500);

    return await citel.send("🎉 *HACKING SIMULATION FINISHED! Your system is now secure 😉*");

});
