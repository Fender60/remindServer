const reminderService = require('../service/reminder-service');
const ApiError = require('../exceptions/api-error');

class ReminderController {


	async addReminder(req, res, next) {
		try {
				const {userId} = req.cookies;
				const {date, text} = req.body;
				const userBody = await reminderService.addReminder(date, text, userId);
				return res.json(userBody);
		}
		catch (e) {
				next(e);
		}
	}

	async editReminder(req, res, next) {
		try {
				const {id, date, text} = req.body;
				const reminderBody = await reminderService.editReminder(id, date, text);
				return res.json(reminderBody);
		}
		catch (e) {
				next(e);
		}
	}

	async deleteReminder(req, res, next) {
		try {
				const {reminderId} = req.body;
				const reminderBody = await reminderService.deleteReminder(reminderId);
				return res.json(reminderBody);
		}
		catch (e) {
				next(e);
		}
	}


	async allReminders(req, res, next) {
		try {
				const {userId} = req.cookies;
				const {page, limit} = req.query;
				const reminders = await reminderService.getReminder(userId, page, limit);
				res.set('Access-Control-Expose-Headers', 'X-Total-Count')
				res.set('X-Total-Count', reminders.totalCount);
				return res.json(reminders.limitReminders);
		}
		catch (e) {
				next(e);
		}
	}

}

module.exports = new ReminderController();
