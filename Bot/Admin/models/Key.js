const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const keySchema = new Schema({
    Key: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    userId: { type: Number, required: true }
}, { collection: 'keys' }); // Ensure collection name is valid

module.exports = mongoose.model('Key', keySchema);