
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('phone_numbers', function(table){
        table.increments( 'id' );
        table.text( 'phone_number' );
      }),
      knex.schema.alterTable('phone_numbers', function(t) {
        t.unique('phone_number')
      }),
      knex.schema.createTable('polls_to_phone_numbers', function(table){
        table.increments( 'id' );
        table.integer( 'poll_id' ).references( 'id' ).inTable('polls');;
        table.integer( 'phone_number_id' ).references( 'id' ).inTable( 'phone_numbers' );
      })
    ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable( 'polls_to_phone_numbers' ),
    knex.schema.dropTable( 'phone_numbers' )
    ]);
};
