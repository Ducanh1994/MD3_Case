const connection = require('../entity/connection');

class ProductService{
    connect;
    constructor() {
        connection.connectToMySQL();
        this.connect = connection.getConnection()
    }
    findAll = () => {
      return new Promise((resolve,reject) => {
          this.connect.query(`select *, category.nameCategory from product join category
    on product.idCategory = category.id`,(err,products) => {
              if(err){
                  reject(err)
              }else {
                  resolve(products)
              }
          })
      })
}
}
module.exports = new ProductService();