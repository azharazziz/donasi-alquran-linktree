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

interface BankAccount {
  bankName: string;
  bankLogo?: string;
  accountNumber: string;
  accountHolder: string;
}

const bankAccounts: BankAccount[] = [
  {
    bankName: "Bank Central Asia (BCA)",
    accountNumber: "123 456 7890",
    accountHolder: "Yayasan Donasi Al-Qur'an",
  },
  {
    bankName: "Bank Mandiri",
    accountNumber: "987 654 3210",
    accountHolder: "Yayasan Donasi Al-Qur'an",
  },
  {
    bankName: "Bank Rakyat Indonesia (BRI)",
    accountNumber: "111 222 3334",
    accountHolder: "Yayasan Donasi Al-Qur'an",
  },
  {
    bankName: "Bank Negara Indonesia (BNI)",
    accountNumber: "555 666 7778",
    accountHolder: "Yayasan Donasi Al-Qur'an",
  },
  {
    bankName: "Bank Syariah Indonesia (BSI)",
    accountNumber: "999 888 7776",
    accountHolder: "Yayasan Donasi Al-Qur'an",
  },
];

interface TransferBankModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TransferBankModal = ({ open, onOpenChange }: TransferBankModalProps) => {
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
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary">
            Donasi via Transfer Bank
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Silakan transfer ke salah satu rekening berikut
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-2">
          {bankAccounts.map((bank, index) => (
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
            Niat Donasi
          </p>
          <p className="text-sm font-serif italic text-foreground leading-relaxed">
            &ldquo;Saya niat berdonasi Al-Qur&apos;an karena Allah Ta&apos;ala,
            semoga menjadi amal jariyah yang terus mengalir pahalanya.&rdquo;
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TransferBankModal;
