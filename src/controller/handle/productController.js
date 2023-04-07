 const fs = require('fs');
const qs = require('qs');
const productService = require('../../service/productService');
const categoryService = require('../../service/categoryService');
const cartService = require('../../service/cartService');

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

    getCart = (products,viewCartHtml) =>{
        let cartHtml = '';
        products.map(item =>{
            cartHtml += `
            <tr>
          <td>${item.nameProduct}</td>
          <td>${item.price}</td>
          <td>${item.quantity}</td>
          <td>${item.description}</td>
          <td>${item.image}</td>
          <div class = "btn">
          <td><a href="/add/${item.id}"><button type="button" class="btn btn-primary" >Add</button></a></td>
          <td><a href="/edit/${item.id}"><button type="button" class="btn btn-warning" >Edit</button></a></td>
         <td><a href="/remove/${item.id}"><button type="button"   class="btn btn-danger" >Delete</button></a></td>
         </div>
            </tr>`
        })
        viewCartHtml = viewCartHtml.replace('{products}',cartHtml);
        return viewCartHtml;
    }
    showCart = (req,res) =>{
        fs.readFile('/Users/nguyennhattan/WebstormProjects/12/ngay16/baingay4_4/MD3_Case/src/view/cart/viewCart.html','utf-8',async (err,viewCartHtml)=>{
            let products = await cartService.findAllCart();
            viewCartHtml = this.getCart(products,viewCartHtml);
            res.write(viewCartHtml);
            res.end();
        })
    }

    getSubProductsHtml = (products,subHtml) =>{
        let productHtml = ''
        products.map(item => {
            productHtml += `
        <tr>
          <td>${item.nameProduct}</td>
          <td>${item.price}</td>
          <td>${item.remainingProduct}</td>
          <td>${item.description}</td>
          <td>${item.image}</td>
          <div class = "btn">
          <td><a href="/add/${item.id}"><button type="button" class="btn btn-primary" >Add to cart</button></a></td>
         </div>
            </tr>`
        })

        subHtml = subHtml.replace('{products}', productHtml);
        return subHtml;
    }
    showSub = (req, res) => {
        fs.readFile('./view/sub.html', "utf-8", async (err, subHtml) => {
            let products = await productService.findAll();
            subHtml = this.getSubProductsHtml(products,subHtml)

            let htmlCategory = '';
            let categories = await categoryService.findAll();

            categories.map(item => {
                htmlCategory += `<option value="${item.id}">${item.nameCategory}</option>`
            })
            subHtml = subHtml.replace('{filter}', htmlCategory);

            res.write(subHtml);
            res.end();
        })
    }
    showHome = (req, res) => {
        fs.readFile('./view/index.html', "utf-8", async (err, indexHtml) => {
            let products = await productService.findAll();
            indexHtml = this.getProductHtml(products, indexHtml);

            let htmlCategory = '';
            let categories = await categoryService.findAll();

            categories.map(item => {
                htmlCategory += `<option value="${item.id}">${item.nameCategory}</option>`
            })
            indexHtml = indexHtml.replace('{filter}', htmlCategory);

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
                editHtml = editHtml.replace('{categories}', htmlCategory);
                res.write(editHtml);
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
                    let editProduct = await productService.editProduct(product, id)
                    res.writeHead(301, {'location': '/home'})
                    res.end();
                }
            })
        }
    }

    searchProduct = (req, res) => {
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
                fs.readFile("./view/index.html", "utf-8", (err, data) => {
                    data = this.getProductHtml(products, data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }
    filterCategory = (req, res) => {
        if (req.method === "GET") {
            fs.readFile("./view/index.html", "utf-8", async (err, indexHtml) => {
                let htmlCategory = '';
                let categories = await categoryService.findAll();

                categories.map(item => {
                    htmlCategory += `<option value="${item.id}">${item.nameCategory}</option>`
                })
                indexHtml = indexHtml.replace('{filter}', htmlCategory);
                res.write(indexHtml);
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
                    let option = qs.parse(data);
                    console.log("option:", option, "id:", +(option["filter"]))
                    let products = await categoryService.filterCategory(+(option["filter"]));
                    fs.readFile("./view/index.html", "utf-8", (err, data) => {
                        data = this.getProductHtml(products, data);
                        res.write(data);
                        res.end();
                    })
                }
            })
        }
    }
}

module.exports = new ProductController();