import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import EarnCoinPage from './pages/EarnCoinPage'
import GameOfTheMonthPage from './pages/GameOfTheMonthPage'
import PrizesPage from './pages/PrizesPage'
import RequestPrintPage from './pages/RequestPrintPage'
// import PremiumPrizesPage from './pages/PremiumPrizesPage'
import RequestPremiumPrizePage from './pages/RequestPremiumPrizePage'
import PrintsQueuePage from './pages/PrintsQueuePage'

import AdminAcessPage from './pages/AdminAccessPage'
import ManagePrizesPage from './pages/ManagePrizesPage'
import ManagePremiumPrizesPage from './pages/ManagePremiumPrizesPage'
import ManagePrintsRequestsPage from './pages/ManagePrintsRequestsPage'

import './App.css'


export const IP = "localhost";

interface AdminContextType {
  isAdmin: boolean;
  enableAdmin: (passwordOrLogout: string | boolean) => Promise<boolean>;
}
const AdminContext = createContext<AdminContextType | undefined>(undefined);
export const adminModeSetter = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useContext(AdminContext) failed!!");
  }
  return context;
};
const AdminProvider = ({ children }: any) => {
  const [isAdmin, setAdmin] = useState(() => {
    // Retrieve the value from localStorage during initialization
    const storedValue = localStorage.getItem("isAdmin");
    return storedValue === "true";
  });

  const enableAdmin = async (passwordOrLogout: string | boolean): Promise<boolean> => {
    if (typeof passwordOrLogout === "boolean" && passwordOrLogout === false) {
      setAdmin(false);
      localStorage.removeItem("isAdmin");
      return false;
    }
  
    if (typeof passwordOrLogout === "string") {
      try {
        const response = await fetch(`http://${IP}:5000/api/verify-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: passwordOrLogout }),
        });
  
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setAdmin(true);
            localStorage.setItem("isAdmin", "true");
  
            // Automatically reset isAdmin after 10 minutes
            setTimeout(() => {
              setAdmin(false);
              localStorage.removeItem("isAdmin");
              console.log("Admin access expired");
            }, 600000);
  
            console.log("Admin access enabled");
            return true;
          } else {
            console.error("Incorrect password");
            return false;
          }
        } else {
          console.error("Error verifying password:", response.statusText);
          return false;
        }
      } catch (error) {
        console.error("Failed to verify password:", error);
        return false;
      }
    }
  
    return false;
  };
  

  useEffect(() => {
    // Sync state with localStorage when isAdmin changes
    localStorage.setItem("isAdmin", isAdmin.toString());
  }, [isAdmin]);

  return (
    <AdminContext.Provider value={{ isAdmin, enableAdmin }}>
      {children}
    </AdminContext.Provider>
  );
};
function App() {
  return (
    <>
      <Router>
        <AdminProvider>
          <Header />
          <>
            <Routes>
              <Route path="/" element={<EarnCoinPage />} />
              <Route path="/game-of-the-month" element={<GameOfTheMonthPage />} />
              <Route path="/prizes" element={<PrizesPage />} />
              <Route path="custom-print" element={<RequestPrintPage />} />
              {/* <Route path="premium-prizes" element={<PremiumPrizesPage />} /> */}
              <Route path="request-premium-prize" element={<RequestPremiumPrizePage />} />
              <Route path="/prints-queue" element={<PrintsQueuePage />} />

              <Route path="/admin-access" element={<AdminAcessPage />} />
              <Route path="prizes-manager" element={<ManagePrizesPage />} />
              <Route path="/premium-prizes-manager" element={<ManagePremiumPrizesPage />} />
              <Route path="/prints-requests-manager" element={<ManagePrintsRequestsPage />}/>
            </Routes>
          </>
          <Footer />
        </AdminProvider>
      </Router>
    </>
  )
}

export default App
