exports.seed = function(knex, Promise) {
  return knex('choices').del()
    .then(function () {
      return Promise.all([
        knex('choices').insert({poll_id: 1, title:'Otokomae Guu', description: 'Gastown Guu is busy, so we better get there early', points:2 }),
        knex('choices').insert({poll_id: 1, title:'Alibi Room', description: 'Gastown, Alibi Room has a few snacks like chacuterie plate', points:1 }),
        knex('choices').insert({poll_id: 2, title:'6pm', description: '', points:0 }),
        knex('choices').insert({poll_id: 2, title:'7pm', description: '', points:0 }),
        knex('choices').insert({poll_id: 2, title:'8pm', description: '', points:0 })
      ]);
    });
};
