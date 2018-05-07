
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('migrations', function(table){
      table.string('latest');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
};
