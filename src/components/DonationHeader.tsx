import quranLogo from "@/assets/quran-logo.png";
import logo from "@/assets/logo.png";

const DonationHeader = () => {
  return (
    <header className="flex flex-col items-center text-center px-4 pt-12 pb-8">
      {/* Logo - flexible container preserving original aspect ratio */}
      <div className="animate-scale-in mb-6">
        <div className="w-full">
          <img
            src={logo}
            alt="Logo Donasi Al-Qur'an"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3 animate-fade-in-up">
        Donasi Al-Qur&apos;an 2026
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl font-serif italic text-gold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        &ldquo;Jadikan ramadhanmu penuh cahaya iman yang menghidupkan harapan dan menumbuhkan keberkahan&rdquo;
      </p>

      {/* Description */}
      <p className="max-w-md text-sm md:text-base text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        Mari bersama-sama kita wujudkan impian untuk menyebarkan cahaya Al-Qur&apos;an. Dengan donasi Anda, kita dapat memberikan Al-Qur&apos;an kepada mereka yang membutuhkan, memperkuat iman, dan menumbuhkan keberkahan di bulan suci Ramadhan ini.
      </p>
    </header>
  );
};

export default DonationHeader;
