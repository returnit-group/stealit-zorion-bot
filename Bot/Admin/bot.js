const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const Key = require('./models/Key');
const os = require('os');
const path = require('path');

// Load config.json file using username
const username = os.userInfo().username;
const configPath = path.join('C:', 'Users', username, 'Desktop', 'Zorion Stealer', 'config.json');
const config = require(configPath);

// MongoDB connection
mongoose.connect(config.mongodb, {
    // useNewUrlParser: true, // No longer valid
    // useUnifiedTopology: true, // No longer valid
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Telegram Bot settings
const token = config.adminbottoken;
const allowedGroupId = 0; // Allowed group ID
const bot = new TelegramBot(token, { polling: true });

// /generate command
bot.onText(/\/generate (day|week|month|3month|year|lifetime|minute)/, async (msg, match) => {
    if (msg.chat.id !== allowedGroupId) {
        bot.sendMessage(msg.chat.id, 'You do not have permission to use this command.');
        return;
    }

    const duration = match[1];
    let expirationTime;

    switch (duration) {
        case 'week':
            generatedKey = generateKeyWeek();
            expirationTime = new Date(Date.now() + 604800000); // 1 week
            break;
        case 'month':
            generatedKey = generateKeyMonth();
            expirationTime = new Date(Date.now() + 2592000000); // 1 month
            break;
        case 'year':
            generatedKey = generateKeyYear();
            expirationTime = new Date(Date.now() + 31536000000); // 1 year
            break;
        case 'lifetime':
            generatedKey = generateKeyLifetime();
            expirationTime = new Date(Date.now() + 31556925974700); // Lifetime
            break;
        default:
            bot.sendMessage(msg.chat.id, 'Invalid duration specified.');
            return;
    }

    try {
        const newKey = new Key({ Key: generatedKey, expiresAt: expirationTime, userId: msg.from.id });
        await newKey.save();
        bot.sendMessage(msg.chat.id, `Your key has been generated; 
\`\`\`${generatedKey}\`\`\`

- Use: \`/redeem ${generatedKey}\` - @ZorionStealerbot`, { parse_mode: 'Markdown' });
    } catch (err) {
        console.error('Error generating key:', err);
        bot.sendMessage(msg.chat.id, 'An error occurred while generating the key. Please try again.');
    }
});

// /delete command
bot.onText(/\/delete (.+)/, async (msg, match) => {
    if (msg.chat.id !== allowedGroupId) {
        bot.sendMessage(msg.chat.id, 'You do not have permission to use this command.');
        return;
    }

    const key = match[1];
    try {
        const existingKey = await Key.findOne({ Key: key });
        if (!existingKey) {
            bot.sendMessage(msg.chat.id, 'Invalid key.');
            return;
        }
        await Key.findOneAndDelete({ Key: key });
        bot.sendMessage(msg.chat.id, 'Key successfully deleted.');
    } catch (err) {
        console.error('Error deleting key:', err);
        bot.sendMessage(msg.chat.id, 'An error occurred while deleting the key. Please try again.');
    }
});

// Helper functions for key generation
function generateKeyWeek() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const keyname = "ZORION-WEEKLY-" + result;
    return keyname;
}

function generateKeyMonth() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const keyname = "ZORION-MONTHLY-" + result;
    return keyname;
}

function generateKeyYear() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const keyname = "ZORION-YEARLY-" + result;
    return keyname;
}

function generateKeyLifetime() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 16; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    const keyname = "ZORION-LIFETIME-" + result;
    return keyname;
}

// Function to check and delete expired keys
function checkAndDeleteExpiredKeys() {
    Key.find({ expiresAt: { $lt: new Date() } })
        .then(keys => {
            keys.forEach(key => {
                Key.deleteOne({ _id: key._id })
                    .then(() => console.log(`Expired key ${key.Key} deleted.`))
                    .catch(err => console.error(`Error deleting key ${key.Key}: ${err}`));
            });
        })
        .catch(err => console.error('Error finding expired keys:', err));
}

// Check for expired keys every minute
setInterval(checkAndDeleteExpiredKeys, 60000);
