"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.get('/polls/:key', (req, res) => {
    let publicPollKey = req.params.key;
    knex
      .select("public_key")
      .from("polls")
      .where("public_key", publicPollKey)
      .then((results) => {
        if (results.length) {
          //GETS INFO FROM DB
          // knex.multiQuery([
          //   knex
          //     .select("pollers.email","polls.question","polls.is_open")
          //     .from("polls")
          //     .innerJoin("pollers","polls.poller_id","pollers.id")
          //     .innerJoin("choices","polls.id","choices.poll_id")
          //     .where("public_key", publicPollKey),
          //   knex
          //     .select("choices.title","choices.description", "points")
          //     .from("polls")
          //     .innerJoin("pollers","polls.poller_id","pollers.id")
          //     .innerJoin("choices","polls.id","choices.poll_id")
          //     .where("public_key", publicPollKey),
          // ]).spread((resultA, resultB) => {
          //   console.log(resultA);
          //   console.log(resultB);
          // });

                // let templateVars = {
                //   email: results[0].email,
                //   title: results[0].title,
                //   longURL: longURL,
                //   "hostName": hostName
                // };
                // console.log(templateVars);

          //PUT INFO IN TO OJBECT
          //RENDER PAGE USING EJS WITH OBJECT
          res.render('rankpoll');
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
