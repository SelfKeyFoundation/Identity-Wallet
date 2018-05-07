
exports.up = function(knex, Promise) {
   return Promise.all([
    knex.schema.createTable('check2', function(table){
      table.string('testmic');
      table.timestamps();
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('check1')
  ])
};
