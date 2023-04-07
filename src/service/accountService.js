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
        return new Promise((resolve, reject) => {
            connect.query(`insert into store.users (username, password) values ('${account.username}','${account.password}')`,(err)=>{
                if (err) {
                    reject(err)
                }else{
                    resolve(account)
                }
            })
        })
    }
    checkUsernameExists = (user) => {
        console.log(user)
        return new Promise((resolve, reject) => {
            let connect = connection.getConnection()
            let sql =`select username as count from store.users where username = '${user.username}'`
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