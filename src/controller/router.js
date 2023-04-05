const productController = require('./handle/productController');
const router = {
    "home" : productController.showHome
}
module.exports = router;