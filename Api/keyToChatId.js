const Key = require('./Models/key');

/**
 * @param {string} key Key
 * @returns {string} Webhook
 */
const keyToChatId = async (key) => {
    const data = await Key.find({ Key: key })
    if (!data.length) return null;
    const { chatId } = data[0]
    if (!chatId) return null;
    return chatId;
}

exports.keyToChatId = keyToChatId;