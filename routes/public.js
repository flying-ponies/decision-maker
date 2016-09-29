"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get('/polls/:key', (req, res) => {
    const publicPollKey = req.params.key;
    knex
      .select("public_key")
      .from("polls")
      .where("public_key", publicPollKey)
      .then((results) => {
        if (results.length) {
          Promise.all([
            knex
              .select("pollers.email","polls.question","polls.is_open")
              .from("polls")
              .innerJoin("pollers","polls.poller_id","pollers.id")
              .where("polls.public_key", publicPollKey),
            knex
              .select("choices.id","choices.title","choices.description", "points")
              .from("polls")
              .innerJoin("choices","polls.id","choices.poll_id")
              .where("polls.public_key", publicPollKey),
          ]).then((results) => {
            const templateVars = {
              'email': results[0][0].email,
              'question': results[0][0].question,
              'is_open': results[0][0].is_open,
              'choices': results[1]
            };
            console.log(templateVars);
          //RENDER PAGE USING EJS WITH OBJECT
            res.render('rankpoll', templateVars);
          });

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
    res.end("Rankings Received");
  });

  return router;
}
