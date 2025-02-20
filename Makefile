run:
	npm run dev

deploy:
	rm -rf ./ignition/deployments
	npx hardhat compile
	npx hardhat ignition deploy ignition/modules/deploy.js --network ganache
	node update_files.js