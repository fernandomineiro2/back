const express = require('express');
const users = require('./users');
const categories = require('./categories');
const orders = require('./orders');
const images = require('./images/index');
const log = require('./logger/index');
const brands = require('./brands/brands')
const products = require('./products');
const cidade = require('./address/cidade');
const estado = require('./address/estado');
const userAddress = require('./address/users_address');
const paymentBills = require('./payment_bills/payment_bills');
const banners = require('./banners/banners');
const news = require('./news/news');
const sellers = require('./sellers/sellers');
const regions = require('./regions/regions');

const router = express.Router();

router.use('/users', users);
router.use('/categories', categories);
router.use('/orders', orders);
router.use('/images', images);
router.use('/logs', log);
router.use('/products', products);
router.use('/cidade', cidade);
router.use('/estado', estado);
router.use('/user_address', userAddress);
router.use('/brands', brands);
router.use('/payment', paymentBills);
router.use('/banners', banners);
router.use('/news', news);
router.use('/sellers', sellers);
router.use('/regions', regions);


module.exports = router;