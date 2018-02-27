const 
	apiToken = process.env.SK_SLACK_URI
	chalk = require('chalk')
	Slack = require('slack-node')
	slack = new Slack(apiToken)
	slack.setWebhook(apiToken)

function full(options) {
	return new Promise((r, rj) => {
		console.log(chalk.yellow('FINAL SLACK PAYLOAD \n *******************'))
		console.log(options)
		slack.webhook(options, err => {
			if (err) {
				console.log(chalk.red(err))
				rj(err)
			} else {
				console.log(
					chalk.green(
						'Slack message sent to ' + options.channel + ' from ' + options.username
					)
				)
				r('done')
			}
		})
	})
}

function quick(send) {
	return new Promise((r, rj) => {
		const options = {
			username: send.name || 'SK Tests',
			channel: send.channel || '#idwallet-builds',
			icon_emoji: send.icon || ':joy:',
			attachments: [
				{
					fallback: 'issues with sending data',
					color: send.color || '#FF0000',
					text: send.text || 'Im gonna fire up Igor now, should only take a minute'
				}
			]
		}
		console.log(chalk.yellow('FINAL SLACK PAYLOAD \n *******************'))
		console.log(options)
		slack.webhook(options, (err, resp) => {
			if (err) {
				rj(console.log(chalk.red(err)))
			} else {
				console.log(resp)
				r(
					console.log(
						chalk.green(
							'Slack message sent to ' + options.channel + ' from ' + options.username
						)
					)
				)
			}
		})
	})
}

module.exports = {
	full,
	quick
}

// *** EXAMPLE FORMATS ***
// slacker.quick({
// 	name: 'gilfoyle',
// 	channel: '@ben',
// 	color: '#FF0000',
// 	text: "Im gonna fire up Igor now, should take about a minute to get the full report more or less",
// })

// slacker.full({
// 	username: 'Gilfoyle',
// 	channel: '@ben',
// 	icon_emoji: ':gilfoyle:',
// 	attachments: [
// 		{
// 			fallback: 'Gilfoyle is busy #sysadminning',
// 			color: '#FF0000',
// 			text: slackText,
// 			fields: finalFields,
// 			actions: [
// 				{
// 					type: 'button',
// 					text: 'View Full Report 🛫', // 					url: 'https://grvs.io' // 				} // 			] // 		} // 	] // })
