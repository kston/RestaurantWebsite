var con = require('./db');
module.exports = {
	render(req, res, error) {
		res.render('admin/login', {
			body: req.body,
			error,
		});
	},

	login(email, password) {
		return new Promise((resolve, reject) => {
			con.query(
				`
            
            SELECT * FROM tb_users WHERE email = ?
            
            `,
				[email],
				(err, results) => {
					if (err) {
						reject(err);
					} else {
						if (!results.length > 0) {
							reject('Usuário/senha incorretos');
						} else {
							let row = results[0];

							if (row.password !== password) {
								reject('Usuário/senha incorretos');
							} else {
								resolve(row);
							}
						}
					}
				}
			);
		});
	},
	getUsers() {
		return new Promise((resolve, reject) => {
			con.query(`SELECT * FROM tb_users ORDER BY name`, (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},

	changePassword(req) {
		return new Promise((resolve, reject) => {
			console.log(req);
			if (!req.fields.password) {
				reject('Preencha a Senha!');
			} else if (req.fields.password !== req.fields.passwordConfirm) {
				reject('As senhas digitadas estão diferentes');
			} else {
				con.query(
					`UPDATE tb_users SET password = ? WHERE id = ?`,
					[req.fields.password, req.fields.id],
					(err, results) => {
						if (err) {
							reject(err.message);
						} else {
							resolve(results);
						}
					}
				);
			}
		});
	},

	save(fields) {
		return new Promise((resolve, reject) => {
			let query,
				params = [fields.name, fields.email];
			if (parseInt(fields.id) > 0) {
				params.push(fields.id);
				query = ` 
					UPDATE tb_users 
					SET name = ?,  
					email = ? 
					
			  WHERE id = ?
			  `;
			} else {
				params.push(fields.password);
				query = `  INSERT INTO tb_users (name, email, password) VALUES(?, ?, ?)
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
			con.query(`DELETE FROM tb_users WHERE id = ?`, [id], (err, results) => {
				if (err) {
					reject(err);
				} else {
					resolve(results);
				}
			});
		});
	},
};
