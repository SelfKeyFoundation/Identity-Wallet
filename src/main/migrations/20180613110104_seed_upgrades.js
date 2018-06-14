exports.up = async (knex, Promise) => {
    const rowCount = await knex('seed').count('id');

    await knex.schema.dropTable('seed');

    await knex.schema.createTable('seed', (table) => {
        table.string('name');
        table.timestamp('appliedAt').defaultTo(knex.raw('CURRENT_TIMESTAMP'))
    });

    if (rowCount > 0) {
        await knex('seed').insert({
            name: 'init'
        });
    }
};

exports.down = async (knex, Promise) => {
    const rowCount = await knex('seed').count('name');

    if (rowCount > 1) {
        throw new Error('Data will be lost in seed table. Aborting.');
    }

    await knex.schema.dropTable('seed');

    await knex.schema.createTable('seed', (table) => {
        table.increments('id');
        table.integer('init');
    });

    if (rowCount) {
        await knex.insert({
            init: 1
        });
    }
};
