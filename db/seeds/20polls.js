exports.seed = function(knex, Promise) {
  return knex('polls').del()
    .then(function () {
      return Promise.all([
        knex('polls').insert({question: 'Where should we meet for dinner?', poller_id: 1, is_open: true, public_key: 'adde735b-8ea6-47ea-a88e-99d3da149652', private_key: 'afe93ee4-e457-458c-a330-65e52af089e1'}),
        knex('polls').insert({question: 'What time for dinner?', poller_id: 1, is_open: true, public_key: 'eae6ce9a-25e0-4b91-85f6-b538f3651588', private_key: 'ea34823e-7593-4957-89df-1d2572377617'})
      ]);
    });
};
