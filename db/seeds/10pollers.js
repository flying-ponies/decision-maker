exports.seed = function(knex, Promise) {
  return knex('pollers').del()
    .then(function () {
      return Promise.all([
        knex('pollers').insert({email: 'fakeemail@null.com'}),
        knex('pollers').insert({email: 'notanemail@somedomain.com'}),
        knex('pollers').insert({email: 'areallylongemailaddress@alongdomaintoo.com'})
      ]);
    });
};
