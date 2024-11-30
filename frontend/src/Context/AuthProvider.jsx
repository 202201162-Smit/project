import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie"

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => Cookies.get("token") || "");
  const [name, setName] = useState(() => Cookies.get("name") || "");
  const [userId, setUserId] = useState(() => Cookies.get("userId") || "");
  const [type, setType] = useState(() => Cookies.get("type") || "");
  const [image, setImage] = useState(() => Cookies.get("image") || "");
  const authorizationToken = `Bearer ${token}`;
  

  const storeTokenInLs = (serverToken, name, userId, type, image) => {
    if(type === "college" || type === "club"){
      image = `https://api.dicebear.com/5.x/initials/svg?seed=${name}`
    }
    setToken(serverToken);
    setName(name);
    setUserId(userId);
    setType(type);
    setImage(image);
  };

  const isLoggedIn = !!token;

  const [isCollegeRepresentative, setIsCollegeRepresentative] = useState(false);

  const Logout = () => {
    setToken("");
    setName("");
    setUserId("");
    setType("");
    setImage("");
    setIsCollegeRepresentative(false);

    Cookies.remove("token", { path: "/" });
    Cookies.remove("name", { path: "/" });
    Cookies.remove("userId", { path: "/" });
    Cookies.remove("type", { path: "/" });
    Cookies.remove("image", { path: "/" });

    
    // localStorage.removeItem("token");
    // localStorage.removeItem("userId");
    // localStorage.removeItem("name");
    // localStorage.removeItem("type");
    // localStorage.removeItem("image");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLs,
        Logout,
        authorizationToken,
        isCollegeRepresentative,
        setIsCollegeRepresentative,
        name,
        userId,
        type,
        image,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);