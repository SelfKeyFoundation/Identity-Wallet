# KYC Chain Wallet

# Environment
set **NODE_ENV** to
* ```development``` to use **development** section of config file
* ```production``` to use **production** section of config file
* ```undefined``` will use **default** section of config file

## Prequesites
1. npm install -g gulp
2. npm install
3. cd wallet-web-app && npm install
4. cd ../wallet-desktop-app && npm install
5. gulp build:deskapp:osx64

**MacOSX**
* ```brew install wine```

**Linux**
* ```sudo apt-get install wine```

## Build
* ```gulp build:webapp```
* ```gulp build:desktop-app:osx64```
* ```gulp build:desktop-app:all``` - builds desktop app on all platform and architecture

## watch / development
* ```gulp watch:webapp```

## Demo deployment

1. Build webapp
1. In webapp directory run `docker build -t kycc/wallet:demo .`
1. `docker push kycc/wallet:demo`
1. `ssh kycc@52.187.114.66`
1. `cd command-conquer && git pull origin dev`
1. `docker-compose -f docker-compose-website.yml pull wallet-demo`
1. `docker-compose -f docker-compose-website.yml up -d --no-deps --build wallet-demo`

