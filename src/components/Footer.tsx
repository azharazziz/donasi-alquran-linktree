import { Heart } from "lucide-react";
import BuburKijang from "@/assets/bubur-kijang.png";
import CapDuaJago from "@/assets/cap-dua-jago.png";
import FotoinProject from "@/assets/fotoin-project.png";
import KamarBacaMagelang from "@/assets/kamar-baca-magelang.png";
import SKSFoundation from "@/assets/sks-foundation.png";

// Replace these with actual initiator logo imports or URLs
const initiators = [
  { name: "kamar Baca Magelang", initials: "KBM", logo: KamarBacaMagelang },
  { name: "Fotoin Project", initials: "FP", logo: FotoinProject },
  { name: "SKS Foundation", initials: "SKS", logo: SKSFoundation },
  { name: "Mie Ayam Cap 2 Jago", initials: "MAC2J", logo: CapDuaJago },
  { name: "Bubur Kijang", initials: "BK", logo: BuburKijang },
];

const Footer = () => {
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
          {initiators.map((org) => (
            <div
              key={org.name}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-full max-w-[100px] aspect-[3/2] rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center p-2 transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-slate-800 overflow-hidden">
                {org.logo ? (
                  <img
                    src={org.logo}
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

      {/* Islamic Quote */}
      <div className="text-center mb-6 px-4">
        <p className="text-sm font-serif italic text-muted-foreground leading-relaxed">
          &ldquo;Sebaik-baik kalian adalah orang yang mempelajari Al-Qur&apos;an dan mengajarkannya.&rdquo;
        </p>
        <p className="text-xs text-gold mt-2 font-medium">
          — HR. Bukhari
        </p>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <span>Dibuat dengan</span>
          <Heart size={12} className="text-gold fill-gold" />
          <span>untuk kebaikan umat</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-1">
          © {new Date().getFullYear()} Donasi Al-Qur&apos;an. Semua hak dilindungi.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
