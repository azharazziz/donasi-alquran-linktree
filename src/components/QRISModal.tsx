import { Download, QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import qrCode from "@/assets/qris-code.png";

interface QRISModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRISModal = ({ open, onOpenChange }: QRISModalProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(qrCode);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qris-code.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download QRIS code:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary">
            Donasi via QRIS
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Silakan pindai QRIS berikut menggunakan aplikasi pembayaran Anda
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-2">
          {/* QRIS placeholder - replace src with actual QRIS image */}
          <div className="w-64 h-64 rounded-2xl border-2 border-border bg-card flex items-center justify-center overflow-hidden">
            <img src={qrCode} alt="QRIS Code" className="w-full h-full object-contain p-2" />
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[250px]">
            Scan menggunakan GoPay, OVO, DANA, ShopeePay, LinkAja, atau aplikasi perbankan Anda
          </p>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download size={14} />
            Simpan Gambar QRIS
          </Button>
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

export default QRISModal;
