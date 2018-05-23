FROM circleci/node:latest-browsers
ENV OSENV='docker'
RUN sudo apt-get update
RUN sudo apt-get install -y wine rpm xvfb libxtst6 libxss1 libgtk2.0-0 libnss3 libasound2 libgconf-2-4 spawn zip --fix-missing
RUN mkdir /home/id-wallet
RUN chmod 755 /home/id-wallet
COPY . /home/id-wallet
WORKDIR /home/id-wallet
RUN sudo npm i -g gulp-cli electron-packager
RUN npm i
EXPOSE 5858
CMD ['npm', 'run', 'start']
