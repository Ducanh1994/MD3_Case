const accountController = require('./handle/accountController');
const productController = require('./handle/productController');

const router = {
     "" : accountController.login,
     "home": productController.showHome,
     "create": productController.createProduct
}

module.exports = router;