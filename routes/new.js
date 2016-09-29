"use strict";

const express = require('express');
const router  = express.Router();
const uuid = require('node-uuid');

module.exports = (knex) => {

  router.get('/', (req, res) => {
    res.render('index')
  });

  router.post('/polls', (req, res) => {
    // NEED REQ BODY TO POST ON TO DB
    const privatePollKey = uuid.v4();
    const publicPollKey = uuid.v4();
    // POST KEYS TO DB
    // PROCESS REQ BODY
    // POST PROCESSED INFO TO DB
    res.redirect("polls/admin/" + privatePollKey);
  });

  return router;
}
