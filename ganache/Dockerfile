FROM node:18-bullseye

WORKDIR /app

RUN npm install -g ganache

EXPOSE 8545

CMD [ "ganache", "--wallet.mnemonic", "StarPlatinum TheWorld CrazyDiamond KillerQueen KingCrimson GoldenExperience StickyFingers StoneFree MadeInHeaven D4C WonderOfYou WeatherReport", "--host", "0.0.0.0" ]