const express = require('express');
const CategoriesModel = require('./../../models/categories');
const BrandsModel = require('./../../models/brands/brands');
const bodyParser = require('body-parser');

const router = express.Router();
const jsonParser = bodyParser.json();
const Sequelize = require('sequelize');
const moment = require('moment');
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

router.get('/getAll', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const result = await CategoriesModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getAllWithBrand/', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {

    CategoriesModel.belongsTo(BrandsModel, {
      foreignKey: 'brand_id'
    });

    CategoriesModel.findAll({

      include: [{
        model: BrandsModel,
        required: true, // false: left join, true: inner join,
      }],
      logging: console.log
    })
      .then(data => {
        return res.status(200).send(data);
      })
      .catch(errData => {
        return res.status(400).send(errData);
      })
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getAllByBrand/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const brand_id = req.params.id
    const result = await CategoriesModel.findAll(
      {
        where: {
          brand_id
        }
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const category_id = req.body.category_id;
    const result = await CategoriesModel.update(req.body, {
      where: {
        category_id
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
    const result = await CategoriesModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {

  try {
    const category_id = req.params.id;
    const result = await CategoriesModel.destroy({
      where: {
        category_id
      }
    });
    res.status(200).json({
      error: false,
      message: 'Categoria Deletada com Sucesso',
      result
    });
  } catch (err) {
    res.status(500).json({
      error: true,
      message: 'Categoria Deletada com Sucesso',
      error
    });
  }
});

router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
      const result = await CategoriesModel.findByPk(req.params.id);
      return res.status(200).send(result);
  } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
  }
});

module.exports = router;