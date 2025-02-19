import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeploymentModule", (m) => {
  const userFactory = m.contract("UserFactory");
  const courseFactory = m.contract("CourseFactory", [userFactory]);

  return { userFactory, courseFactory };
});
