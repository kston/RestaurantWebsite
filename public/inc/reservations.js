var con = require('./db');
const Pagination = require('./Pagination');
var moment = require('moment');

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

	save(req) {
		return new Promise((resolve, reject) => {
			let fields = req.fields;

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

	savefront(fields) {
		return new Promise((resolve, reject) => {
			let query,
				params = [
					fields.name,
					fields.email,
					fields.people,
					fields.date,
					fields.time,
				];

			query = `  INSERT INTO tb_reservations (name, email, people, date, time) VALUES(?, ?, ?, ?, ?);
        `;

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

	chart(req) {
		return new Promise((resolve, reject) => {
			con.query(
				`
			
			SELECT CONCAT( YEAR(date), '-', MONTH(date)) AS date, 
			COUNT(*) AS total, 
			SUM(people) / COUNT(*) AS avg_people  
			FROM tb_reservations 
			WHERE date BETWEEN ? AND ?
			group by YEAR(date) , MONTH(date)
			order by YEAR(date) DESC, MONTH(date) DESC;
			
			
			`,
				[req.query.start, req.query.end],
				(err, results) => {
					if (err) {
						reject(err);
					} else {
						let months = [];
						let values = [];

						results.forEach((row) => {
							months.push(moment(row.date).format('MMM YYYY'));
							values.push(row.total);
						});
						resolve({ months, values });
					}
				}
			);
		});
	},

	dashboard() {
		return new Promise((resolve, reject) => {
			con.query(
				`
	
	SELECT
	(SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
	(SELECT COUNT(*) FROM tb_menus) AS nrmenus,
	(SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
	(SELECT COUNT(*) FROM tb_users) AS nrusers
	
	
	`,
				(err, results) => {
					if (err) {
						reject(err);
					} else {
						resolve(results[0]);
					}
				}
			);
		});
	},
};
