FROM node

# Create app directory
WORKDIR /usr/src/app

# Install pm2 remote control
RUN yarn global add pm2

# Bundle app source
COPY . .

# Install app dependencies
RUN yarn

# Transpile sources
RUN yarn build

EXPOSE 8585
CMD [ "pm2-docker", "ecosystem.config.json" ]
