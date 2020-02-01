/*
Tratamento das operacoes de DB do Chat, 
isolado do restante das rotas e models por ser contexto auxiliar
*/
const ChatModel = require('../models/chat/index');
const moment = require('moment');

'use strict';
class QueryHandler {

	constructor() {
		// se precisar inicializar algo deve ser feito aqui
	}

	userNameCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {
				// ir no model de usuário ou garçon para validar o usuário, se necessário
			} catch (error) {
				reject(error)
			}
		});
	}

	getUserByUsername(username) {
		return new Promise(async (resolve, reject) => {
			try {

			} catch (error) {
				reject(error)
			}
		});
	}

	makeUserOnline(userId) {
		return new Promise(async (resolve, reject) => {
			try {

			} catch (error) {
				reject(error)
			}
		});
	}

	registerUser(data) {
		return new Promise(async (resolve, reject) => {
			try {

			} catch (error) {
				reject(error)
			}
		});
	}

	userSessionCheck(data) {
		return new Promise(async (resolve, reject) => {
			try {

			} catch (error) {
				reject(error)
			}
		});
	}

	getUserInfo({ userId, socketId = false }) {
		// localizar o garçon ou funcionário, se preciso

	}

	addSocketId({ userId, socketId }) {
		// verificar se será necessário registrar o usuário para o chat, a priori nao

		return new Promise(async (resolve, reject) => {
			try {

			} catch (error) {
				reject(error)
			}
		});
	}

	getChatList(userId) {
		return new Promise(async (resolve, reject) => {
			try {
				// retornar o array de chats desse usuário, pensar em como tratar com o garçon também, ele pode sempre ser um emissor ou um receptor de mensgem

			} catch (error) {
				reject(error)
			}
		});
	}

	insertMessages(messagePacket, socketid) {
		return new Promise(async (resolve, reject) => {
			try {

				let date = moment(new Date().toISOString()).format('YYYY MM DD');
				let time = moment(new Date().toISOString()).format('HH:mm:ss');
				let chat = {
					senderuuid: messagePacket.senderuuid,
					chat: messagePacket.chat,
					receiveruuid: messagePacket.receiveruuid,
					date,
					time,
					socketid
				}
				const messageResult = ChatModel.create(chat);
				resolve(messageResult);
			} catch (error) {
				reject(error)
			}
		});
	}

	getMessages({ senderuuid, receiveruuid }) {

		return new Promise(async (resolve, reject) => {
			try {
				let result = ChatModel.findAll({
					where: {
						senderuuid,
						receiveruuid
					},
					order: [
						['chat_id', 'DESC'],
					]
				});

				resolve(result);
			} catch (error) {
				reject(error)
			}
		});
	}

	logout(userID, isSocketId) {

		return new Promise(async (resolve, reject) => {
			try {
				// registrar o usuário com inativo, se necessário
			} catch (error) {
				reject(error)
			}
		});
	}
}

module.exports = new QueryHandler();
