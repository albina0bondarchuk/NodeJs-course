FROM node
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build
EXPOSE 80
CMD [ "yarn", "start" ]