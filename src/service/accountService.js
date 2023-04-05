const connection = require('../entity/connection');

class AccountService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }

    getAccount = (account) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from account
                                where userName = '${account.username}'
                                  and passWord = '${account.password}'`, (err, accountInDatabase) => {
                if (err){
                    reject(err);
                }
                else {
                    resolve(accountInDatabase);
                }
            })
        })

    }
}
module.exports = new AccountService();