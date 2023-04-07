const fs = require('fs');
const qs = require('qs');
const accountService = require('../../service/accountService');
const cookie = require('cookie');
const alert = require('alert');
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
                    alert('wrong account,password or not registered ');
                    res.writeHead(301, {'location': '/'});
                    res.end()
                } else {
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
            let data='';
            req.on('data',chunk =>{
                data += chunk
            })
            req.on('end',async()=>{
                let user = qs.parse(data);
                let existingUser = await accountService.checkUsernameExists(user);
                if(existingUser.length>0){
                    res.writeHead(301,{'location':'/signup'})
                    res.end()
                }else{
                    await accountService.createUser(user)
                    res.writeHead(301,{'location':'/'})
                    res.end()
                }
            })
        }
    }
    logout =(req, res) => {
        res.setHeader('Set-Cookie',['user=;max-age=0'])
        res.end('cookie cleared')
        res.writeHead(301,{'location': '/'})
    }
}

module.exports = new AccountController();

