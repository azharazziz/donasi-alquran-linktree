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

function stripMarkers(header: string): string {
  return header.replace(/\s*\[(hide|private)\]\s*/gi, "").trim();
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

function extractInstagramPostId(url: string): string | null {
  // Extract post ID from Instagram URLs
  // Format: https://www.instagram.com/p/POST_ID/ or https://www.instagram.com/reel/REEL_ID/
  const match = url.match(/(?:instagram\.com|instagr\.am)\/(?:p|reel)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
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

  if (!value || !isUrl(value)) {
    return <span className="text-sm text-muted-foreground">{value || "-"}</span>;
  }

  const driveId = extractGoogleDriveId(value);

  // Google Drive - use iframe embed
  if (driveId && !imgError) {
    const embedUrl = `https://drive.google.com/file/d/${driveId}/preview`;
    return (
      <div className="space-y-3">
        <div className="bg-muted rounded-lg border border-border overflow-hidden">
          <iframe
            src={embedUrl}
            className="w-full h-96"
            allow="autoplay"
            title="Google Drive preview"
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
            className="w-full object-contain max-h-96"
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
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary">
            {title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Detail lengkap dari data laporan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {headers.map((rawHeader) => {
            const cleanLabel = stripMarkers(rawHeader);
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
