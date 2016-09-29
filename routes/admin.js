"use strict";

const express = require('express');
const router  = express.Router();
const uuid = require('node-uuid');

module.exports = (knex) => {

  router.get('/polls/admin/:key', (req, res) => {
    let adminPollKey = req.params.key;
    knex
      .select("private_key")
      .from("polls")
      .then((results) => {
        if (results.length) {
          res.end('ADMIN PAGE')
        } else {
          res.status(404);
          res.render("page_not_found");
        }
    });
  });

  return router;
}
