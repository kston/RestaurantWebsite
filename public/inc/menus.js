let con = require('./db');

module.exports = {
  getMenus() {

    return new Promise((resolve, reject) => {

      con.query(`SELECT * FROM tb_menus ORDER BY title`, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      })


    })

  }
}