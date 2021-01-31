FROM node:14.15.4

WORKDIR /usr/src/face-recognition-api

#source -> destination
COPY ./ ./ 

RUN npm install

CMD [ "/bin/bash" ]