import AsyncStorage from "@react-native-async-storage/async-storage";

import { createContext, useState } from "react";

export const AuthContext = createContext({
  userInfo: { token: "", email: "" },
  isAuthenticated: false,
  authenticate: (token, email) => {},
  logout: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();
  const [authEmail, setAuthEmail] = useState();

  function authenticate(token, email) {
    setAuthToken(token);
    setAuthEmail(email);
    AsyncStorage.setItem("token", token);
    AsyncStorage.setItem("email", email);
  }

  function logout() {
    setAuthToken(null);
    AsyncStorage.removeItem("token");
  }

  const value = {
    userInfo: { token: authToken, email: authEmail },
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
