FROM node

# Create app directory
WORKDIR /usr/src/app

# Install pm2 remote control
RUN yarn global add pm2

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN yarn

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 8585
CMD [ "pm2-docker", "ecosystem.config.json" ]
