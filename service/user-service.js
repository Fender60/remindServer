const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
	async registration(phone, password){
		const candidate = await UserModel.findOne({phone});
		if(candidate){
			throw ApiError.BadRequest(`Такой пользователь уже существует`);
		}
		const hashPassword = await bcrypt.hash(password, 3);

		const user = await UserModel.create({phone, password: hashPassword});
		
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});
		await tokenService.saveToken(userDto.id, tokens.refreshToken);

		return {...tokens, user: userDto}
	}

	async login(phone, password) {
		const user = await UserModel.findOne({phone});
		if(!user) {
			throw ApiError.BadRequest('Неверный логин и/или пароль')
		}
		const isPassEquals = await bcrypt.compare(password, user.password);
		if(!isPassEquals) {
			throw ApiError.BadRequest('Неверный логин и/или пароль');
		}
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return {...tokens, user: userDto}
	}

	async logout(refreshToken){
		const token = await tokenService.removeToken(refreshToken);
		return token;
	}

	async refresh(refreshToken) {
		if(!refreshToken) {
			throw ApiError.UnauthorizedError();
		}
		const userData = tokenService.validateRefreshToken(refreshToken);
		const tokenFromDb = await tokenService.findToken(refreshToken);
		if(!userData || !tokenFromDb) {
			throw ApiError.UnauthorizedError();
		}
		const user = await UserModel.findById(userData.id);
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return {...tokens, user: userDto}
	}

	async getAllUsers() {
		const users = await UserModel.find();
		return users;
	}

	async reset(phone, password) {
		const user = await UserModel.findOne({phone});
		if(!user){
			throw ApiError.BadRequest(`Такой пользователь не существует`);
		}
		const hashPassword = await bcrypt.hash(password, 3);
		user.password = hashPassword;
		await user.save();
		
		const userDto = new UserDto(user);
		const tokens = tokenService.generateTokens({...userDto});

		await tokenService.saveToken(userDto.id, tokens.refreshToken);
		return {...tokens, user: userDto}
	}


}

module.exports = new UserService();