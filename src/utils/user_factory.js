import { getContracts } from "./contracts";

export const registerUser = async (username) => {
  try {
    const { userFactory, signer } = await getContracts();
    if (!userFactory || !signer) return;

    const tx = await userFactory.register(username); // ✅ Signer already attached
    await tx.wait();

    console.log("User registered successfully!");
    return true;
  } catch (error) {
    console.error("Registration failed:", error);
    return false;
  }
};

export const loginUser = async () => {
  try {
    const { userFactory } = await getContracts();
    if (!userFactory) return;

    const userData = await userFactory.login();

    console.log(userData);

    console.log("Login successful!", userData);
    return {
      address: userData[1],
      name: userData[2]
    };

  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const getOwnedCourses = async () => {
  try {
    const { userFactory } = await getContracts();
    const courses = await userFactory.getOwnedCourses();
    return courses;
  } catch (error) {
    console.error("Failed to fetch owned courses:", error);
    return [];
  }
};

export const getBoughtCourses = async () => {
    try {
        const { userFactory } = await getContracts();
        const courses = await userFactory.getBoughtCourses();
        return courses;
    } catch (error) {
        console.error("Fetching Bought Courses Failed:", error);
        return [];
    }
};
