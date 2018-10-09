# Selfkey Identity Wallet

[![Build Status](https://travis-ci.org/SelfKeyFoundation/Identity-Wallet.svg?branch=dev)](https://travis-ci.org/SelfKeyFoundation/Identity-Wallet) [![CircleCI](https://circleci.com/gh/SelfKeyFoundation/Identity-Wallet.svg?style=svg)](https://circleci.com/gh/SelfKeyFoundation/Identity-Wallet) [![Build status](https://ci.appveyor.com/api/projects/status/7g0lesr2456giitd?svg=true)](https://ci.appveyor.com/project/rodrigopavezi/identity-wallet)
 [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![David Dependancy Status](https://david-dm.org/SelfKeyFoundation/Identity-Wallet.svg)](https://david-dm.org/SelfKeyFoundation/Identity-Wallet) [![David Dependancy Status DEV](https://david-dm.org/SelfKeyFoundation/Identity-Wallet/dev-status.svg)](https://david-dm.org/SelfKeyFoundation/Identity-Wallet?type=dev)

## Coverage

### master

[![Coverage Status](https://coveralls.io/repos/github/SelfKeyFoundation/Identity-Wallet/badge.svg?branch=master)](https://coveralls.io/github/SelfKeyFoundation/Identity-Wallet?branch=master)

### dev

[![Coverage Status](https://coveralls.io/repos/github/SelfKeyFoundation/Identity-Wallet/badge.svg?branch=dev)](https://coveralls.io/github/SelfKeyFoundation/Identity-Wallet?branch=dev)

## Overview

The Official SelfKey Identity Wallet for Desktop

## Features

* Storage of identity docs in the Identity Wallet locally on the user’s computer
* Marketplace where the user can view a list of available Exchanges
* Exchange Details Page where the user can view Exchange information and stake KEY tokens
* System to fetch a user’s staking status (stake/no-stake) for an Exchange from the blockchain
* Token staking and reclamation flow
* Submission / upload of KYC package for processing to KYC-Chain
* Transfer of ETH, KEY and Custom ERC20 Tokens
* Viewing of token balances and transaction logs for ETH, KEY and ERC20 Tokens

## Prerequisites

* [NodeJS](https://nodejs.org) version 9 or better.
* Wine and RPM packages for OSX/Linux

### Install Dependencies

    yarn
    yarn install-app-deps

### Build on OSX/macOS/Linux

    yarn dist

## Development

### Scripts
```json
  "scripts": {
    "dev": "gulp && electron-webpack dev",
    "install-app-deps": "electron-builder install-app-deps buildDependenciesFromSource",
    "install-all": "yarn && yarn install-app-deps",
    "compile": "gulp && electron-webpack",
    "dist": "yarn compile && electron-builder",
    "dist:dir": "yarn dist --dir -c.compression=store -c.mac.identity=null",
    "test": "yarn test:unit && yarn test:e2e",
    "test:unit": "jest -i --forceExit",
    "test:unit:coverage": "yarn test:unit --coverage",
    "test:e2e": "node test/test.js e2e",
    "publish-build": "yarn compile && electron-builder -p always",
    "precommit": "npm run check-deps-precommit && pretty-quick --staged && lint-staged",
    "commitmsg": "commitlint -E GIT_PARAMS",
    "check-deps-precommit": "npm-check -i eslint -i redux -s || true",
    "check-deps": "npm-check -i common",
    "coveralls": "cat dist/coverage/lcov.info | coveralls"
  }
 ```

### Run the App on OSX/macOS/Linux/Windows

    yarn dev

### Tests

    yarn test

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).

## License

The MIT License (MIT)

Copyright (c) 2018 SelfKey Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
