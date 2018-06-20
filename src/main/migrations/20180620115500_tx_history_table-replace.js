/**
 * old transactions_history table is removed
 * tx_history is added with new collumns 
 */
exports.up = async (knex, Promise) => {
  await knex.schema.dropTable('transactions_history');

  await knex.schema.createTable('tx_history', (table) => {
    table.increments('id');
    table.string('hash').unique().notNullable();
    table.integer('blockNumber');
    table.integer('timeStamp').notNullable();
    table.integer('nonce');
    table.string('blockHash');
    table.string('contractAddress');
    table.string('from').notNullable();
    table.string('to').notNullable();
    table.integer('value').notNullable();
    table.string('tokenName');
    table.string('tokenSymbol');
    table.integer('tokenDecimal');
    table.integer('transactionIndex');
    table.integer('gas');
    table.integer('gasPrice').notNullable();
    table.integer('cumulativeGasUsed');
    table.integer('gasUsed');
    table.string('input');
    table.integer('confirmations');
    table.integer('isError');
    table.integer('txReceiptStatus');
    table.integer('networkId').notNullable();
    table.integer('createdAt').notNullable();
    table.integer('updatedAt');
  });

};

exports.down = async (knex, Promise) => {
  await knex.schema.dropTable('transactions_history');
};
