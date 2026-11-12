import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/bars/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#f1f2f4] text-[#303030]">
      <AdminNavbar />
      <main className="min-h-screen bg-[#f1f2f4] pt-14 lg:pl-60">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
