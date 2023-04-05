const fs = require('fs');
class errorController {
    showNotFound = (req, res) => {
        fs.readFile('./view/error/notFound.html', "utf-8", (err, notFoundHtml) => {
            res.write(notFoundHtml);
            res.end();
        })
    }
}

module.exports = new errorController();
