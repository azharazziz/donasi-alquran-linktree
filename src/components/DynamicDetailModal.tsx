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
import { stripFlags } from "@/lib/flags";
import {
  isSafeUrl,
  extractGoogleDriveId,
  convertGoogleDriveUrlToEmbedUrl,
  getGoogleDrivePreviewUrl,
  isInstagramUrl,
  isDirectImageUrl,
  extractInstagramPostId,
} from "@/lib/image-utils";

interface DynamicDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  row: Record<string, string> | null;
  headers: string[];
  title?: string;
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

// Extend window type for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process?: () => void;
      };
    };
  }
}

function BuktiRenderer({ value }: { value: string }) {
  const [imgError, setImgError] = useState(false);

  if (!value || !isSafeUrl(value)) {
    return <span className="text-sm text-muted-foreground">{value || "-"}</span>;
  }

  const driveId = extractGoogleDriveId(value);

  // Google Drive - try image first, fallback ke iframe preview
  if (driveId) {
    // Jika image gagal load, coba iframe preview
    if (imgError) {
      const previewUrl = getGoogleDrivePreviewUrl(value);
      return (
        <div className="space-y-3">
          <div className="bg-muted rounded-lg border border-border overflow-hidden">
            <iframe
              src={previewUrl}
              className="w-full h-96"
              allow="autoplay"
              title="Google Drive preview"
            />
          </div>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
          >
            <ExternalLink size={12} />
            Buka di Google Drive
          </a>
        </div>
      );
    }

    // Coba direct image embed dulu
    const imageUrl = convertGoogleDriveUrlToEmbedUrl(value);
    return (
      <div className="space-y-3">
        <div className="bg-muted rounded-lg border border-border overflow-hidden">
          <img
            src={imageUrl}
            alt="Bukti"
            className="w-full max-h-96 object-contain"
            onError={() => setImgError(true)}
          />
        </div>
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          <ExternalLink size={12} />
          Buka di Google Drive
        </a>
      </div>
    );
  }

  // Instagram - show as embedded iframe (Instagram post)
  if (isInstagramUrl(value)) {
    const postId = extractInstagramPostId(value);
    if (postId) {
      return (
        <div className="space-y-3">
          <div className="bg-muted rounded-lg border border-border overflow-hidden">
            <iframe
              src={`https://www.instagram.com/p/${postId}/embed/`}
              width="100%"
              height="450"
              frameBorder="0"
              scrolling="no"
              title="Instagram post"
              style={{ 
                maxWidth: "100%",
                background: "#FFF"
              }}
            />
          </div>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Instagram size={16} />
            Lihat di Instagram
            <ExternalLink size={12} />
          </a>
        </div>
      );
    }
  }

  // Direct image URL
  if (isDirectImageUrl(value) && !imgError) {
    return (
      <div className="space-y-3">
        <div className="bg-muted rounded-lg border border-border overflow-hidden">
          <img
            src={value}
            alt="Bukti"
            className="w-full object-contain"
            onError={() => setImgError(true)}
          />
        </div>
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
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Detail lengkap dari data laporan
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="space-y-4">
          {headers.map((rawHeader) => {
            const cleanLabel = stripFlags(rawHeader);
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DynamicDetailModal;
