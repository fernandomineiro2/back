const express = require('express');
const RegionModel = require('./../../models/regions/regions')
const CidadeModel = require('../../models/address/cidade');
const SellerModel = require('../../models/sellers/sellers')
const EstadoModel = require('../../models/address/estado');
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
        const result = await RegionModel.findAll();
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const region_id = req.body.region_id;
        console.log(region_id);

        const result = await RegionModel.update(req.body, {
            where: {
                region_id
            },
            logging: console.log
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const result = await RegionModel.create(req.body, { logging: console.log });
        logging: console.log
        return res.status(200).send(result);

    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {

    try {
        const region_id = req.params.id;
        const result = await RegionModel.destroy({
            where: {
                region_id
            }
        });
        res.status(200).json({
            error: false,
            message: 'Região Deletado com Sucesso',
            result
        });
    } catch (err) {
        res.status(500).json({
            error: true,
            message: 'Região Deletado com Sucesso',
            error
        });
    }
});

router.get('/getById/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const result = await RegionModel.findByPk(req.params.id);
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAllBySeller/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        RegionModel.belongsTo(CidadeModel, {
            foreignKey: 'region_city_id'
        });
        RegionModel.belongsTo(EstadoModel, {
            foreignKey: 'region_state_id'
        });

        const seller_id = req.params.id
        const result = await RegionModel.findAndCountAll({
            include: [{
                model: CidadeModel,
                required: true, // false: left join, true: inner join,
            },
            {
                model: EstadoModel,
                required: true
            }
            ],
            where: { seller_id }
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAllStates', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        RegionModel.belongsTo(EstadoModel, {
            foreignKey: 'region_state_id'
        });
        const result = await RegionModel.findAll({
            include: [{
                model: EstadoModel,
                required: true
            }],
            group: ['region_state_id']
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAllCitiesByState/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const region_state_id = req.params.id
        RegionModel.belongsTo(CidadeModel, {
            foreignKey: 'region_city_id'
        });
        const result = await RegionModel.findAll({
            include: [{
                model: CidadeModel,
                required: true
            }],
            where: {
                region_state_id
            },
            group: ['region_city_id']
        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAllUsersByCity/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
        const region_city_id = req.params.id
        RegionModel.belongsTo(SellerModel, {
            foreignKey: 'seller_id'
        });
        const result = await RegionModel.findAll({
            include: [{
                model: SellerModel,
                required: true
            }],
            where: {
                region_city_id
            },

        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});



module.exports = router;