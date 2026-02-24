import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SOCIAL_MEDIA_LINKS } from "@/config";

interface SocialMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialMediaModal = ({ open, onOpenChange }: SocialMediaModalProps) => {
  const handleOpenLink = (url: string) => {
    if (url.startsWith("mailto:")) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            Media Sosial Kami
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ikuti kami di berbagai platform media sosial untuk mendapatkan
            informasi terbaru
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
          {SOCIAL_MEDIA_LINKS.map((social) => {
            const Icon = social.icon;
            return (
              <Button
                key={social.name}
                variant="outline"
                className={`h-auto flex-col gap-2 py-4 ${social.bgColor} ${social.color}`}
                onClick={() => handleOpenLink(social.url)}
              >
                <Icon size={32} />
                <span className="text-xs font-medium text-center">
                  {social.name}
                </span>
              </Button>
            );
          })}
        </div>

        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground text-center">
            Terima kasih telah mengikuti kami dan mendukung program donasi
            Al-Qur&apos;an
          </p>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialMediaModal;
