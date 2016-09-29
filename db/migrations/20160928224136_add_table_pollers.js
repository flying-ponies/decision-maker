
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('pollers', function(table){
      table.increments( 'id' );
      table.string( 'email' );
    })
  ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('pollers');
};
