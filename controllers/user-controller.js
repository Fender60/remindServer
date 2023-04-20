const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class UserController {
	async registration(req, res, next){
		try {
			const errors = validationResult(req);
			if(!errors.isEmpty()){
				return next(ApiError.BadRequest('Длина пароля дожна быть не менее 8 символов', errors.array()))
			}
			const {phone, password} = req.body;
			const userData = await userService.registration(phone, password);
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
			res.cookie('userId', userData.user.id, {maxAge: 30*24*60*60*1000, httpOnly: true});
			res.json({message: 'Cсылка для подтверждения: http://t.me/MsgRemBot'});
			return res.json(userData);
		}
		catch(e) {
			next(e);
		}
	}
	async login(req, res, next){
		try {
			const{phone, password} = req.body;
			const userData = await userService.login(phone, password);
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
			res.cookie('userId', userData.user.id, {maxAge: 30*24*60*60*1000, httpOnly: true});
			return res.json(userData);
		}
		catch(e) {
			next(e);
		}
	}
	async logout(req, res, next){
		try {
			const{refreshToken} = req.cookies;
			const token = await userService.logout(refreshToken);
			res.clearCookie('refreshToken');
			res.clearCookie('userId');
			return res.json(token);
		}
		catch(e) {
			next(e);
		}
	}

	async refresh(req, res, next){
		try {
			const{refreshToken} = req.cookies;
			const userData = await userService.refresh(refreshToken);
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
			return res.json(userData);
		}
		catch(e) {
			next(e);
		}
	}
	async getUsers(req, res, next){
		try {
			const users = await userService.getAllUsers();
			return res.json(users);
		}
		catch(e) {
			next(e);
		}
	}
	
	async resetPassword(req, res, next) {
		try {
			const{phone, password} = req.body;
			const userData = await userService.reset(phone, password);
			res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true});
			res.cookie('userId', userData.user.id, {maxAge: 30*24*60*60*1000, httpOnly: true});
			return res.json(userData);
		} 
		catch (e) {
			next(e);
		}
	}



}

module.exports = new UserController();