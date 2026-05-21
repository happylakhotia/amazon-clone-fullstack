import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ToastContainer from "../components/ui/Toast";
import "./MainLayout.css";

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content" id="main-content">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
      <ScrollRestoration />
    </div>
  );
};

export default MainLayout;
