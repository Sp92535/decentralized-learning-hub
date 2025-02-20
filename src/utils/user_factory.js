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
        return userData;
    } catch (error) {
        console.error("Login failed:", error);
        return null;
    }
};