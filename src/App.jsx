import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RoomPage from "./pages/RoomPage";
import CustomerPage from "./pages/CustomerPage";
import DevicePage from "./pages/DevicePage";
import RoomDetailPage from "./pages/RoomDetailPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
import ContractPage from "./pages/ContractPage";
import Navbar from "./components/Navbar";

function PrivateRoute({ children }) {
  const user = localStorage.getItem("user");

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <MainLayout>
              <RoomPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/customers"
        element={
          <PrivateRoute>
            <MainLayout>
              <CustomerPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/customers/:id/detail"
        element={
          <PrivateRoute>
            <MainLayout>
              <CustomerDetailPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/devices"
        element={
          <PrivateRoute>
            <MainLayout>
              <DevicePage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/rooms/:id/detail"
        element={
          <PrivateRoute>
            <MainLayout>
              <RoomDetailPage />
            </MainLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/rooms/:id/contracts"
        element={
          <PrivateRoute>
            <MainLayout>
              <ContractPage />
            </MainLayout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}