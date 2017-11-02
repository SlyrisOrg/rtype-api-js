FROM node:alpine
# Create app directory
WORKDIR /usr/src/app

# Install pm2 remote control
RUN npm install pm2 -g

# Install app dependencies
COPY package.json .
# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN yarn

# Bundle app source
COPY . .

EXPOSE 443
CMD [ "yarn", "start" ]
