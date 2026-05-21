import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import RoomPage from "./pages/RoomPage";
import CustomerPage from "./pages/CustomerPage";
import Navbar from "./components/Navbar";
import DevicePage from "./pages/DevicePage";
import ContractPage from "./pages/ContractPage";
import RoomDetailPage from "./pages/RoomDetailPage";
import CustomerDetailPage from "./pages/CustomerDetailPage";
export default function App() {
  return (
    <BrowserRouter>

        {/* HEADER */}
      <Navbar />

      {/* ROUTES */}
      <Routes>
        <Route path="/" element={<RoomPage />} />
        <Route path="/customers" element={<CustomerPage />} />
        <Route path="/devices" element={<DevicePage />} />
        <Route path="/rooms/:id/contract" element={<ContractPage />} />
        <Route path="/rooms/:id/detail" element={<RoomDetailPage />} />
        <Route path="/customers/:id/detail" element={<CustomerDetailPage />} />
      </Routes>
      

    </BrowserRouter>
  );
}