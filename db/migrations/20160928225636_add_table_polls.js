
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('polls', function(table){
        table.increments( 'id' );
        table.string( 'question' );
        table.integer( 'poller_id' ).references( 'id' ).inTable('pollers');;
        table.boolean( 'is_open' ).defaultTo( true );
        table.text( 'public_key' );
        table.text( 'private_key' );
      })
    ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('polls');
};
