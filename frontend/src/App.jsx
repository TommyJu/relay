import { 
  React,
  useEffect 
} from "react";
import Navbar from "./components/Navbar";
import {
  Routes,
  Route
 } from "react-router-dom";
 import HomePage from "./pages/HomePage";
 import SignUpPage from "./pages/SignUpPage";
 import LoginPage from "./pages/LoginPage";
 import SettingsPage from "./pages/SettingsPage";
 import ProfilePage from "./pages/ProfilePage";
 import { useAuthStore } from "./store/userAuthStore";

const App = () => {

  // Retrieves the global state and functions for authentication.
  const { authUser, checkAuth } = useAuthStore();

    useEffect(() => {
      checkAuth();
    }, [checkAuth]
  );

  return (
    <div>
      <Navbar/>
      
      {/* Defines client-side routes used for navigation */}
      <Routes>
          <Route path="/" element={ <HomePage/> }/>
          <Route path="/signup" element={ <SignUpPage/> }/>
          <Route path="/login" element={ <LoginPage/> }/>
          <Route path="/settings" element={ <SettingsPage/> }/>
          <Route path="/profile" element={ <ProfilePage/> }/>
          
      </Routes>
    </div>
  );
};

export default App;
