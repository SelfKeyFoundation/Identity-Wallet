FROM node:latest
ENV NODE_ENV='test'
RUN apt-get update
RUN apt-get install -y curl git ruby ruby-dev build-essential
RUN apt-get install -y wine rpm
RUN mkdir /home/id-wallet
RUN chmod 755 /home/id-wallet
COPY . /home/id-wallet
RUN apt-get install -y rubygems
RUN apt-get clean
WORKDIR /home/id-wallet
RUN npm i -g gulp-cli
RUN npm i electron-packager -g
RUN gem install sass
RUN gem install compass
RUN npm cache verify
RUN npm i
RUN npm run make
EXPOSE 4000
CMD ['npm', 'run', 'start']
