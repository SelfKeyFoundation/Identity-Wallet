// const exec = require('child_process').exec
// const user = require('os').userInfo().username
// const appName = require('../package.json').config.forge.electronPackagerConfig.name

// var conf = []
// conf = [
//   {
//     "os": "osx",
//     "platform": "travis",
//     "remove": [
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/wallets",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/wallets",
//       "rm /Users/"+user+"/Library/Application\ Support/Electron/main-store.json",
//       "rm /Users/"+user+"/Library/Application\ Support/"+appName+"/main-store.json",
//     ]
//   },
//   {
//     "os": "osx",
//     "platform": "local",
//     "remove": [
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/Electron/wallets",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/documents",
//       "rm -rf /Users/"+user+"/Library/Application\ Support/"+appName+"/wallets",
//       "rm /Users/"+user+"/Library/Application\ Support/Electron/main-store.json",
//       "rm /Users/"+user+"/Library/Application\ Support/"+appName+"/main-store.json",
//     ]
//   }
// ]

// function newPreInit(config) {
//   return new Promise((rs,rj) => {
//     // console.log(config)
//     for (var i = config.length - 1; i >= 0; i--) {
//       var remove = config[i].remove
//       // console.log(remove)
//       for (var j = remove.length - 1; j >= 0; j--) {
//         // console.log(remove.length)
//         console.log(remove[j])
//         var rstr = '"'+remove[j]+'"'
//         exec(remove[j], err => {
//           if (err) console.log(err)
//             console.log('yosh')
//         })
//       }
//     }
//   })
// }

// newPreInit(conf)
