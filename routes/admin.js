"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get('/polls/admin/:key', (req, res) => {
    let privatePollKey = req.params.key;
    console.log("HEY");
    knex
      .select("private_key")
      .from("polls")
      .where("private_key", privatePollKey)
      .then((results) => {
        if (results.length) {
          //GETS INFO FROM DB
          //PUT INFO IN TO OJBECT
          //RENDER PAGE USING EJS WITH OBJECT
          res.end('ADMIN PAGE');
        } else {
          res.status(404);
          //ADD PAGE
          res.end("PAGE NOT FOUND");
        }
    });
  });

  router.put('/polls/admin/:key', (req, res) => {
    //OPEN AND CLOSES POLL
    return router;
  });

  return router;
}
