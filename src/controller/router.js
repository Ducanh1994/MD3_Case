const accountController = require('./handle/accountController');
const productController = require('./handle/productController');

const router = {
     "" : accountController.login,
     "home": productController.showHome,
     "create": productController.createProduct,
     "remove": productController.removeProduct,
     "edit": productController.editProduct,
     "search": productController.searchProduct
}

module.exports = router;