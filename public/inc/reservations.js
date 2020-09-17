var con = require('./db');
const Pagination = require('./Pagination');

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
	getReservations(req) {
		return new Promise((resolve, reject) => {
			let page = req.query.page;
			let start = req.query.start;
			let end = req.query.end;

			if (!page) page = 1;
			let params = [];
			if (start && end) params.push(start, end);

			let pag = new Pagination(
				`SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations 
				${start && end ? 'WHERE date BETWEEN ? AND  ?' : ''}
				ORDER BY name LIMIT ?, ?`,
				params
			);

			pag
				.getPage(page)
				.then((data) => {
					resolve({
						data,
						links: pag.getNavigation(req.query),
					});
				})
				.catch((err) => {
					reject(err);
				});
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
