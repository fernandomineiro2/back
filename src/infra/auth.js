const jwt = require('jsonwebtoken')
    , { promisify } = require('util');

const verify = promisify(jwt.verify);
// todo: criar um lugar para configurar a palavra chave do token

module.exports = async (req, res, next) => {
    const token = req.headers['x-access-token'];
    console.log('token enviado pelo usuário', token);

    if (token) {
        try {
            const decoded = await verify(token, 'token_api_backend_$20'); //req.app.get('secret'));
            //  console.log(`Valid token received: ${token}`);
            req.user = decoded;
            next();
        } catch (err) {
            console.log("error", `Invalid token send by front: ${token}`);
            return res.sendStatus(401);
        }
    } else {
        console.log("error", `Invalid token not sent: ${token}`);
        return res.sendStatus(401);
    }
}