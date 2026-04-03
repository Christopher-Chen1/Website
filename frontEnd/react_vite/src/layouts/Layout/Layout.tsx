// src/layouts/Layout/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import SideNavLayout from "../Sidenav/SideNavLayout";
//import "./Layout.scss";

const Layout = () => {
  return (
    <div>
      <Header children={undefined} />
      <div className="dds__template--productivity">
          <SideNavLayout />
        <main className="dds__py-5">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
