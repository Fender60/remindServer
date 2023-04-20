const {Schema, model} = require('mongoose');

const ReminderSchema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	date: {type: Date, required: true},
	text: {type: String, required: true},
	status: {type: String, required: true, default: 'new'},
});

module.exports = model('Reminder', ReminderSchema);