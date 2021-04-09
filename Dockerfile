FROM node:14.16.1

WORKDIR /usr/src/open-house-of-commons-api

COPY  ./ ./

RUN npm install

CMD ["/bin/bash"]