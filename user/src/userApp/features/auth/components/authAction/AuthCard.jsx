import { Link } from "react-router-dom";

export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
      <Link to="/" className="mb-6 inline-flex justify-center">
        <img
          src="https://gharkaorganic.com/logo/gharka-logo.png"
          alt="Ghar Ka Organic"
          className="h-16 w-auto max-w-[220px] object-contain"
        />
      </Link>

      {children}
    </div>
  );
}
