import { useEffect } from "react";
import appIconPath from "@assets/maica-logo.png";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center animate-in fade-in duration-1000"
      style={{ backgroundColor: "#0096C7" }}
      data-testid="splash-screen"
    >
      <img
        src={appIconPath}
        alt="MaiCa"
        className="w-52 h-52 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000"
        data-testid="splash-logo"
      />
      <p
        className="text-base font-medium tracking-wide text-center px-6 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300"
        style={{ color: "#F4C542" }}
        data-testid="splash-tagline"
      >
        Smart Money Management for Nigerian Businesses
      </p>
    </div>
  );
}
