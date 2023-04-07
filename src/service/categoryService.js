const connection = require('../entity/connection');

class CategoryService {
    connect;

    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection();
    }


    findAll = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select * from category`, (err, categories) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(categories)
                }
            })
        })
    }
    filterCategory = (categoryID) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select product.*,category.nameCategory
                                from product join category on product.idCategory = category.id
                                where product.idCategory = ${categoryID};`, (err, products) => {
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