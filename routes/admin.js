"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get('/polls/admin/:key', (req, res) => {
    const privatePollKey = req.params.key;
    knex
      .select("private_key")
      .from("polls")
      .where("private_key", privatePollKey)
      .then((results) => {
        if (results.length) {
          Promise.all([
            knex
              .select("pollers.email","polls.question","polls.is_open","polls.public_key")
              .from("polls")
              .innerJoin("pollers","polls.poller_id","pollers.id")
              .where("polls.private_key", privatePollKey),
            knex
              .select("choices.id","choices.title","choices.description", "points")
              .from("polls")
              .innerJoin("choices","polls.id","choices.poll_id")
              .where("polls.private_key", privatePollKey),
          ]).then((results) => {
            const templateVars = {
              'privatePollKey': privatePollKey,
              'publicPollKey': results[0][0].public_key,
              'email': results[0][0].email,
              'question': results[0][0].question,
              'is_open': results[0][0].is_open,
              'choices': results[1]
            };
            console.log(templateVars);
          });

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
