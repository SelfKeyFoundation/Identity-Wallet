FROM node:latest
ENV NODE_ENV='test'
RUN apt-get update
RUN apt-get install -y wine rpm xvfb libxtst6 libxss1 libgtk2.0-0 libnss3 libasound2 libgconf-2-4
RUN mkdir /home/id-wallet
RUN chmod 755 /home/id-wallet
COPY . /home/id-wallet
WORKDIR /home/id-wallet
RUN npm i -g gulp-cli
RUN npm i -g electron-packager
RUN npm cache verify
RUN npm i
RUN npm run make
EXPOSE 4000
CMD ['npm', 'run', 'start']
