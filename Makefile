run:
	docker compose up -d
	npm run dev

build:
	docker compose up --build -d
	npm i 

deploy:
	rm -rf ./ignition/deployments
	npx hardhat compile
	npx hardhat ignition deploy ignition/modules/deploy.js --network ganache
	node update_files.js