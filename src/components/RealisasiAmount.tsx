import { HandHeart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface RealisasiAmountProps {
  amount: string;
  loading?: boolean;
}

const RealisasiAmount = ({ amount, loading }: RealisasiAmountProps) => {
  const isEmpty = !loading && (!amount || amount === "Rp0");

  return (
    <section className="px-4 pb-6 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
      <div className="max-w-md mx-auto px-5 py-4 rounded-xl border border-border/60 bg-card/80 backdrop-blur-sm shadow-sm text-center">
        <div className="flex items-center justify-center gap-1.5 mb-1 opacity-70">
          <HandHeart size={14} className="text-accent" />
          <span className="text-[11px] uppercase tracking-widest font-medium text-muted-foreground">
            Donasi yang Telah Disalurkan
          </span>
        </div>
        {loading ? (
          <Skeleton className="h-7 w-36 mx-auto rounded-md" />
        ) : isEmpty ? (
          <p className="text-sm text-muted-foreground/70 italic">Data belum tersedia</p>
        ) : (
          <p className="text-xl font-serif font-semibold text-primary tracking-tight">
            {amount}
          </p>
        )}
        <p className="text-[10px] mt-1.5 text-muted-foreground/50">
          Berdasarkan data realisasi
        </p>
      </div>
    </section>
  );
};

export default RealisasiAmount;
