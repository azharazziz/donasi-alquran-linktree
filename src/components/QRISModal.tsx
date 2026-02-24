import { Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRIS_CONFIG, NIAT_DONASI } from "@/config";

interface QRISModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRISModal = ({ open, onOpenChange }: QRISModalProps) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(QRIS_CONFIG.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = QRIS_CONFIG.downloadFilename;
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
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            {QRIS_CONFIG.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {QRIS_CONFIG.description}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="flex flex-col items-center gap-4">
          {/* QRIS placeholder - replace src with actual QRIS image */}
          <div className="w-64 h-64 rounded-2xl border-2 border-border bg-card flex items-center justify-center overflow-hidden">
            <img src={QRIS_CONFIG.image} alt={QRIS_CONFIG.imageAlt} className="w-full h-full object-contain p-2" />
          </div>

          {/* Merchant Information */}
          <div className="w-full bg-muted/50 rounded-lg p-3 space-y-3">
            <div className="flex flex-col gap-3">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1 font-medium">NMID</p>
                <p className="text-sm font-semibold text-foreground">{QRIS_CONFIG.nmid}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Merchant Name</p>
                <p className="text-sm font-semibold text-foreground">{QRIS_CONFIG.merchantName}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center leading-relaxed max-w-[250px]">
            {QRIS_CONFIG.scanInfo}
          </p>

          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={handleDownload}
          >
            <Download size={14} />
            {QRIS_CONFIG.downloadText}
          </Button>
        </div>

        {/* Niat Donasi */}
        <div className="mt-4 rounded-xl bg-primary/5 border border-primary/10 p-4 text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2 font-medium">
            {NIAT_DONASI.label}
          </p>
          <p className="text-sm font-serif italic text-foreground leading-relaxed">
            &ldquo;{NIAT_DONASI.text}&rdquo;
          </p>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRISModal;
