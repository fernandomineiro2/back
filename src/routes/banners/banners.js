const express = require('express');
const BannerModel = require('./../../models/banners/banners')
const UsersModels = require('./../../models/users/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

const app = express();




//function check carateres especiais
var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
var checkForSpecialChar = function (string) {
    for (i = 0; i < specialChars.length; i++) {
        if (string.indexOf(specialChars[i]) > -1) {
            return true
        }
    }
    return false;
}
//passport
app.use(passport.initialize());
app.use(passport.session());

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// todo: criar um lugar para salvar a palavra chave do token
jwtOptions.secretOrKey = 'token_api_backend_$20'
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    //console.log('payload received', jwt_payload);
    let user = getUser({ id: jwt_payload.id });

    if (user) {
        next(null, user);
    } else {
        next(null, false);
    }
});

// use the strategy
passport.use(strategy);

//cors habilitada
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//check if exist user database
const getUser = async obj => {
    return await UsersModels.findOne({
        where: obj,
    });
};

const router = express.Router();

router.get('/getAll', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const result = await BannerModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const banner_id = req.body.banner_id;
        const result = await BannerModel.update(req.body, {
            where: {
                banner_id
            }
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const result = await BannerModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {

    try {
        const banner_id = req.params.id;
        const result = await BannerModel.destroy({
            where: {
                banner_id
            }
        });
        res.status(200).json({
            error: false,
            message: 'Banner Deletado com Sucesso',
            result
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: 'Banner Deletado com Sucesso',
            error
        });
    }
});

router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const result = await BannerModel.findByPk(req.params.id);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

module.exports = router;