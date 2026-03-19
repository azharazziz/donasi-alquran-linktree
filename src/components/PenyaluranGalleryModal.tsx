import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Loader2, RefreshCw, AlertCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGoogleSheetDynamic } from "@/hooks/useGoogleSheets";
import { stripFlags } from "@/lib/flags";
import {
  isSafeUrl,
  convertGoogleDriveUrlToEmbedUrl,
  getGoogleDrivePreviewUrl,
  extractGoogleDriveId,
  isDirectImageUrl,
} from "@/lib/image-utils";

interface PenyaluranGalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface GalleryImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  originalUrl: string;
}

function GalleryImageCard({ image, onImageClick }: { image: GalleryImage; onImageClick: (image: GalleryImage) => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onImageClick(image)}
      className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-muted/30 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col h-full"
    >
      {/* Image Container with Overlay Title */}
      <div className="relative overflow-hidden flex-1 bg-muted min-h-48">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Gambar tidak dapat dimuat</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={image.imageUrl}
              alt={image.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Floating Badge for More Info */}
            <div className="absolute top-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ExternalLink size={16} className="text-white drop-shadow-lg" />
            </div>
          </>
        )}

        {/* Title Overlay at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/70 via-primary/30 to-transparent p-4 pt-8">
          <p className="text-sm font-semibold text-white line-clamp-2 group-hover:text-white/90 transition-colors duration-300">
            {image.title || "Bukti Penyaluran"}
          </p>
        </div>
      </div>

      {/* Info Section - Only Badges */}
      {image.description && (
        <div className="px-3.5 py-3 space-y-2.5">
          <div className="flex flex-wrap gap-1.5">
            {image.description.split(" + ").map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary/20 group-hover:border-primary/40 transition-all duration-300"
              >
                {item.trim()}
              </span>
            ))}
          </div>
          {/* Accent Line */}
          <div className="h-0.5 w-0 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500 rounded-full" />
        </div>
      )}
    </div>
  );
}

function ImagePreviewModal({
  image,
  onClose,
}: {
  image: GalleryImage | null;
  onClose: () => void;
}) {
  const [imgError, setImgError] = useState(false);

  if (!image) return null;

  const driveId = extractGoogleDriveId(image.originalUrl);

  return (
    <Dialog open={!!image} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col p-0 rounded-2xl">
        <DialogHeader className="px-6 pt-6 pb-0 space-y-2">
          <div>
            <DialogTitle className="text-xl font-serif text-primary">
              {image.title || "Bukti Penyaluran"}
            </DialogTitle>
            {image.description && (
              <DialogDescription className="text-muted-foreground text-base font-semibold mt-2">
                {image.description}
              </DialogDescription>
            )}
          </div>
        </DialogHeader>

        <div className="overflow-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div className="rounded-xl h-full border border-border/50 overflow-auto bg-muted/30 flex justify-center">
            {imgError && driveId ? (
              <iframe
                src={getGoogleDrivePreviewUrl(image.originalUrl)}
                className="w-full h-full"
                allow="autoplay"
                title="Image preview"
              />
            ) : (
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-contain"
                onError={() => setImgError(true)}
              />
            )}
          </div>

          <a
            href={image.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            <ExternalLink size={16} />
            Buka di tab baru
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const PenyaluranGalleryModal = ({ open, onOpenChange }: PenyaluranGalleryModalProps) => {
  const { headers, rows, loading, error, refetch } = useGoogleSheetDynamic("Penyaluran Donasi", open);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  // Extract bukti column
  const buktiHeaderIndex = headers.findIndex((h) =>
    stripFlags(h).toLowerCase().includes("bukti")
  );
  const tempatHeaderIndex = headers.findIndex((h) =>
    stripFlags(h).toLowerCase().includes("tempat")
  );
  const qtyAlQuranHeaderIndex = headers.findIndex((h) =>
    stripFlags(h).toLowerCase().includes("qty al quran") ||
    stripFlags(h).toLowerCase().includes("qty alquran") ||
    stripFlags(h).toLowerCase().includes("quran qty")
  );
  const qtyIqroHeaderIndex = headers.findIndex((h) =>
    stripFlags(h).toLowerCase().includes("qty iqro") ||
    stripFlags(h).toLowerCase().includes("iqro qty")
  );

  const buktiHeader = buktiHeaderIndex >= 0 ? headers[buktiHeaderIndex] : null;
  const tempatHeader = tempatHeaderIndex >= 0 ? headers[tempatHeaderIndex] : null;
  const qtyAlQuranHeader = qtyAlQuranHeaderIndex >= 0 ? headers[qtyAlQuranHeaderIndex] : null;
  const qtyIqroHeader = qtyIqroHeaderIndex >= 0 ? headers[qtyIqroHeaderIndex] : null;

  // Build gallery images
  const galleryImages: GalleryImage[] = rows
    .filter((row) => buktiHeader && row[buktiHeader])
    .map((row, index) => {
      const buktiUrl = row[buktiHeader!] || "";
      const tempat = row[tempatHeader!] || `Penyaluran ${index + 1}`;
      const qtyAlQuran = row[qtyAlQuranHeader!] || "";
      const qtyIqro = row[qtyIqroHeader!] || "";

      // Build description from quantities
      const descriptionParts: string[] = [];
      if (qtyAlQuran) {
        descriptionParts.push(`${qtyAlQuran} Al-Qur'an`);
      }
      if (qtyIqro) {
        descriptionParts.push(`${qtyIqro} Iqro`);
      }
      const description = descriptionParts.length > 0 ? descriptionParts.join(" + ") : "";

      let imageUrl = buktiUrl;
      // Convert Google Drive URLs to embed format
      if (extractGoogleDriveId(buktiUrl)) {
        imageUrl = convertGoogleDriveUrlToEmbedUrl(buktiUrl);
      }

      return {
        id: `image-${index}`,
        title: stripFlags(tempat) || "Bukti Penyaluran",
        description,
        imageUrl,
        originalUrl: buktiUrl,
      };
    })
    .filter((img) => isSafeUrl(img.originalUrl));

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col p-0 rounded-2xl">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
            <div className="space-y-1.5">
              <DialogTitle className="text-2xl font-serif text-primary">
                Galeri Penyaluran Donasi
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Bukti nyata dari penyaluran donasi Al-Qur'an yang telah dilakukan kepada berbagai tempat dan komunitas
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="flex items-center justify-between px-6 py-3.5 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
              <span className="text-sm font-medium text-foreground">
                {galleryImages.length} bukti penyaluran
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={refetch}
              disabled={loading}
              className="h-9 w-9 text-primary hover:bg-primary/10 hover:text-primary flex-shrink-0 transition-all duration-200"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 pb-6 pt-5 min-h-0">
            {loading && (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div className="relative">
                  <Loader2 size={32} className="text-primary animate-spin" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">Memuat galeri...</p>
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-5 py-4 flex gap-3.5 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-destructive">Gagal memuat galeri</p>
                  <p className="text-xs text-destructive/70 mt-1.5">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && galleryImages.length === 0 && (
              <div className="text-center py-16">
                <div className="space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-muted/50 mx-auto flex items-center justify-center">
                    <ExternalLink size={32} className="text-muted-foreground/40" />
                  </div>
                  <p className="text-sm text-muted-foreground font-medium">Belum ada bukti penyaluran</p>
                  <p className="text-xs text-muted-foreground/60">Galeri akan ditampilkan ketika ada data penyaluran</p>
                </div>
              </div>
            )}

            {!loading && galleryImages.length > 0 && (
              <div className="grid grid-cols-3 xl:grid-cols-4 gap-5 auto-rows-max">
                {galleryImages.map((image, idx) => (
                  <div
                    key={image.id}
                    style={{
                      animationDelay: `${idx * 0.05}s`,
                    }}
                    className="animate-fade-in-up opacity-0"
                  >
                    <GalleryImageCard
                      image={image}
                      onImageClick={setSelectedImage}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <ImagePreviewModal image={selectedImage} onClose={() => setSelectedImage(null)} />
    </>
  );
};

export default PenyaluranGalleryModal;
