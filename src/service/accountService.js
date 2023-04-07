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
    createUser(account) {
        let connect = connection.getConnection()
        console.log(account)
        return new Promise((resolve, reject) => {
            connect.query(`insert into stores.account (userName, passWord) values ('${account.username}','${account.password}')`,(err)=>{
                if (err) {
                    reject(err)
                }else{
                    resolve(account)
                }
            })
        })
    }
    checkUsernameExists = (account) => {
        console.log(account)
        return new Promise((resolve, reject) => {
            let connect = connection.getConnection()
            let sql =`select username as count from stores.account where username = '${account.username}'`
            connect.query(sql, (err, result) => {
                if (err) {
                    reject(err)
                }
                if (result.length > 0) {
                    resolve(result)
                } else {
                    resolve(false)
                }
            });
        });
    }


}
module.exports = new AccountService();