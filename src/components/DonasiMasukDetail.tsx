import type { DonasiMasukRow } from "@/hooks/useGoogleSheets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, User, Banknote, Wallet } from "lucide-react";

interface DonasiMasukDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DonasiMasukRow | null;
}

const DonasiMasukDetail = ({ open, onOpenChange, data }: DonasiMasukDetailProps) => {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif text-primary">
            Detail Donasi Masuk
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Informasi lengkap donasi
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <DetailRow icon={Calendar} label="Tanggal" value={data.tanggal} />
          <DetailRow icon={User} label="Donatur" value={data.donatur} />
          <DetailRow icon={Banknote} label="Nominal" value={data.nominal} highlight />
          <DetailRow icon={Wallet} label="Saldo" value={data.saldo} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border px-4 py-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className={`text-sm font-semibold ${highlight ? "text-primary" : "text-foreground"} break-words`}>
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

export default DonasiMasukDetail;
