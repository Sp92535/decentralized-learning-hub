import "../components/globals.css"; // Make sure the path is correct
import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const handleToggleTheme = () =>{
    return setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))
  }
  return (
    <ThemeContext.Provider value={{ theme, handleToggleTheme }}>{children}</ThemeContext.Provider>
  );
};

export const DarkLight = () => {

    const {theme, handleToggleTheme} = useContext(ThemeContext);
    console.log("Current theme:", theme);

    return (
        <div
          className={`p-4 h-screen w-screen flex flex-col justify-center items-center ${
            theme === "dark" ? "bg-black text-white" : "bg-white text-black"
          }`}
        > 
          <h1>React</h1>
          <p>Henlo</p>
          <button
            onClick={handleToggleTheme}
            className=" p-4 bg-gray-400 hover:bg-gray-500 rounded-md"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      );
};
