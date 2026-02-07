import {
  Landmark,
  QrCode,
  Globe,
  MessageCircle,
  FileText,
  Instagram,
} from "lucide-react";
import LinkCard from "./LinkCard";

const links = [
  {
    icon: Landmark,
    title: "Donasi via Transfer Bank",
    subtitle: "BSI / BCA / BRI",
    href: "#transfer",
  },
  {
    icon: QrCode,
    title: "Donasi via QRIS",
    subtitle: "Scan & bayar dari semua e-wallet",
    href: "#qris",
  },
  {
    icon: Globe,
    title: "Donasi Online",
    subtitle: "Kitabisa.com & platform lainnya",
    href: "#online",
  },
  {
    icon: MessageCircle,
    title: "Konfirmasi & Informasi",
    subtitle: "Hubungi kami via WhatsApp",
    href: "#whatsapp",
  },
  {
    icon: FileText,
    title: "Proposal Program",
    subtitle: "Unduh dokumen proposal lengkap",
    href: "#proposal",
  },
  {
    icon: Instagram,
    title: "Media Sosial",
    subtitle: "Instagram & Facebook",
    href: "#sosmed",
  },
];

const LinkList = () => {
  return (
    <section className="px-4 pb-8 w-full max-w-md mx-auto">
      <div className="flex flex-col gap-3">
        {links.map((link, index) => (
          <div
            key={link.title}
            className="animate-fade-in-up"
            style={{ animationDelay: `${0.4 + index * 0.08}s`, opacity: 0 }}
          >
            <LinkCard {...link} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default LinkList;
