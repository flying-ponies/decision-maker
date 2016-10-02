
exports.up = function(knex, Promise) {
  return Promise.all([
      knex.schema.table('polls', function(table){
        table.integer( 'total_votes' ).defaultTo( 0 );
      })
    ]);
};

exports.down = function(knex, Promise) {
  return table.dropColumn('total_votes');
};
