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
    filterCategory = (ID) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                where product.idCategory = ${ID}`, (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }
}

module.exports = new CategoryService();