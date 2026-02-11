import { Skeleton } from "@/components/ui/skeleton";
import { useDonaturList } from "@/hooks/useGoogleSheets";

const DonaturSection = () => {
  const { names, loading } = useDonaturList();

  return (
    <section
      className="px-4 pb-8 w-full max-w-md mx-auto animate-fade-in-up"
      style={{ animationDelay: "0.8s", opacity: 0 }}
    >
      <div className="gold-divider mb-6" />
      <div className="text-center mb-4">
        <h2 className="text-sm uppercase tracking-widest font-medium text-muted-foreground mb-1">
          Para Donatur
        </h2>
        <p className="text-[11px] text-muted-foreground/60 italic font-serif">
          Jazakumullahu khairan atas keikhlasan Anda
        </p>
      </div>

      {loading ? (
        <div className="flex flex-wrap justify-center gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-20 rounded-full" />
          ))}
        </div>
      ) : names.length === 0 ? (
        <p className="text-xs text-muted-foreground/60 text-center italic">
          Belum ada data donatur yang ditampilkan
        </p>
      ) : (
        <div className="flex flex-wrap justify-center gap-1.5">
          {names.map((name) => (
            <span
              key={name}
              className="inline-block px-3 py-1 text-[11px] rounded-full border border-border/50 bg-card/60 text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default DonaturSection;
