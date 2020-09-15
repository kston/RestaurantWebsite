var con = require('./db');

module.exports = {
	render(req, res, error, success) {
		res.render('emails', {
			body: req.body,
			error,
			success,
		});
	},
	getEmails() {
		return new Promise((resolve, reject) => {
			con.query(`SELECT * FROM tb_emails`, (err, results) => {
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
			con.query(`DELETE FROM tb_emails WHERE id = ?`, [id], (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},
	save(fields) {
		return new Promise((resolve, reject) => {
			con.query(
				`
   			 INSERT INTO tb_emails (email) values(?, ?, ? )
    `,
				[fields.email],
				(err, results) => {
					if (err) {
						reject(err.message);
					} else {
						resolve(results);
					}
				}
			);
		});
	},
};
