const express = require('express');
const PaymentBillsModel = require('./../../models/payment_bills/payment_bills');
const UsersModels = require('./../../models/users/users');
const passport = require('passport');
const jwt = require('jsonwebtoken');
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


  /*
  Descrição do campo type (Tipo de pagamento)
  *1 | à vista - boleto
  *2 | 15/30/45 dias - boletos
  *3 | 20/40/60 dias - boletos
  *4 | 30/60/90 dias - boletos
  *5 | cartão de débito à vista
  *6 | cartão de crédito
  */
  formPay = req.body.type;
  objSave = {
    order_group_id: req.body.order_group_id,
    user_id: req.body.user_id,
    payment_total_value: req.body.payment_total_value,
    payment_installment_value: req.body.payment_installment_value,
    installment_qtd: 1,
    installment_nth: 1,
    date_create: req.body.date_create,
    date_payment: req.body.date_payment,
    type: req.body.type,
    status_payment: req.body.status_payment,
  }
  // boleto à vista | débito à vista | cartão de crédito
  if (formPay === 1 || formPay === 5 || formPay === 6) {
    let setStatusPay;

    if (formPay === 6) {
      setStatusPay = 2;
    } else {
      setStatusPay = 1;
    }



    objSave.status_payment = setStatusPay


    try {
      const result = await PaymentBillsModel.create(objSave);
      return res.status(200).send(result);
    } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
    }
  } else if (formPay === 2) {
    var date_req = new Date(req.body.date_payment);
    var datePayOne = new Date();
    var datePayTwo = new Date();
    var datePayThree = new Date();
    var newValueShared = req.body.payment_total_value / 3;
    datePayOne.setDate(date_req.getDate() + 16);
    datePayTwo.setDate(date_req.getDate() + 31);
    datePayThree.setDate(date_req.getDate() + 46);
    objSave.payment_installment_value = newValueShared.toFixed(2);
    objSave.installment_qtd = 3;
    objSave.installment_nth = 1;
    objSave.date_payment = datePayOne;
    objSave.status_payment = 1;
    try {
      const result = await PaymentBillsModel.create(objSave).then(
        () => {
          objSave.payment_installment_value = newValueShared.toFixed(2);
          objSave.installment_qtd = 3;
          objSave.installment_nth = 2;
          objSave.date_payment = datePayTwo;
          objSave.status_payment = 1;
          PaymentBillsModel.create(objSave).then(
            () => {
              objSave.payment_installment_value = newValueShared.toFixed(2);
              objSave.installment_qtd = 3;
              objSave.installment_nth = 3;
              objSave.date_payment = datePayThree;
              objSave.status_payment = 1;
              PaymentBillsModel.create(objSave);
            }
          );

        }
      );
      return res.status(200).send(result);
    } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
    }
  } else if (formPay === 3) {
    var date_req = new Date(req.body.date_payment);
    var datePayOne = new Date();
    var datePayTwo = new Date();
    var datePayThree = new Date();
    var newValueShared = req.body.payment_total_value / 3;
    datePayOne.setDate(date_req.getDate() + 21);
    datePayTwo.setDate(date_req.getDate() + 41);
    datePayThree.setDate(date_req.getDate() + 61);
    objSave.payment_installment_value = newValueShared.toFixed(2);
    objSave.installment_qtd = 3;
    objSave.installment_nth = 1;
    objSave.date_payment = datePayOne;
    objSave.status_payment = 1;
    try {
      const result = await PaymentBillsModel.create(objSave).then(
        () => {
          objSave.payment_installment_value = newValueShared.toFixed(2);
          objSave.installment_qtd = 3;
          objSave.installment_nth = 2;
          objSave.date_payment = datePayTwo;
          objSave.status_payment = 1;
          PaymentBillsModel.create(objSave).then(
            () => {
              objSave.payment_installment_value = newValueShared.toFixed(2);
              objSave.installment_qtd = 3;
              objSave.installment_nth = 3;
              objSave.date_payment = datePayThree;
              objSave.status_payment = 1;
              PaymentBillsModel.create(objSave);
            }
          );
        }
      );
      return res.status(200).send(result);
    } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
    }
  } else if (formPay === 4) {
    var date_req = new Date(req.body.date_payment);
    var datePayOne = new Date();
    var datePayTwo = new Date();
    var datePayThree = new Date();
    var newValueShared = req.body.payment_total_value / 3;
    datePayOne.setDate(date_req.getDate() + 31);
    datePayTwo.setDate(date_req.getDate() + 61);
    datePayThree.setDate(date_req.getDate() + 91);
    objSave.payment_installment_value = newValueShared.toFixed(2);
    objSave.installment_qtd = 3;
    objSave.installment_nth = 1;
    objSave.date_payment = datePayOne;
    objSave.status_payment = 1;
    try {
      const result = await PaymentBillsModel.create(objSave).then(
        () => {
          objSave.payment_installment_value = newValueShared.toFixed(2);
          objSave.installment_qtd = 3;
          objSave.installment_nth = 2;
          objSave.date_payment = datePayTwo;
          objSave.status_payment = 1;
          PaymentBillsModel.create(objSave).then(
            () => {
              objSave.payment_installment_value = newValueShared.toFixed(2);
              objSave.installment_qtd = 3;
              objSave.installment_nth = 3;
              objSave.date_payment = datePayThree;
              objSave.status_payment = 1;
              PaymentBillsModel.create(objSave);
            }
          );

        }
      );
      return res.status(200).send(result);
    } catch (err) {
      res.logger.log('error', err);
      return res.status(500).send(err);
    }

  }
});

router.put('/update', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const payment_bills_id = req.body.payment_bills_id;
    const result = await PaymentBillsModel.update(req.body, {
      where: {
        payment_bills_id
      }
    });
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getByUserAndGrouped/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {

    const user_id = req.params.id
    const result = await PaymentBillsModel.findAll(
      {
        where: {
          user_id,
        },
        attributes: [
          'payment_bills_id',
          'order_group_id',
          'user_id',
          'payment_total_value',
          'payment_installment_value',
          'installment_qtd',
          'installment_nth',
          'date_create',
          'type',
          'status_payment',
          [Sequelize.fn('max', Sequelize.col('date_payment')), 'date_payment']
        ],

        //group: ['order_group_id'],
        group: [Sequelize.literal('order_group_id')],
        raw: true,
        //subQuery: false,
        logging: console.log
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.post('/getGroupedWidthDate', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {

    PaymentBillsModel.belongsTo(UsersModels, {
      foreignKey: 'user_id'
    });

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);


    const dateStart = req.body.date_start;
    const dateEnd = req.body.date_end;

    const where = {};

    if (dateStart && dateEnd) {
      where.date_create = {
        [Op.between]: [dateStart, dateEnd]
      }
    } else {
      where.date_create = {
        [Op.between]: [firstDay, `${lastDay}`]
      }
    };


    const result = await PaymentBillsModel.findAll(
      {
        where,

        attributes: [
          'payment_bills_id',
          'order_group_id',
          'user_id',
          'payment_total_value',
          'payment_installment_value',
          'installment_qtd',
          'installment_nth',
          'date_create',
          'type',
          'status_payment',
          [Sequelize.fn('max', Sequelize.col('date_payment')), 'date_payment']
        ],
        include: [{
          model: UsersModels,
          required: true, // false: left join, true: inner join,
          attributes:['name']
        }],

        //group: ['order_group_id'],
        group: [Sequelize.literal('order_group_id')],
        raw: false,
        //subQuery: false,
        logging: console.log
      }
    );
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.get('/getByUserGroupIdList/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  try {

    const order_group_id = req.params.id
    const result = await PaymentBillsModel.findAll(
      {
        where: {
          order_group_id,
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
    const product_id = req.body.product_id;
    const result = await PaymentBillsModel.update(req.body, {
      where: {
        product_id
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
    const result = await PaymentBillsModel.findAll();
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

//seleciona produto por id
router.get('/:id', passport.authenticate("jwt", { session: false }), async (req, res) => {
  try {
    const result = await PaymentBillsModel.findByPk(req.params.id);
    return res.status(200).send(result);
  } catch (err) {
    res.logger.log('error', err);
    return res.status(500).send(err);
  }
});

router.delete('/delete/:id', passport.authenticate("jwt", { session: false }), async (req, res, next) => {
  const product_id = req.params.id;
  try {
    const result = await PaymentBillsModel.destroy(
      {
        where:
          { product_id }
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