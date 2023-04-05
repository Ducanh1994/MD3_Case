const fs = require('fs');
const qs = require('qs');
const productService = require('../../service/productService');
const categoryService = require('../../service/categoryService');

class ProductController {
    getProductHtml = (products, indexHtml) => {
        let productHtml = ''
        products.map(item => {
            productHtml += `
        <tr>
          <th>${item.id}</th>
          <td>${item.nameProduct}</td>
          <td>${item.price}</td>
          <td>${item.remainingProduct}</td>
          <td>${item.description}</td>
          <td>${item.image}</td>
          <td>${item.nameCategory}</td>
          <td><a type="button" href=""></a>Edit</td>
          <td><a type="button" href=""></a>Remove</td>`
        })

        indexHtml = indexHtml.replace('{products}',productHtml);
        return indexHtml;
    }

    showHome = (req,res) => {
        fs.readFile('./view/index.html',"utf-8",async (err,indexHtml) => {
            let products = await productService.findAll();
            console.log(products)
            indexHtml = this.getProductHtml(products,indexHtml);
            res.write(indexHtml);
            res.end();
        })
    }

    createProduct = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/product/create.html', 'utf-8', async (err, createHtml) => {

                let categories = await categoryService.findAll();
                let htmlCategory = '';
                categories.map(item => {
                    htmlCategory += `<option value="${item.id}">${item.nameCategory}</option>`
                })
                createHtml = createHtml.replace('{categories}', htmlCategory);
                res.write(createHtml);
                res.end();
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err);
                } else {
                    let product = qs.parse(data);
                    let addProduct = await productService.createProduct(product)
                    res.writeHead(301, {'location': '/home'})
                    res.end();
                }
            })
        }
    }

}

module.exports = new ProductController();