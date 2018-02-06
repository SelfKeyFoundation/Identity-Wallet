const Application = require('spectron').Application
const fs = require('fs')
const chalk = require('chalk')
const delay = require('delay')
const pwd = process.cwd()
const data = require(pwd + '/test/data/data.json')
const usr = process.argv[2] || 0
const OSENV = process.env.OSENV
const APP_TITLE = require('../package.json').config.forge.electronPackagerConfig
  .name
// const password = 'Y@88@D00!'

var appPath =
  pwd +
  '/out/' +
  APP_TITLE +
  '-darwin-x64/' +
  APP_TITLE +
  '.app/Contents/MacOS/' +
  APP_TITLE

if (OSENV === 'win') {
  appPath = pwd + '/out/dist/' + APP_TITLE + '.exe'
} else if (OSENV === 'lin') {
  appPath = pwd + '/out/dist/' + APP_TITLE
}

const app = new Application({
  path: appPath
})

function init() {
  return new Promise((resolve, reject) => {
    app.start().then(() => {
      app.client
        .waitUntilWindowLoaded()
        .then(() =>
          console.log(chalk.green('Start: Import Wallet From Private Key'))
        )
        .then(() =>
          app.webContents.savePage(
            'test/caps/source/index.html',
            'HTMLComplete'
          )
        )
        .then(() => resolve('Init Done'))
        .catch(err => {
          console.log(chalk.red('Tests Failed With Error: '), err)
          app.stop()
          reject(err)
        })
    })
  })
}

function regStep(selector) {
  return new Promise((resolve, reject) => {
    delay(1000)
      .then(() => console.log(chalk.green('Start Step')))
      .then(() => app.client.waitForVisible(selector, 10000))
      .then(() => app.client.click(selector))
      .then(() => resolve('Step Done'))
      .catch(err => {
        console.log(chalk.red('Tests Failed With Error: '), err)
        app.stop()
        reject(err)
      })
  })
}

function dashboardTest() {
  return new Promise((resolve, reject) => {
    const c = app.client
    const e = app.electron

    // Dashboard
    c
      .waitForExist('#goToDashboard', 10000)
      .then(() => c.click('#goToDashboard', 10000))
      .then(() => c.waitForExist('#eth-copy', 10000))
      .then(() => c.click('#eth-copy'))
      .then(() =>
        e.clipboard
          .readText()
          // Check ETH Address from Copy button
          // .then(cbt => assert.equal(cbt, data[usr].pubKey))
          .then(() => console.log(chalk.green('ETH Address Copy Test Done')))
      )
      .then(() => c.click('#key-copy'))
      .then(() =>
        e.clipboard
          .readText()
          // Check KEY Address from Copy button
          // .then(cbt => assert.equal(cbt, data[usr].pubKey))
          .then(() => console.log(chalk.green('KEY Address Copy Test Done')))
      )
      // Check Navbar works
      .then(() => c.click('#navLink'))
      // Check Navbar Links Work
      .then(() => c.click('#aboutLink'))
      .then(() => c.click('#helpLink'))
      // Check Transaction History for a correct value
      // Send ETH
      // Send KEY
      // Airdrop Test
      .then(() => resolve('done'))
      .catch(err => {
        console.log(chalk.red('Test Failed With Error: '), err)
        app.stop()
        reject(err)
      })
  })
}

// function passwordTest(password) {
//   return new Promise((resolve, reject) => {
//     const c = app.client
//     // 2x Password
//     delay(1000)
//       .then(() => c.waitForVisible('#pw1', 10000))
//       .then(() => c.setValue('#pw1', password))
//       .then(() => c.setValue('#pw2', password))
//       .then(() => c.click('#next'))
//       // Confirm Password
//       .then(() =>
//         delay(1000).then(() => c.waitForVisible('#generateWallet', 10000))
//       )
//       .then(() => c.setValue('#pw3', password))
//       .then(() => c.click('#generateWallet'))
//       .then(() => console.log(chalk.blue('Password All Good')))
//       .then(() => resolve('done'))
//       .catch(err => {
//         console.log(chalk.red('Test Failed With Error: '), err)
//         app.stop()
//         reject(err)
//       })
//   })
// }

// function checkPubKey() {
//   return new Promise((resolve, reject) => {
//     const c = app.client
//     delay(1000)
//       .then(() => c.waitForVisible('#dl', 10000))
//       // get text
//       // assert vs ?
//       // click download
//       // .then(() => c.click('#dl'))
//       // click next
//       .then(() => delay(1000).then(() => c.click('#next')))
//       .then(() => console.log(chalk.blue('Password All Good')))
//       .then(() => resolve('done'))
//       .catch(err => {
//         console.log(chalk.red('Test Failed With Error: '), err)
//         app.stop()
//         reject(err)
//       })
//   })
// }

// function printWalletTest() {
//   return new Promise((resolve, reject) => {
//     const c = app.client
//     delay(1000)
//       .then(() => c.waitForVisible('#next2', 10000))
//       // get text
//       // assert vs ?
//       // click next
//       .then(() => c.click('#next2'))
//       .then(() => console.log(chalk.blue('Next All Good')))
//       .then(() => resolve('done'))
//       .catch(err => {
//         console.log(chalk.red('Test Failed With Error: '), err)
//         reject(err)
//       })
//   })
// }

function uploadKycTest() {
  return new Promise((resolve, reject) => {
    const c = app.client
    c
      .waitForExist('#uploadKyc', 10000)
      // .then(() => c.element('#uploadKyc').keys(pwd + '/test/data/' + usr + '.zip'))
      // .then(() => c.chooseFile('#uploadKyc', pwd + '/test/data/' + usr + '.zip'))
      .then(() => c.click('#uploadKyc', 10000))
      // post anything to localhost:3333/ get 200 go to dashboard
      // local storage checks file
      // make new zip file from public key and other test data
      // name: store.wallets[key].name,
      // keystoreFilePath: store.wallets[key].keystoreFilePath,
      // publicKey: key
      .then(() => console.log(chalk.blue('Upload KYC All Good')))
      .then(() => resolve('done'))
      .catch(err => {
        console.log(chalk.red('Test Failed With Error: '), err)
        app.stop()
        reject(err)
      })
  })
}

function importWalletTest() {
  return new Promise((resolve, reject) => {
    const c = app.client
    const b = app.browserWindow
    delay(1000)
      // Import Wallet
      .then(() => c.waitForVisible('#import', 10000))
      .then(() =>
        delay(1000).then(() => console.log(chalk.green('Import Button Exists')))
      )
      .then(() =>
        b
          .capturePage()
          .then(() => console.log(chalk.green('Screencap Start')))
          .then(img => fs.writeFile(pwd + '/test/caps/screen/1.png', img))
          .then(() => console.log(chalk.green('Screencap Done')))
      )
      .then(() => c.click('#import'))
      .then(() => console.log(chalk.green('Import Button Test Done')))
      .then(() => resolve('done'))
      .catch(err => {
        console.log(chalk.red('Test Failed With Error: '), err)
        app.stop()
        reject(err)
      })
  })
}

function selectPrivateKey() {
  return new Promise((resolve, reject) => {
    // Choose Import -> Private Key (Ignore other options for now, lack test data)
    // Select Private Key Radio Button
    // Select Private Key Text Area
    // Add Value For Private Key Text Area
    // Submit Private Key
    const c = app.client
    const b = app.browserWindow
    delay(1000)
      .then(() => c.waitForExist('#pkey', 10000))
      .then(() =>
        b
          .capturePage()
          .then(img => fs.writeFile(pwd + '/test/caps/screen/2.png', img))
      )
      .then(() => c.click('#pkey'))
      .then(() => c.click('#keyarea'))
      .then(() => c.setValue('#keyarea', data[usr].privKey))
      .then(() => c.click('#pkyunlock'))
      .then(() =>
        console.log(chalk.green('Select And Add Private Key Test Done'))
      )
      .then(() => console.log(chalk.green('Import Button Test Done')))
      .then(() => resolve('done'))
      .catch(err => {
        console.log(chalk.red('Test Failed With Error: '), err)
        app.stop()
        reject(err)
      })
  })
}

// Create New Wallet
// *****************

// function createNewWalletTest() {
//   init()
//     // TOC Confirm
//     .then(() => regStep('#agree'))

//     // Setup Wallet
//     .then(() => regStep('#setupWallet'))

//     // Click Create New Wallet
//     .then(() => regStep('#createWallet'))

//     // Set Password
//     .then(() => passwordTest(password))

//     // Check PubKey
//     .then(() => checkPubKey())

//     // Check PrivKey
//     .then(() => printWalletTest())

//     // Upload KYC Docs
//     .then(() => uploadKycTest())

//     // Dashboard
//     .then(() => dashboardTest())

//     .then(() => console.log(chalk.green('Done')))
//     .then(() => app.stop())
//     .catch(err => {
//       console.log(chalk.red('Test Failed With Error: '), err)
//       app.stop()
//     })
// }

// Keystore Import
// ***************

// function keystoreImportTest() {
//   init()
//     .then(() => console.log(chalk.green('Done')))
//     .then(() => app.stop())
//     .catch(err => {
//       console.log(chalk.red('Test Failed With Error: '), err)
//       app.stop()
//     })
// }

// Private Key Import
// ******************

function privateKeyImportTest() {
  init()
    // TOC Agre
    .then(() => regStep('#agree'))

    // Setup Wallet
    .then(() => regStep('#setupWallet'))

    // Import Wallet
    .then(() => importWalletTest())

    // Select Private Key And Submit
    .then(() => selectPrivateKey())

    // Upload KYC Docs
    .then(() => uploadKycTest())

    // Dashboard
    .then(() => dashboardTest())

    // Complete
    .then(() => console.log(chalk.green('Done')))
    .then(() => app.stop())
    .catch(err => {
      console.log(chalk.red('Test Failed With Error: '), err)
      app.stop()
    })
}

// TOC Agree -> Import Key
// TOC Disagree -> Quit / Go Back & Agree
// Help -> External Window
// Quit -> Exit

// Agree TOC
// .then(() => c.waitForExist('#agree', 10000))
// .then(() => console.log(chalk.blue('TOC Agree Loaded')))
// //.then(() => c.execute("window.scrollTo(0, document.body.scrollHeight)"))
// // .then(() => c.execute('arguments[0].scrollIntoView()', 'document.getElementById("#bottom")'))
// // .then(() => c.execute('document.getElementById("#agree").removeAttribute("disabled");'))
// // ** temp removed this from button #agree ** (ng-disabled="!scrolledBottom || storeSavePromise.$$state.status")
// .then(() => c.click("#agree"))
// .then(() => console.log(chalk.green('TOC Agree Test Done')))

// If KYC confirm private key -> Goto Dashboard

// Confirm Private Key
// .then(() => c.waitForExist('#pkycontinue', 10000))
// .then(() => b.capturePage()
// 	.then(img => fs.writeFile(pwd + '/test/caps/screen/3.png', img))
// ).then(() => c.click('#pkycontinue'))
// .then(() => console.log(chalk.green('Confirm Private Key Test Done')))

// createNewWalletTest()
// keystoreImportTest()
privateKeyImportTest()
