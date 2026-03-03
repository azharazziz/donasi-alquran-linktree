import { Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useYearContext } from "@/contexts/YearContext";

interface TransferBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransferBankModal = ({ open, onOpenChange }: TransferBankModalProps) => {
  const { config } = useYearContext();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCopy = async (accountNumber: string, index: number) => {
    const cleanNumber = accountNumber.replace(/\s/g, "");
    await navigator.clipboard.writeText(cleanNumber);
    setCopiedIndex(index);
    toast({
      title: "Nomor rekening disalin",
      description: `${cleanNumber} berhasil disalin ke clipboard.`,
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            Donasi via Transfer Bank
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Silakan transfer ke salah satu rekening berikut
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="flex flex-col gap-3">
          {config.bankAccounts.map((bank, index) => (
            <div
              key={index}
              className="rounded-xl border border-border bg-card p-4 flex flex-col gap-2"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-muted-foreground leading-tight text-center">
                    {bank.bankName.match(/\(([^)]+)\)/)?.[1] || bank.bankName.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {bank.bankName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    a.n. {bank.accountHolder}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 mt-1 bg-muted/50 rounded-lg px-3 py-2">
                <span className="text-lg font-mono font-bold text-foreground tracking-wider">
                  {bank.accountNumber}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 h-8 px-3 text-xs gap-1.5"
                  onClick={() => handleCopy(bank.accountNumber, index)}
                >
                  {copiedIndex === index ? (
                    <>
                      <Check size={14} className="text-primary" />
                      <span className="text-primary">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Salin</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Niat Donasi */}
        <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
            {config.niatDonasi.label}
          </p>
          <p className="text-sm font-serif italic text-foreground leading-relaxed">
            &ldquo;{config.niatDonasi.text}&rdquo;
          </p>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferBankModal;
