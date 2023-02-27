const express = require('express');
const Promo = require('../models/promotion');
const promotionRouter = express.Router();

promotionRouter.route('/')
.get((req, res, next) => {
    Promo.find()
    .then(promos => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promos);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Promo.create(req.body)
    .then(promo => {
        console.log('Promotion Created: ', promo);
        res.statusCode = (200);
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promo.deleteMany()
    .then(response => {
        res.statuscode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

promotionRouter.route('/:promotionId')
.get((req, res, next) => {
    Promo.findById(req.params.promotionId)
    .then(promo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application.json');
        res.json(promo);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /promotions/${req.params.promotionId}`);
})
.put((req, res, next) => {
    Promo.findByIdAndUpdate(req.params.promotionId,
        {$set: req.body},
        { new: true }
    )
    .then(promo => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promo);
    })
    .catch(err => next(err));
})
.delete((req, res, next) => {
    Promo.findByIdAndDelete(req.params.promotionId)
    .then(response => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

module.exports = promotionRouter;