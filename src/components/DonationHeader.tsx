import quranLogo from "@/assets/quran-logo.png";
import { useYearContext } from "@/contexts/YearContext";

const DonationHeader = () => {
  const { config } = useYearContext();

  return (
    <header className="flex flex-col items-center text-center px-4 pt-12 pb-8">
      {/* Logo - flexible container preserving original aspect ratio */}
      <div className="animate-scale-in mb-6">
        <div className="w-full">
          <img
            src={config.logo}
            alt="Logo Donasi Al-Qur'an"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3 animate-fade-in-up">
        {config.headerText.title}
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl font-serif italic text-gold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        &ldquo;{config.headerText.tagline}&rdquo;
      </p>

      {/* Description */}
      <p className="max-w-md text-sm md:text-base text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        {config.headerText.description}
      </p>
    </header>
  );
};

export default DonationHeader;
