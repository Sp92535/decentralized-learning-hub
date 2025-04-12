import fs from "fs"
import path from "path";

// Updating .env
const addressPath = "ignition/deployments/chain-1337/deployed_addresses.json"
const deploymentData = JSON.parse(fs.readFileSync(addressPath, "utf8"));

const courseMarketplaceAddress = deploymentData["DeploymentModule#CourseMarketplace"];

const envData = fs.readFileSync(".env", "utf8");
const updatedEnvData = envData
.replace(/NEXT_PUBLIC_COURSE_MARKETPLACE_ADDRESS=.*/g, `NEXT_PUBLIC_COURSE_MARKETPLACE_ADDRESS="${courseMarketplaceAddress}"`);

fs.writeFileSync(".env", updatedEnvData, "utf8");
console.log(".env updated successfully ✅");


// Upadating ABI
const CM = "artifacts/contracts/CourseMarketplace.sol/CourseMarketplace.json";



const destinationDir = "src/utils/abi/";
fs.mkdirSync(destinationDir, { recursive: true });

const destination_CM = path.join(destinationDir, "CourseMarketplace.json");


// Copy the file
fs.copyFileSync(CM, destination_CM);


console.log("ABI's copied successfully ✅");
