const mysql = require('mysql');

class Connection {
    configToMySQL = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'stores',
        charset: 'utf8_general_ci'
    }
    getconnection = () => {
        return mysql.createConnection(this.configToMySQL);
    }
    connectToMySQL = () => {
        this.getconnection().connect((err) => {
            if (err) {
                console.log(err);
            }
            else  {
                console.log('Connect database success')
            }
        })
    }
}
module.exports = new Connection();
