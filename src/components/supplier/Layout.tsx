import { Outlet } from "react-router-dom";
import BrandPanel from "./BrandPanel";

const Layout = () => {
  return (
    <div className="flex min-h-screen">
      <BrandPanel />
      <main className="flex-1 bg-background py-10 md:py-16 px-4 md:px-8 lg:px-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
