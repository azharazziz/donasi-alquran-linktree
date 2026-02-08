import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DonationAmountProps {
  amount: string;
  loading?: boolean;
}

const DonationAmount = ({ amount, loading }: DonationAmountProps) => {
  return (
    <section className="px-4 pb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
      <div className="donation-amount max-w-md mx-auto p-6 text-center shadow-lg">
        <div className="flex items-center justify-center gap-2 mb-2 opacity-80">
          <BookOpen size={16} />
          <span className="text-xs uppercase tracking-widest font-medium">
            Alhamdulillah
          </span>
        </div>
        <p className="text-sm opacity-80 mb-1">
          Donasi terkumpul sebesar
        </p>
        {loading ? (
          <Skeleton className="h-10 w-48 mx-auto rounded-lg" />
        ) : (
          <p className="text-3xl md:text-4xl font-serif font-bold tracking-tight">
            {amount}
          </p>
        )}
        <p className="text-xs mt-3 opacity-60">
          Jazākumullāhu khairan atas setiap kebaikan
        </p>
      </div>
    </section>
  );
};

export default DonationAmount;
