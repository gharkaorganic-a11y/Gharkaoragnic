import BrandLogo from "../../../components/common/BrandLogo";

const LoadingScreen = ({ text = "Please wait..." }) => {
  return (
    // 1. Container: Pure solid white, highest z-index
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#F8FAF5] font-sans transition-opacity duration-300">
      {/* 2. Reconstructed Brand Logo */}
      <BrandLogo
        variant="default"
        size="md"
        className="mb-5"
      />

      {/* 3. Minimal progress text */}
      {text && (
        <h2 className="text-[#54270D]/70 font-bold tracking-[0.25em] text-[10px] uppercase animate-pulse">
          {text}
        </h2>
      )}
    </div>
  );
};

export default LoadingScreen;
