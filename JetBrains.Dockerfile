# Created by WebStorm
FROM node
WORKDIR /tmp/project_modules
COPY package.json /tmp/project_modules/package.json
ENV NODE_VERSION 14.14.22
RUN npm cache clean --force
RUN npm install -g .
COPY start.sh /tmp/project_modules/start.sh
CMD ["npm", "start"]
