import { BookOpen, Gift, Package, Heart, Star, LucideIcon } from "lucide-react";
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
};

function getIcon(item: HighlightItem): LucideIcon {
  if (item.icon && ICON_MAP[item.icon.toLowerCase()]) {
    return ICON_MAP[item.icon.toLowerCase()];
  }
  // Default based on name keywords
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
      <section className="px-4 pb-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="px-4 pb-4 animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
      <div className="max-w-md mx-auto">
        <div
          className={`grid gap-3 ${
            items.length === 1
              ? "grid-cols-1"
              : items.length === 3
              ? "grid-cols-3"
              : "grid-cols-2"
          }`}
        >
          {items.map((item) => {
            const Icon = getIcon(item);
            const accentColor = item.color || undefined;

            return (
              <div
                key={item.name}
                className="relative overflow-hidden rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm px-4 py-4 text-center transition-shadow hover:shadow-md"
              >
                {/* Subtle accent bar at top */}
                <div
                  className="absolute top-0 inset-x-0 h-1 rounded-t-xl bg-primary/60"
                  style={accentColor ? { backgroundColor: accentColor } : undefined}
                />

                <div className="flex items-center justify-center mb-2">
                  <div
                    className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"
                    style={
                      accentColor
                        ? { backgroundColor: `${accentColor}18`, color: accentColor }
                        : undefined
                    }
                  >
                    <Icon
                      size={18}
                      className={accentColor ? "" : "text-primary"}
                      style={accentColor ? { color: accentColor } : undefined}
                    />
                  </div>
                </div>

                <p
                  className="text-2xl font-serif font-bold tracking-tight text-primary"
                  style={accentColor ? { color: accentColor } : undefined}
                >
                  {item.total.toLocaleString("id-ID")}
                </p>

                <p className="text-[11px] mt-1 font-medium text-muted-foreground uppercase tracking-wider leading-tight">
                  {item.name}
                </p>
              </div>
            );
          })}
        </div>

        <p className="text-[10px] mt-2 text-center text-muted-foreground/50">
          Total item yang telah disalurkan
        </p>
      </div>
    </section>
  );
};

export default HighlightCards;
