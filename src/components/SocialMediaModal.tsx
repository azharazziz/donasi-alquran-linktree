import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
  Mail,
  Globe,
  MessageCircle,
  Share2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface SocialMediaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SocialMediaModal = ({ open, onOpenChange }: SocialMediaModalProps) => {
  const socialMediaLinks = [
    {
      name: "Kamar Baca Magelang",
      icon: Instagram,
      url: "https://instagram.com/kamarbacamgl", // Replace with actual Instagram URL
      color: "hover:text-pink-500",
      bgColor: "hover:bg-pink-50",
    },
    {
        name: "Fotoin Project",
        icon: Instagram,
        url: "https://instagram.com/fotoin.project", // Replace with actual Instagram URL
        color: "hover:text-pink-600",
        bgColor: "hover:bg-pink-50",
    },
    {
        name: "SKS Foundation",
        icon: Instagram,
        url: "https://instagram.com/sksfound", // Replace with actual Instagram URL
        color: "hover:text-pink-500",
        bgColor: "hover:bg-pink-50",
    },
    {
        name: "Mie Ayam Cap 2 Jago",
        icon: Instagram,
        url: "https://instagram.com/capduajago", // Replace with actual Instagram URL
        color: "hover:text-pink-500",
        bgColor: "hover:bg-pink-50",
    },
    {
        name: "Bubur Kijang",
        icon: Instagram,
        url: "https://instagram.com/bubur_kijang", // Replace with actual Instagram URL
        color: "hover:text-pink-500",
        bgColor: "hover:bg-pink-50",
    },
    {
      name: "Kamar Baca Magelang",
      icon: Twitter,
      url: "https://twitter.com/kamarbacamgl", // Replace with actual Twitter URL
      color: "hover:text-black",
      bgColor: "hover:bg-gray-50",
    },
    {
      name: "Sickillshoes",
      icon: Twitter,
      url: "https://twitter.com/sickillshoes", // Replace with actual Twitter URL
      color: "hover:text-black",
      bgColor: "hover:bg-gray-50",
    },
  ];

  const handleOpenLink = (url: string) => {
    if (url.startsWith("mailto:")) {
      window.location.href = url;
    } else {
      window.open(url, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif text-primary flex items-center gap-2">
            <Share2 size={24} />
            Media Sosial Kami
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ikuti kami di berbagai platform media sosial untuk mendapatkan
            informasi terbaru
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {socialMediaLinks.map((social) => {
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
      </DialogContent>
    </Dialog>
  );
};

export default SocialMediaModal;
