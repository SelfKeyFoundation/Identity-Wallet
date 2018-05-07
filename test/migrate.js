const knexFile = require('../knexfile.js')
const knex = require('knex')(knexFile)
const knexMigrate = require('knex-migrate')
const mv = '20180507173236'

async function run() {

	const log = ({ action, migration }) => console.log('Doing ' + action + ' on ' + migration)
	await knexMigrate('up', { to: mv}, log)
}

run().then(
  () => {},
  err => {
    console.error(err.message)
    process.exit(1)
  }
)