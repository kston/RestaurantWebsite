var con = require('./db');

module.exports = {
	render(req, res, error, success) {
		res.render('reservations', {
			title: 'Reserva - Restaurante Saboroso!',
			background: 'images/img_bg_2.jpg',
			h1: 'Reserve uma Mesa!',
			body: req.body,
			error,
			success,
		});
	},
	getMenus() {
		return new Promise((resolve, reject) => {
			con.query(
				`SELECT * FROM tb_reservations ORDER BY date DESC`,
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
	save(fields) {
		return new Promise((resolve, reject) => {
			let query,
				params = [
					fields.name,
					fields.email,
					fields.people,
					fields.date,
					fields.time,
				];

			if (parseInt(fields.id) > 0) {
				params.push(fields.id);
				query = ` 
				UPDATE tb_reservations  
				SET name = ?,  
				email = ?,  
        people = ?,
        date = ?,
        time = ?   			
		  WHERE id = ?

        `;
			} else {
				query = `  INSERT INTO tb_reservations (name, email, people, date, time) VALUES(?, ?, ?, ?, ?);
        `;
			}

			con.query(query, params, (err, results) => {
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
				`DELETE FROM tb_reservations WHERE id = ?`,
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
