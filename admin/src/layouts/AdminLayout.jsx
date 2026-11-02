import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/bars/AdminNavbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#F1F3F6]">
      <AdminNavbar />
      <main className="min-h-screen bg-[#F1F3F6] pt-14 lg:pt-24">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
