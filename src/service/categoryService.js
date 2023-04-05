const connection = require('../entity/connection');

class CategoryService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }


    findAll = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from category`, (err, categoryInDatabase) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(categoryInDatabase)
                }
            })
        })
    }

}

module.exports = new CategoryService();