import { useState, createContext, useContext, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

import EarnCoinPage from './pages/EarnCoinPage'
import GameOfTheMonthPage from './pages/GameOfTheMonthPage'
import PrizesPage from './pages/PrizesPage'
import RequestPrintPage from './pages/RequestPrintPage'
import PremiumPrizesPage from './pages/PremiumPrizesPage'
import RequestPremiumPrizePage from './pages/RequestPremiumPrizePage'
import PrintsQueuePage from './pages/PrintsQueuePage'

import AdminAcessPage from './pages/AdminAccessPage'
import ManagePrizesPage from './pages/ManagePrizesPage'
import ManagePremiumPrizesPage from './pages/ManagePremiumPrizesPage'
import ManagePrintsRequestsPage from './pages/ManagePrintsRequestsPage'

import './NinjasPrizesCatalog.css'

interface AdminContextType {
  isAdmin: boolean;
  enableAdmin: (passwordOrLogout: string | boolean) => boolean;
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
    return storedValue === "true"; // Convert string to boolean
  });

  const enableAdmin = (passwordOrLogout: string | boolean): boolean => {
    const correctPassword = "ninja1";

    if (typeof passwordOrLogout === "boolean" && passwordOrLogout === false) {
      setAdmin(false);
      localStorage.removeItem("isAdmin");
      return false;
    }

    if (passwordOrLogout === correctPassword) {
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
function NinjasPrizesCatalog() {
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

export default NinjasPrizesCatalog
