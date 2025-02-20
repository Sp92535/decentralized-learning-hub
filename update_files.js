import fs from "fs"
import path from "path";

// Updating .env
const addressPath = "ignition/deployments/chain-1337/deployed_addresses.json"
const deploymentData = JSON.parse(fs.readFileSync(addressPath, "utf8"));

const userFactoryAddress = deploymentData["DeploymentModule#UserFactory"];
const courseFactoryAddress = deploymentData["DeploymentModule#CourseFactory"];

const envData = fs.readFileSync(".env", "utf8");
const updatedEnvData = envData
.replace(/NEXT_PUBLIC_USER_FACTORY_ADDRESS=.*/g, `NEXT_PUBLIC_USER_FACTORY_ADDRESS="${userFactoryAddress}"`)
.replace(/NEXT_PUBLIC_COURSE_FACTORY_ADDRESS=.*/g, `NEXT_PUBLIC_COURSE_FACTORY_ADDRESS="${courseFactoryAddress}"`);

fs.writeFileSync(".env", updatedEnvData, "utf8");
console.log(".env updated successfully ✅");


// Upadating ABI
const UF = "artifacts/contracts/UserFactory.sol/UserFactory.json";
const CF = "artifacts/contracts/CourseFactory.sol/CourseFactory.json";
const Co = "artifacts/contracts/Course.sol/Course.json";
const IUF = "artifacts/contracts/CourseFactory.sol/IUserFactory.json";


const destinationDir = "src/utils/abi/";
fs.mkdirSync(destinationDir, { recursive: true });

const destination_UF = path.join(destinationDir, "UserFactory.json");
const destination_CF = path.join(destinationDir, "CourseFactory.json");
const destination_Co = path.join(destinationDir, "Course.json");
const destination_IUF = path.join(destinationDir, "IUserFactory.json");



// Copy the file
fs.copyFileSync(UF, destination_UF);
fs.copyFileSync(CF, destination_CF);
fs.copyFileSync(IUF, destination_IUF);
fs.copyFileSync(Co, destination_Co);

console.log("ABI's copied successfully ✅");
