import BrandLogo from "../../../../../components/common/BrandLogo";

export default function AuthCard({ children }) {
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-6 flex justify-center">
        <BrandLogo variant="default" size="lg" to="/" />
      </div>

      {children}
    </div>
  );
}
