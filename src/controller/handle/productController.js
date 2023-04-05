const fs = require('fs');
const productService = require('../../service/productService');
class ProductController{
    getHtmlProduct = (products,indexHtml) =>{
        let productHtml = '';
        products.map(item =>{
            productHtml += `
            <tr>
                    <td>${item.nameProduct}</td>
                    <td>${item.price}</td>
                    <td>${item.remainingProduct}</td>
                    <td>${item.image}</td>
                    <td><button type="button" class="btn btn-primary">Add to cart</button></td>
                    
            </tr>        
            `
        })
        indexHtml = indexHtml.replace('{products}',productHtml);
        return indexHtml;
    }
    showHome =  (req,res) =>{
        fs.readFile('./view/index.html','utf-8', async(err,indexHtml)=>{
            let products = await productService.findAll();
            indexHtml = this.getHtmlProduct(products,indexHtml);
            res.write(indexHtml);
            res.end;
        })
    }
}
module.exports = new ProductController();
// let product = new ProductController();
// product.showHome();
