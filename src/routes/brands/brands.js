const express = require('express');
const BrandsModel = require('./../../models/brands/brands');
const UsersModels = require('./../../models/users/users');
const uploaderCloud = require('../images/clouduploader');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const passportJWT = require('passport-jwt');

const app = express();
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
// const jsonParser = bodyParser.json();
// const Sequelize = require('sequelize');
//const moment = require('moment');


router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const result = await BrandsModel.create(req.body);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const brand_id = req.body.brand_id;
        const result = await BrandsModel.update(req.body, {
            where: {
                brand_id
            }
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAll', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const result = await BrandsModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

//seleciona marca por id
router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const result = await BrandsModel.findByPk(req.params.id);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    const brand_id = req.params.id;
    try {
        const result = await BrandsModel.destroy(
            {
                where:
                    { brand_id }
            }
        );
        return res.status(200).json({
            error: false,
            data: result
        });
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).json({
            error: true,
            data: "Erro ao excluir"
        });
    }
});

//upload imagem da marca
router.post('/uploadImage', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    return uploaderCloud.uploadCloud(req, res, 4);
});
module.exports = router;
