const express = require('express');
const OrdersModel = require('./../../models/orders');
const UsersModels = require('./../../models/users/users');
const ProductsModel = require('./../../models/products/products');
const PaymentBillsModel = require('./../../models/payment_bills/payment_bills');

const passport = require('passport');
const passportJWT = require('passport-jwt');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');


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

router.post('/create', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const result = await OrdersModel.create(req.body);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    console.log(err);

    return res.status(500).send(err);
  }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const order_id = req.body.order_id;
    const result = await OrdersModel.update(req.body, {
      where: {
        order_id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.put('/updateToMany', passport.authenticate("jwt", { session: false }), (req, res) => {

  try {
    let ids = req.body;
    const result = OrdersModel.update(
      {
        delivery: 1,
        date_delivered: moment().format('YYYY-MM-DD')
      }, { where: { order_id: ids } }
    );
    console.log(ids);

    return res.status(200).send(result);

  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
});

router.put('/updateGroup', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const order_group_id = req.body.order_group_id;

    const result = await OrdersModel.update(req.body, {
      where: {
        order_group_id
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
    OrdersModel.belongsTo(ProductsModel, {
      foreignKey: 'product_id'
    });

    const result = await OrdersModel.findAll({
      include: [{
        model: ProductsModel,
        required: true, // false: left join, true: inner join,
      }]
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getByUser/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    OrdersModel.belongsTo(ProductsModel, {
      foreignKey: 'product_id'
    });
    const user_id = req.params.id
    const result = await OrdersModel.findAll(

      {
        include: [{
          model: ProductsModel,
          required: true, // false: left join, true: inner join,
        }],
        logging: console.log,
        where: {
          user_id
        }
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getByUserAndGrouped/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    OrdersModel.belongsTo(ProductsModel, {
      foreignKey: 'product_id',
    });
    const user_id = req.params.id
    const result = await OrdersModel.findAll(

      {
        include: [{
          model: ProductsModel,
          required: true, // false: left join, true: inner join,
        }],
        logging: console.log,
        where: {
          user_id,
        },
        group: ['order_group_id']
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/getAllWithProducts', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    const dateStart = req.body.date_start;
    const dateEnd = req.body.date_end;
    const status = req.body.status;
    const delivery = req.body.delivery;
    const where = {};

    if (dateStart && dateEnd) {
      where.datecreate = {
        [Op.between]: [dateStart, dateEnd]
      }
    } else {
      where.datecreate = {
        [Op.between]: [firstDay, `${lastDay}`]
      }
    };


    if (status) {
      where.status = status;
    };

    if (delivery) {
      where.delivery = delivery;
    };

    OrdersModel.belongsTo(ProductsModel, {
      foreignKey: 'product_id'
    });

    // OrdersModel.belongsTo(PaymentBillsModel, {
    //   foreignKey: 'order_group_id'
    // });



    const result = await OrdersModel.findAll({
      where,
      include: [{
        model: ProductsModel,
        required: true, // false: left join, true: inner join,
      }
      //,
      // {
      //   model: PaymentBillsModel,
      //   required: true
      // }
      ],
      group: ["order_group_id"],
      // logging: console.log
    });
    return res.status(200).send(result);
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
});

router.get('/orderToCart/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {
    const order_group_id = req.params.id


    OrdersModel.belongsTo(ProductsModel, {
      foreignKey: 'product_id'
    });

    const result = await OrdersModel.findAndCountAll({
      where: {
        order_group_id
      },
      include: [{
        model: ProductsModel,
        required: true, // false: left join, true: inner join,
      }],
      logging: console.log
    });
    return res.status(200).send(result);
  } catch (err) {
    console.log(err)
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  const order_id = req.params.id;
  try {
    const result = await OrdersModel.destroy(
      {
        where:
          { order_id }
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

module.exports = router;