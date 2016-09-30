"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.use('/', require('./new')(knex));
  router.use('/', require('./admin')(knex));
  router.use('/', require('./public')(knex));
  router.use('/', require('./smsSendPoll')(knex));

  return router;
}
