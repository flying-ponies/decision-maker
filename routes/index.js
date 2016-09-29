"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
  router.use('/', require('./new')(knex));
  return router;
}
