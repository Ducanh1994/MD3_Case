const connection = require('../entity/connection');
const fs = require("fs");

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

    findById = (id) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select product.*, category.nameCategory
                                from product
                                         join category on product.idCategory = category.id
                                where product.id = ${id}`, (err, productsInDatabase) => {
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
            this.connect.query(` INSERT INTO stores.product (nameProduct, price, remainingProduct, description, image, idCategory)
                                 VALUES ('${product.name}', ${product.price}, ${product.remaining_product},
                                         '${product.description}',
                                         '${product.image}', ${product.id_category})`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve("Create Success")
                }
            })
        })
    }

    removeProduct = (id) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`delete
                                from product
                                where id = ${id}`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve("Remove Success")
                }
            })
        })
    }
    editProduct = (product, id) => {
        return new Promise((resolve, reject) => {
            this.connect.query(`update product
                                set nameProduct      = '${product.name}',
                                    price            = ${product.price},
                                    remainingProduct = ${product.remaining_product},
                                    description      = '${product.description}',
                                    image            = '${product.image}',
                                    idCategory       = ${product.id_category}
                                where id = ${id}`, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve("Insert Success")
                }
            })
        })
    }
    searchProduct = (name) => {
        console.log(name)
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                where nameProduct like '${name.search}%'`, (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }
    findBestSeller = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                order by price
                                limit 5`, (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }
    priceLow = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                order by price`, (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }
    priceHigh = () => {
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                order by price desc `, (err, products) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(products)
                }
            })
        })
    }
    priceRange = (products) => {
        console.log(products)
        return new Promise((resolve, reject) => {
            this.connect.query(`select *
                                from product
                                where ${products.min} <= price and price <= ${products.max}`, (err, products) => {
                if (err) {
                    reject (err)
                }
                else {
                    resolve(products)
                }
            })
        })
    }
}


module.exports = new ProductService();