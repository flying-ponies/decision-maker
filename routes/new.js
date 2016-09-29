"use strict";

const express = require('express');
const bodyParser  = require("body-parser");
const router  = express.Router();
const uuid = require('node-uuid');

module.exports = (knex) => {

router.use(bodyParser.urlencoded({ extended: true }));

  router.get('/', (req, res) => {
    res.render('index')
  });

  router.post('/polls', (req, res) => {
    // NEED REQ BODY TO POST ON TO DB
    console.log("req.headers");
    console.log(req.headers);
    console.log("req.body");
    console.log(req.body);
    const privatePollKey = uuid.v4();
    const publicPollKey = uuid.v4();
    // POST KEYS TO DB
    // PROCESS REQ BODY
    // POST PROCESSED INFO TO DB
    res.redirect("polls/admin/" + privatePollKey);
  });

  return router;
}
