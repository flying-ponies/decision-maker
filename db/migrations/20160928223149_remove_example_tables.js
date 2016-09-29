
exports.up = function(knex, Promise) {
  return knex.schema.dropTable('users');
};

exports.down = function(knex, Promise) {

};
