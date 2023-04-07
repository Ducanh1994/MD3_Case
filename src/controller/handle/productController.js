 const fs = require('fs');
const qs = require('qs');
const productService = require('../../service/productService');
const categoryService = require('../../service/categoryService');

class ProductController {
    getProductHtml = (products, indexHtml) => {
        let productHtml = ''
        products.map(item => {
            productHtml += `
        <tr style="margin: auto"> 
          <th style="background-color: sandybrown;display: none">${item.id}</th>
          <td>${item.nameProduct}</td>
          <td style="background-color: sandybrown">${item.price}</td>
          <td>${item.remainingProduct}</td>
          <td style="background-color: sandybrown">${item.description}</td>
          <td><img src="${item.image}" alt="" style="width: 50px;height: 50px"></td>
          <td style="background-color: sandybrown">${item.nameCategory}</td>
          <td><a type="button" class="btn btn-outline-secondary" href="/edit/${item.id}" style="margin-left: 20px">Edit</a></td>
          <td><a  type="button" class="btn btn-outline-danger" href="/remove/${item.id}" style="margin-right: 40px">Remove</a></td>`
        })

        indexHtml = indexHtml.replace('{products}', productHtml);
        return indexHtml;
    }

    showHome = (req, res) => {
        fs.readFile('./view/index.html', "utf-8", async (err, indexHtml) => {
            let products = await productService.findAll();
            console.log(products)
            indexHtml = this.getProductHtml(products, indexHtml);

            let htmlCategory = '';
            let categories = await categoryService.findAll();
            console.log("categories:", categories);
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
                    res.write(`<script>alert('Product created successfully.')</script>`); // Add alert message
                    res.end();
                }
            })
        }
    }

    async removeProduct(req, res, id) {
        if (req.method === 'GET') {

            fs.readFile('./view/product/delete.html', 'utf-8', async (err, removeHtml) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.writeHead(200, 'text/html');
                    removeHtml = removeHtml.replace('{id}', id);
                    res.write(removeHtml);
                    res.end();
                }
            });
        }
        else {
            let mess = await productService.removeProduct(id);
            console.log(mess);
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
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
                    res.write(`<script>alert('Product edit successfully.')</script>`); // Add alert message
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
                console.log("categories:", categories);
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

    findBestSeller = (req, res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async err => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.findBestSeller();
                console.log(1,products)
                fs.readFile("./view/index.html", "utf-8", (err, data) => {
                    data = this.getProductHtml(products, data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }
    priceLow = (req,res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async err => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.priceLow();
                fs.readFile("./view/index.html", "utf-8", (err, data) => {
                    data = this.getProductHtml(products, data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }
    priceHigh = (req,res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async err => {
            if (err) {
                console.log(err);
            } else {
                let products = await productService.priceHigh();
                fs.readFile("./view/index.html", "utf-8", (err, data) => {
                    data = this.getProductHtml(products, data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }
    priceRange = (req,res) => {
        let data = '';
        req.on('data', chunk => {
            data += chunk
        })
        req.on('end', async err => {
            if (err) {
                console.log(err);
            } else {
                let products = qs.parse(data);
                let listProduct = await productService.priceRange(products);
                fs.readFile("./view/index.html", "utf-8", (err, data) => {
                    data = this.getProductHtml(listProduct, data);
                    res.write(data);
                    res.end();
                })
            }
        })
    }
}

module.exports = new ProductController();