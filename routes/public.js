"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get('/polls/:key', (req, res) => {
    let publicPollKey = req.params.key;
    console.log("HEY");
    knex
      .select("public_key")
      .from("polls")
      .where("public_key", publicPollKey)
      .then((results) => {
        if (results.length) {
          //GETS INFO FROM DB
          knex
            .select("pollers.email","polls.question","polls.is_open","choices.title","choices.description")
            .from("polls")
            .innerJoin("pollers","poll.poller_id","polls.id")
            .innerJoin("choices","polls.id","choices.poll_id")
            .where("public_key", publicPollKey)
            .then((results) => {
              console.log(results);
            });


          //PUT INFO IN TO OJBECT
          //RENDER PAGE USING EJS WITH OBJECT
          res.end('PUBLIC PAGE');
        } else {
          res.status(404);
          //ADD PAGE
          res.end("PAGE NOT FOUND");
        }
    });
  });

  router.post('/polls/:key', (req, res) => {
    // REQ BODY FROM POST GETS PROCESSED AND PUT IN TO DB
    // AJAX WILL HANDLE PAGE UPDATE
    return router;
  });

  return router;
}
