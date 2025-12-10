import { 
  React,
  useEffect 
} from "react";
import {
  Routes,
  Route
 } from "react-router-dom";
 import { Loader } from "lucide-react";
 import Navbar from "./components/Navbar";
 import HomePage from "./pages/HomePage";
 import SignUpPage from "./pages/SignUpPage";
 import LoginPage from "./pages/LoginPage";
 import SettingsPage from "./pages/SettingsPage";
 import ProfilePage from "./pages/ProfilePage";
 import { useAuthStore } from "./store/userAuthStore";

const App = () => {

  // Retrieves the global state and functions for authentication.
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

    // Calls the function for checking user authentication on component initialization.
    useEffect(() => {
      checkAuth();
    }, [checkAuth]
  );

  // Displays a loading spinner if the app is currently verifying the user's authentication.
  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      
      {/* Defines client-side routes used for navigation */}
      <Routes>
          <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login" /> }/>
          <Route path="/signup" element={ authUser ? <Navigate to="/" /> : <SignUpPage/> }/>
          <Route path="/login" element={ authUser ? <Navigate to="/" /> : <LoginPage/> }/>
          <Route path="/settings" element={ authUser ? <SettingsPage/> : <Navigate to="/login" /> }/>
          <Route path="/profile" element={authUser ? <ProfilePage/> : <Navigate to="/login" /> }/>
          
      </Routes>
    </div>
  );
};

export default App;
