FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

#Install rimraf package for test coverage command
RUN npm install glob rimraf

#Install dependencies
RUN npm install

COPY . .

#Only for development
#Run coverage test
RUN npm run test:cov; exit 0

#Build
RUN npm run build

FROM node:18-alpine as production
ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY package*.json ./

#Install production dependencies
RUN npm install --only=production

#Copy files
COPY . .

COPY --from=development /usr/src/app/dist ./dist

#Start server
CMD ["node", "dist/main"]