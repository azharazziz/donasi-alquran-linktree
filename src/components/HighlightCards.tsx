import { BookOpen, Gift, Package, Heart, Star, LucideIcon, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useHighlightItems, type HighlightItem } from "@/hooks/useHighlightItems";

// ---------------------------------------------------------------------------
// Icon mapping — maps [icon:xxx] values to Lucide icons
// ---------------------------------------------------------------------------

const ICON_MAP: Record<string, LucideIcon> = {
  alquran: BookOpen,
  book: BookOpen,
  gift: Gift,
  package: Package,
  heart: Heart,
  star: Star,
  sparkles: Sparkles,
};

function getIcon(item: HighlightItem): LucideIcon {
  if (item.icon && ICON_MAP[item.icon.toLowerCase()]) {
    return ICON_MAP[item.icon.toLowerCase()];
  }
  const lower = item.name.toLowerCase();
  if (lower.includes("quran") || lower.includes("iqro") || lower.includes("buku")) return BookOpen;
  if (lower.includes("hadiah") || lower.includes("gift")) return Gift;
  return Package;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const HighlightCards = () => {
  const { items, loading } = useHighlightItems();

  if (loading) {
    return (
      <section className="px-4 pb-5 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="px-4 pb-5 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
      <div className="max-w-md mx-auto">
        {/* Section label */}
        <div className="flex items-center justify-center gap-1.5 mb-3 opacity-70">
          <Sparkles size={12} className="text-accent" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground">
            Item Tersalurkan
          </span>
        </div>

        <div
          className={`grid gap-3 ${
            items.length === 1
              ? "grid-cols-1 max-w-[200px] mx-auto"
              : items.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
          }`}
        >
          {items.map((item, idx) => (
            <HighlightCard key={item.name} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Individual card
// ---------------------------------------------------------------------------

function HighlightCard({ item, index }: { item: HighlightItem; index: number }) {
  const Icon = getIcon(item);
  const accent = item.color || undefined;

  return (
    <div
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/60 backdrop-blur-sm shadow-sm hover:shadow-lg transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${0.55 + index * 0.08}s`, opacity: 0 }}
    >
      {/* Accent glow at top */}
      <div
        className="absolute top-0 inset-x-0 h-16 opacity-[0.07] bg-gradient-to-b from-primary to-transparent"
        style={accent ? { background: `linear-gradient(to bottom, ${accent}, transparent)` } : undefined}
      />

      {/* Content */}
      <div className="relative px-4 py-5 text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mb-3">
          <div
            className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={accent ? { backgroundColor: `${accent}15` } : undefined}
          >
            <Icon
              size={20}
              className={accent ? "" : "text-primary"}
              style={accent ? { color: accent } : undefined}
            />
          </div>
        </div>

        {/* Number */}
        <p
          className="text-3xl font-serif font-bold tracking-tight text-primary leading-none"
          style={accent ? { color: accent } : undefined}
        >
          {item.total.toLocaleString("id-ID")}
        </p>

        {/* Label */}
        <p className="text-[10px] mt-2 font-semibold text-muted-foreground uppercase tracking-[0.12em] leading-tight">
          {item.name}
        </p>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 inset-x-4 h-[2px] rounded-full bg-primary/20 group-hover:bg-primary/40 transition-colors duration-300"
        style={accent ? { backgroundColor: `${accent}30` } : undefined}
      />
    </div>
  );
}

export default HighlightCards;
