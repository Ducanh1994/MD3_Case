const accountController = require('./handle/accountController');

const router = {
     "" : accountController.login
}

module.exports = router;