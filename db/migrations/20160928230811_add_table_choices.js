
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.createTable('choices', function(table){
        table.increments( 'id' );
        table.integer( 'poll_id' ).references( 'id' ).inTable('polls');;
        table.text( 'title' );
        table.text( 'description' );
        table.integer( 'points' );
      })
    ])
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('choices');
};
