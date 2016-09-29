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
    //NEEDS TO FILTER OUT EMPTY REQ.BODY
    const privatePollKey = uuid.v4();
    const publicPollKey = uuid.v4();
    let question = req.body.question;
    let email = req.body.email;
    let optionTitle = req.body['option-title'];
    let optionDescription = req.body['option-description'];
    return knex('pollers').insert({'email': email}).returning('id').then((resultA) => {
      let pollerId = resultA[0];
      return knex('polls').insert({'question': question,
        'poller_id': pollerId,
        'public_key': publicPollKey,
        'private_key': privatePollKey
      }).returning('id').then((resultB) => {
        let pollId = resultB[0];
        optionTitle.forEach((title, index) => {
          let description = optionDescription[index];
          return knex('choices').insert({'poll_id': pollId, 'title': title, 'description': description, 'points': 0}).then(() => {
            res.redirect("polls/admin/" + privatePollKey);
          });
        });
      });
    });

  });

  return router;
}
