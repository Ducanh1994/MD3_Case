const http = require('http');
const router = require('./controller/router');
const errorController = require ('./controller/handle/errorController');
const server = http.createServer((req,res) =>{
    let url = req.url;
    let arrPath = url.split('/');
    let path = '';
    let id = -1;
    if (arrPath.length > 2) {
        path = arrPath[1];
        id = arrPath[2]
    }
    if (arrPath.length <= 2){
        path = arrPath[1];
    }
    let chosenhandle;
    if (router[path] !== undefined){
        chosenhandle = router[path]
    }
    else {
        chosenhandle = errorController.showNotFound;
    }
    chosenhandle(req,res,id);
});

server.listen(3000,'localhost',() => {
    console.log('Server is running');
});
