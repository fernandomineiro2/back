const express = require('express');
const UsersAddressModel = require('../../models/address/users_address');
const UsersModels = require('../../models/users/users');
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
        const result = await UsersAddressModel.findAll({

            order: [
                ['bairro', 'ASC']
            ]

        });
        return res.status(200).send(result);
    } catch (err) {
        res.logger.log('error', err);
        return res.status(500).send(err);
    }
});

router.get('/getAddressActive/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
    try {
      const user_id = req.params.id;
      const result = await UsersAddressModel.findOne({
        where: {
            user_id,
          status: 1
        }
      });
  
      return res.status(200).send(result);
    } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
    }
  });

module.exports = router;