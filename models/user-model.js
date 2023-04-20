const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
	phone: {type: Number, unique: true, required: true},
	password: {type: String, required: true},
	isActivated: {type: Boolean, default: false},
	telegramId: {type: Number, default: 0},
});

module.exports = model('User', UserSchema);