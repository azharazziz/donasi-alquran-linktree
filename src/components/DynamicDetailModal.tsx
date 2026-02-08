import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Calendar,
  User,
  Banknote,
  MapPin,
  BookOpen,
  Image,
  FileText,
  ExternalLink,
  Instagram,
} from "lucide-react";

interface DynamicDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: Record<string, string> | null;
  headers: string[];
  title?: string;
}

function stripHideMarker(header: string): string {
  return header.replace(/\s*\[hide\]\s*/gi, "").trim();
}

function getFieldIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes("tanggal")) return Calendar;
  if (lower.includes("donatur") || lower.includes("nama")) return User;
  if (lower.includes("nominal") || lower.includes("saldo")) return Banknote;
  if (lower.includes("tempat") || lower.includes("lokasi")) return MapPin;
  if (lower.includes("quran") || lower.includes("iqro") || lower.includes("keperluan")) return BookOpen;
  if (lower.includes("bukti")) return Image;
  return FileText;
}

function isUrl(value: string): boolean {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

function extractGoogleDriveId(url: string): string | null {
  // Match /d/FILE_ID/ or id=FILE_ID
  const match1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  return null;
}

function isInstagramUrl(url: string): boolean {
  return url.includes("instagram.com") || url.includes("instagr.am");
}

function isDirectImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}

function BuktiRenderer({ value }: { value: string }) {
  const [imgError, setImgError] = useState(false);

  if (!value || !isUrl(value)) {
    return <span className="text-sm text-muted-foreground">{value || "-"}</span>;
  }

  const driveId = extractGoogleDriveId(value);

  // Google Drive image
  if (driveId && !imgError) {
    const thumbnailUrl = `https://drive.google.com/thumbnail?id=${driveId}&sz=w800`;
    return (
      <div className="space-y-3">
        <img
          src={thumbnailUrl}
          alt="Bukti"
          className="w-full rounded-lg border border-border object-contain max-h-64"
          onError={() => setImgError(true)}
        />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink size={12} />
          Buka di tab baru
        </a>
      </div>
    );
  }

  // Instagram link
  if (isInstagramUrl(value)) {
    return (
      <a
        href={value}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary hover:underline bg-muted/50 px-3 py-2 rounded-lg"
      >
        <Instagram size={16} />
        Lihat di Instagram
        <ExternalLink size={12} />
      </a>
    );
  }

  // Direct image URL
  if (isDirectImageUrl(value) && !imgError) {
    return (
      <div className="space-y-3">
        <img
          src={value}
          alt="Bukti"
          className="w-full rounded-lg border border-border object-contain max-h-64"
          onError={() => setImgError(true)}
        />
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink size={12} />
          Buka di tab baru
        </a>
      </div>
    );
  }

  // Fallback: clickable link
  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
    >
      <ExternalLink size={14} />
      Lihat bukti
    </a>
  );
}

const DynamicDetailModal = ({
  open,
  onOpenChange,
  row,
  headers,
  title = "Detail",
}: DynamicDetailModalProps) => {
  if (!row) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-serif text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Detail lengkap dari data laporan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {headers.map((rawHeader) => {
            const cleanLabel = stripHideMarker(rawHeader);
            const value = row[rawHeader] ?? "";
            const isBukti = cleanLabel.toLowerCase().includes("bukti");
            const Icon = getFieldIcon(cleanLabel);

            // Skip empty values for non-bukti fields (but always show bukti)
            if (!value && !isBukti) return null;

            return (
              <div key={rawHeader} className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Icon size={12} />
                  {cleanLabel}
                </div>
                {isBukti ? (
                  <BuktiRenderer value={value} />
                ) : (
                  <p className="text-sm text-foreground pl-5">
                    {value || "-"}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicDetailModal;
