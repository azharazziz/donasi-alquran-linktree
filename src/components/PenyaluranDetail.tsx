import { useState } from "react";
import type { PenyaluranRow } from "@/hooks/useGoogleSheets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar, MapPin, BookOpenCheck, BookOpen, Image, ExternalLink } from "lucide-react";

interface PenyaluranDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PenyaluranRow | null;
}

const PenyaluranDetail = ({ open, onOpenChange, data }: PenyaluranDetailProps) => {
  const [imageError, setImageError] = useState(false);

  if (!data) return null;

  const hasBukti = data.bukti && data.bukti.trim() !== "";
  const isImage = hasBukti && /\.(jpg|jpeg|png|gif|webp|bmp)/i.test(data.bukti);
  const isPdf = hasBukti && /\.pdf/i.test(data.bukti);
  const isDriveLink = hasBukti && data.bukti.includes("drive.google.com");

  // Convert Google Drive share links to direct preview/thumbnail
  const getPreviewUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/thumbnail?id=${fileIdMatch[1]}&sz=w800`;
    }
    return url;
  };

  const getViewUrl = (url: string) => {
    const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/view`;
    }
    return url;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif text-primary">
            Detail Penyaluran Donasi
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Informasi lengkap penyaluran donasi
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <DetailRow icon={Calendar} label="Tanggal" value={data.tanggal} />
          <DetailRow icon={MapPin} label="Tempat" value={data.tempat} />
          {data.qtyIqro && (
            <DetailRow icon={BookOpenCheck} label="QTY IQRO" value={data.qtyIqro} />
          )}
          {data.qtyAlQuran && (
            <DetailRow icon={BookOpen} label="QTY AL QURAN" value={data.qtyAlQuran} />
          )}

          {/* Bukti Preview */}
          {hasBukti && (
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                  <Image size={16} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">Bukti Penyaluran</p>
              </div>

              {(isImage || isDriveLink) && !imageError ? (
                <div className="rounded-lg overflow-hidden border border-border bg-card">
                  <img
                    src={isDriveLink ? getPreviewUrl(data.bukti) : data.bukti}
                    alt="Bukti penyaluran"
                    className="w-full h-auto object-contain max-h-64"
                    onError={() => setImageError(true)}
                  />
                </div>
              ) : isPdf ? (
                <div className="rounded-lg border border-border bg-card p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Dokumen PDF</p>
                </div>
              ) : null}

              <a
                href={isDriveLink ? getViewUrl(data.bukti) : data.bukti}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
              >
                <ExternalLink size={12} />
                Buka bukti di tab baru
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-muted/40 border border-border px-4 py-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary mt-0.5">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-sm font-semibold text-foreground break-words">{value || "-"}</p>
      </div>
    </div>
  );
}

export default PenyaluranDetail;
