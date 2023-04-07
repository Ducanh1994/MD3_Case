const fs = require('fs');
const qs = require('qs');
const accountService = require('../../service/accountService');
const cookie = require('cookie');

class AccountController {
    login = (req, res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/account/login.html', 'utf-8', (err, loginHtml) => {
                res.write(loginHtml);
                res.end();
            })
        }
        else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let account = qs.parse(data);
                let accountInDatabase = await accountService.getAccount(account);
                if (accountInDatabase.length === 0) {
                    res.writeHead(301, {'location': '/'});
                    res.end()

                } else if (accountInDatabase[0].role === 'user'){
                    res.setHeader('Set-Cookie', cookie.serialize('account', JSON.stringify(accountInDatabase[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    }));
                    res.writeHead(301, {'location': '/subpage'});
                    res.end()
                }else if(accountInDatabase[0].role === 'admin') {
                     res.setHeader('Set-Cookie', cookie.serialize('account', JSON.stringify(accountInDatabase[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7 // 1 week
                    }));
                    res.writeHead(301, {'location': '/home'});
                    res.end()
                }
            })
        }
    }

    signUpAccount = (req,res) => {
        if (req.method === 'GET') {
            fs.readFile('./view/account/signup.html', 'utf-8', (err, signupHtml) => {
                res.write(signupHtml);
                res.end();
            })
        }
        else {
            let data = ''
            req.on('data', chunk => {
                data += chunk
            })
            req.on('end', async () => {
                let account = qs.parse(data);
                let accountInDatabase = await accountService.signUpAccount(account);
                res.writeHead(301, {'location': '/'});
                res.end();
            })
        }
    }
}

module.exports = new AccountController();

