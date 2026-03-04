import { BookOpen, Gift, Package, Heart, Star, LucideIcon, Sparkles } from "lucide-react";
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

  // Filter items with total > 0 and hide if none
  const displayItems = items.filter(item => item.total > 0);
  if (displayItems.length === 0) return null;

  return (
    <section className="px-4 pb-5 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
      <div className="max-w-md mx-auto">
        {/* Section label */}
        <div className="flex items-center justify-center gap-1.5 mb-3 opacity-70">
          <Sparkles size={12} className="text-gold" />
          <span className="text-[10px] uppercase tracking-[0.15em] font-medium text-muted-foreground">
            Item Tersalurkan
          </span>
        </div>

        <div
          className={`grid gap-2.5 ${
            displayItems.length === 1
              ? "grid-cols-1 max-w-[180px] mx-auto"
              : displayItems.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
          }`}
        >
          {displayItems.map((item, idx) => (
            <HighlightCard key={item.name} item={item} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ---------------------------------------------------------------------------
// Individual card — clean, minimal, inline with Islamic aesthetic
// ---------------------------------------------------------------------------

function HighlightCard({ item, index }: { item: HighlightItem; index: number }) {
  const Icon = getIcon(item);
  const accent = item.color || undefined;

  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${0.55 + index * 0.08}s`, opacity: 0 }}
    >
      {/* Content */}
      <div className="relative px-3 py-4 text-center">
        {/* Icon — small and subtle */}
        <div className="flex items-center justify-center mb-2">
          <Icon
            size={16}
            className={accent ? "opacity-70" : "text-primary/60"}
            style={accent ? { color: accent } : undefined}
          />
        </div>

        {/* Number — prominent */}
        <p
          className="text-2xl font-serif font-bold tracking-tight text-primary leading-none"
          style={accent ? { color: accent } : undefined}
        >
          {item.total.toLocaleString("id-ID")}
        </p>

        {/* Label */}
        <p className="text-[9px] mt-1.5 font-semibold text-muted-foreground uppercase tracking-[0.1em] leading-tight">
          {item.name}
        </p>
      </div>

      {/* Subtle bottom accent */}
      <div
        className="absolute bottom-0 inset-x-0 h-[1.5px] bg-primary/15"
        style={accent ? { backgroundColor: `${accent}25` } : undefined}
      />
    </div>
  );
}

export default HighlightCards;
