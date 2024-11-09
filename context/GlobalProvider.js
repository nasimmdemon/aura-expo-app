import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        const session = await AsyncStorage.getItem("session");
        if (session) {
          const currentUser = await getCurrentUser();
          if (currentUser) {
            setIsLogged(true);
            setUser(currentUser);
          } else {
            setIsLogged(false);
          }
        } else {
          setIsLogged(false);
        }
      } catch (error) {
        console.log(error);
        setIsLogged(false);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
