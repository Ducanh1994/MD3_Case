const connection = require('../entity/connection')
const fs = require('fs');
class CartService{
    connect;

    constructor() {
        connection.connectToMySQL()
        this.connect = connection.getConnection()
    }
    findAllCart = () =>{
        return new Promise((resolve,reject)=>{
            let query = `select p.nameProduct,p.price,c.quantity,p.image 
from product p join cartdetail c on p.id = c.idProduct join cart c2 on c2.id = c.idCart;`;
            this.connect.query(query,(err,products)=>{
                if(err){
                    reject(err)
                }else {
                    resolve(products)
                }
            })
        })
    }
}
module.exports = new CartService();