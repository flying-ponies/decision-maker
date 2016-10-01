"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.use('/', require('./new')(knex));
  router.use('/', require('./admin')(knex));
  router.use('/', require('./public')(knex));
  router.use('/', require('./smsSendPoll')(knex));
  router.use('/', require('./smsRecvPoll')(knex));
  router.get(/.*/, (req, res) => {
    res.render("not_found");
  });

  return router;
}
