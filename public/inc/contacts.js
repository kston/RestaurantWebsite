var con = require('./db');

module.exports = {
	render(req, res, error, success) {
		res.render('contacts', {
			title: 'Contato - Restaurante Saboroso!',
			background: 'images/img_bg_3.jpg',
			h1: 'Diga um oi!',
			body: req.body,
			error,
			success,
		});
	},
	save(fields) {
		return new Promise((resolve, reject) => {
			con.query(
				`
    INSERT INTO tb_contacts (name, email, message) values(?, ?, ? )
    `,
				[fields.name, fields.email, fields.message],
				(err, results) => {
					if (err) {
						reject(err);
					} else {
						resolve(results);
					}
				}
			);
		});
	},

	getContacts() {
		return new Promise((resolve, reject) => {
			con.query(`SELECT * FROM tb_contacts ORDER BY name`, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},

	delete(id) {
		return new Promise((resolve, reject) => {
			con.query(
				`DELETE FROM tb_contacts WHERE id = ?`,
				[id],
				(err, results) => {
					if (err) {
						reject(err);
					} else {
						resolve(results);
					}
				}
			);
		});
	},
};
