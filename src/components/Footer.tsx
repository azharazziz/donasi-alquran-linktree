import { Heart } from "lucide-react";
import { useYearContext } from "@/contexts/YearContext";

const Footer = () => {
  const { config } = useYearContext();
  return (
    <footer className="px-4 pb-10 pt-4 w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.9s", opacity: 0 }}>
      {/* Divider */}
      <div className="gold-divider mb-8" />

      {/* Initiators */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 font-medium">
          Diinisiasi oleh
        </p>
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {config.initiators.map((org) => (
            <div
              key={org.name}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-full max-w-[100px] aspect-[3/2] rounded-xl bg-primary border border-primary/20 flex items-center justify-center p-2 transition-colors duration-300 group-hover:border-primary/40 group-hover:brightness-110 overflow-hidden">
                {config.initiatorLogos[org.name] ? (
                  <img
                    src={config.initiatorLogos[org.name]}
                    alt={org.name}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors duration-300">
                    {org.initials}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-muted-foreground leading-tight text-center">
                {org.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Helpers */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-medium">
          Dibantu oleh
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {config.helpers.map((helper, index) => (
            <span
              key={index}
              className="
                inline-block 
                px-3 py-1.5 
                rounded-full 
                bg-primary 
                text-primary-foreground 
                border border-primary
                text-xs 
                font-medium 
                shadow-sm
                transition-all duration-300 
                hover:-translate-y-0.5 
                hover:shadow-md
                hover:bg-primary/90
              "
            >
              {helper}
            </span>
          ))}
        </div>
      </div>

      <div className="gold-divider mb-8" />

      {/* Islamic Quote */}
      <div className="text-center mb-6 px-4">
        <p className="text-sm font-serif italic text-muted-foreground leading-relaxed">
          &ldquo;Sebaik-baik kalian adalah orang yang mempelajari Al-Qur&apos;an dan mengajarkannya.&rdquo;
        </p>
        <p className="text-xs text-gold mt-2 font-medium">
          — HR. Bukhari
        </p>
      </div>

      <div className="gold-divider mb-8" />

      {/* Copyright */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>Dibuat dengan</span>
          <Heart size={12} className="text-gold fill-gold" />
          <span> oleh <a href="https://azharazziz.github.io" target="_blank" rel="noopener noreferrer" className="text-gold font-semibold hover:underline">Azhar Azziz</a> untuk kebaikan umat</span>
        </div>
        <div className="gold-divider my-4 max-w-[120px] mx-auto" />
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          © 2021 - {new Date().getFullYear()}. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
