var mysql = require('mysql');

module.exports = {
	connection : mysql.createConnection ({
		host : '127.0.0.1',
		database : 'houserental',
		user : 'root', 
	 	password : 'password', 
	})
}

