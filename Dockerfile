FROM node:19.9.0

WORKDIR /user/src/face-rec-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]