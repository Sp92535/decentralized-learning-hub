FROM node:22.12.0-alpine

WORKDIR /app

RUN npm install -g ganache

EXPOSE 8545

CMD [ "ganache", "--wallet.mnemonic", "StarPlatinum TheWorld CrazyDiamond KillerQueen KingCrimson GoldenExperience StickyFingers StoneFree MadeInHeaven D4C WonderOfYou WeatherReport", "--host", "0.0.0.0" ]