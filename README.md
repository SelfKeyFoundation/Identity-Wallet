# Selfkey Identity Wallet

[![Build Status](https://travis-ci.org/altninja/Identity-Wallet.svg?branch=standards)](https://travis-ci.org/altninja/Identity-Wallet)

[![CircleCI](https://circleci.com/gh/altninja/Identity-Wallet.svg?style=svg)](https://circleci.com/gh/altninja/Identity-Wallet)

[![Build status](https://ci.appveyor.com/api/projects/status/1oal9hxddsx3a25f?svg=true)](https://ci.appveyor.com/project/altninja/identity-wallet)

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

The Official SelfKey Identity Wallet for Desktop.

## Features

* Storage of identity docs in the Identity Wallet locally on the user’s computer
* ICO Marketplace where the user can view a list of available ICOs
* ICO Details Page where the user can view ICO information and stake tokens
* System to fetch a user’s staking status (stake/no-stake) for an ICO from the blockchain
* Token staking flow
* Token reclamation flow
* Submission/upload of KYC package for processing to KYC-Chain
* Monitoring of KYC verification status, notifications or activity/message feed for accepted, rejected, more info required.
* Transfer of KEY
* Viewing of token balances (KEY, ETH, related ICOs)
* Viewing of transaction logs for KEY, ETH, related ICOs)

## Prerequisites

* [NodeJS](https://nodejs.org) version 9.5 or better.
* Wine and RPM packages for OSX/Linux

### Install Dependencies

    npm install

### Build on OSX/macOS/Linux

    npm run make

### Build on Windows

    npm run makewin

## Development

### Run the App on OSX/macOS/Linux

    npm run start

### Run the App on Windows

    npm run startwin

## Tests

### Linting

    npm run lint

### Tests

    npm run test

## Contributing

Please see the [contributing notes](CONTRIBUTING.md).

## License

The MIT License (MIT)

Copyright (c) 2018 SelfKey Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
