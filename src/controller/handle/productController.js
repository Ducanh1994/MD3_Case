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
          <div class = "btn">
          <td><a href="/add/${item.id}"><button type="button" class="btn btn-primary" >Add</button></a></td>
          <td><a href="/edit/${item.id}"><button type="button" class="btn btn-warning" >Edit</button></a></td>
         <td><a href="/remove/${item.id}"><button type="button"   class="btn btn-danger" >Delete</button></a></td>
         </div>
            </tr>`
        })

        indexHtml = indexHtml.replace('{products}', productHtml);
        return indexHtml;
    }

    showHome = (req, res) => {
        fs.readFile('./view/index.html', "utf-8", async (err, indexHtml) => {
            let products = await productService.findAll();
            indexHtml = this.getProductHtml(products, indexHtml);
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

    removeProduct = (req, res, id) => {
        productService.removeProduct(id);
        res.writeHead(301, {'location': '/home'});
        res.end();
    }

    editProduct = (req, res, id) => {
        if (req.method === "GET") {
            fs.readFile("./view/product/edit.html", "utf-8", async (err, editHtml) => {
                let product = await productService.findById(id);
                let categories = await categoryService.findAll();
                console.log(product)
                editHtml = editHtml.replace('{name}', product[0].nameProduct);
                editHtml = editHtml.replace('{price}', product[0].price);
                editHtml = editHtml.replace('{remaining_product}', product[0].remainingProduct);
                editHtml = editHtml.replace('{description}', product[0].description);
                editHtml = editHtml.replace('{image}', product[0].image);
                let htmlCategory = '';
                categories.map(item => {
                    htmlCategory += `<option value="${item.id}">${item.nameCategory}</option>`
                })
                editHtml = editHtml.replace('{categories}',htmlCategory);
                res.write(editHtml);
                res.end();
             })
          }
        else {
            let data = '';
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err);
                } else {
                    let product = qs.parse(data);
                    let editProduct = await productService.editProduct(product, id)
                    res.writeHead(301, {'location': '/home'})
                    res.end();
                }
            })
        }
    }

    searchProduct = (req,res)=> {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async err => {
            if (err) {
                console.log(err);
            } else {
                let name = qs.parse(data);
                let products = await productService.searchProduct(name);
                fs.readFile("./view/index.html","utf-8",(err,data) =>{
                    data = this.getProductHtml(products,data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }

}

module.exports = new ProductController();