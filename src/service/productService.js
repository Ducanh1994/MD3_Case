const connection = require('../entity/connection');

class ProductService {
    connect;

    constructor() {
        connection.connectToMySQL()
        this.connect = connection.getConnection()
    }

    findAll = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select product.*, category.nameCategory
                                from product
                                         join category on product.idCategory = category.id`, (err, productsInDatabase) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(productsInDatabase)
                }
            })
        })
    }

    createProduct = (product) => {
        return new Promise((resolve, reject) => {
            this.connect.query(` INSERT INTO product (nameProduct, price, remainingProduct, description, image, idCategory)
                                 VALUES ('${product.name}', '${product.price}','${product.remaining_product}', '${product.description}',
                                         '${product.image}','${product.id_category}')`, (err, product) => {
                if (err) {
                    reject(err)
                } else {
                    resolve('Tạo thành công')
                }
            })
        })
    }
}


module.exports = new ProductService();