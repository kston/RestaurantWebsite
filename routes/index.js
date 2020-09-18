var con = require('../public/inc/db');
var express = require('express');
var menus = require('./../public/inc/menus');
var reservations = require('../public/inc/reservations');
var emails = require('../public/inc/emails');
var contacts = require('../public/inc/contacts');
var router = express.Router();

module.exports = function (io) {
	/* GET home page. */
	router.get('/', function (req, res, next) {
		menus.getMenus().then((results) => {
			res.render('index', {
				title: 'Restaurante Saboroso!',
				menus: results,
				isHome: true,
			});
		});
	});

	router.get('/contacts', function (req, res, next) {
		contacts.render(req, res);
	});

	router.post('/contacts', function (req, res, next) {
		if (!req.body.name) {
			contacts.render(req, res, 'Digite o nome');
		} else if (!req.body.email) {
			contacts.render(req, res, 'Digite o e-mail');
		} else if (!req.body.message) {
			contacts.render(req, res, 'Informe a Message');
		} else {
			contacts
				.save(req.body)
				.then((results) => {
					req.body = {};
					io.emit('Dashborad update');
					contacts.render(req, res, null, 'Contato enviado!');
				})
				.catch((err) => {
					contacts.render(req, res, err.message);
				});
		}
	});
	router.get('/menus', function (req, res, next) {
		menus.getMenus().then((results) => {
			res.render('menus', {
				title: 'Menu - Restaurante Saboroso!',
				background: 'images/img_bg_1.jpg',
				h1: 'Saboreie nosso menu!',
				menus: results,
			});
		});
	});

	router.get('/reservations', function (req, res, next) {
		reservations.render(req, res);
	});
	router.post('/reservations', function (req, res, next) {
		if (!req.body.name) {
			reservations.render(req, res, 'Digite o nome');
		} else if (!req.body.email) {
			reservations.render(req, res, 'Digite o e-mail');
		} else if (!req.body.people) {
			reservations.render(req, res, 'Informe o número de pessoas');
		} else if (!req.body.date) {
			reservations.render(req, res, 'Informe a data da reserva');
		} else if (!req.body.time) {
			reservations.render(req, res, 'Informe a hora da reserva');
		} else {
			reservations
				.savefront(req.body)
				.then((results) => {
					req.body = {};
					io.emit('Dashborad update');
					reservations.render(req, res, null, 'Reserva realizada com sucesso!');
				})
				.catch((err) => {
					reservations.render(req, res, err.message);
				});
		}
	});

	router.get('/services', function (req, res, next) {
		res.render('services', {
			title: 'Serviço - Restaurante Saboroso!',
			background: 'images/img_bg_1.jpg',
			h1: 'É um prazer poder servir!',
		});
	});

	router.post('/subscribe', function (req, res, next) {
		emails
			.save(req.body)
			.then(() => {
				menus.getMenus().then((results) => {
					res.render('index', {
						title: 'Restaurante Saboroso!',
						menus: results,
						isHome: true,
						success: 'Inscrição realizada com sucesso!',
					});
				});
			})
			.catch((err) => {
				res.send(err.message);
			});
	});

	return router;
};
