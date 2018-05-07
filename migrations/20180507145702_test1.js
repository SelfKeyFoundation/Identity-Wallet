
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('check1', function(table){
      table.string('onetwo');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('migrations')
  ])
};
