import quranLogo from "@/assets/quran-logo.png";

const DonationHeader = () => {
  return (
    <header className="flex flex-col items-center text-center px-4 pt-12 pb-8">
      {/* Logo */}
      <div className="animate-scale-in mb-6">
        <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-gold/30 shadow-lg animate-float">
          <img
            src={quranLogo}
            alt="Logo Donasi Al-Qur'an"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-3 animate-fade-in-up">
        Donasi Al-Qur&apos;an
      </h1>

      {/* Tagline */}
      <p className="text-lg md:text-xl font-serif italic text-gold mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
        &ldquo;Sebarkan Cahaya Ilmu, Hidupkan Generasi&rdquo;
      </p>

      {/* Description */}
      <p className="max-w-md text-sm md:text-base text-muted-foreground leading-relaxed animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
        Program pengadaan dan distribusi mushaf Al-Qur&apos;an untuk pesantren, masjid, 
        dan komunitas yang membutuhkan di seluruh Indonesia. Mari bersama menjadi bagian 
        dari kebaikan yang terus mengalir.
      </p>
    </header>
  );
};

export default DonationHeader;
