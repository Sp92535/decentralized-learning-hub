import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeploymentModule", (m) => {
  const CourseMarketplace = m.contract("CourseMarketplace");

  return { CourseMarketplace };
});