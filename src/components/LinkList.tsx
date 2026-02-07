import { useState } from "react";
import {
  Landmark,
  QrCode,
  Globe,
  MessageCircle,
  FileText,
  Instagram,
} from "lucide-react";
import LinkCard from "./LinkCard";
import TransferBankModal from "./TransferBankModal";
import QRISModal from "./QRISModal";

const LinkList = () => {
  const [transferOpen, setTransferOpen] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);

  const links = [
    {
      icon: Landmark,
      title: "Donasi via Transfer Bank",
      subtitle: "BCA / Mandiri / BRI / BNI / BSI",
      onClick: () => setTransferOpen(true),
    },
    {
      icon: QrCode,
      title: "Donasi via QRIS",
      subtitle: "Scan & bayar dari semua e-wallet",
      onClick: () => setQrisOpen(true),
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

  return (
    <>
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

      <TransferBankModal open={transferOpen} onOpenChange={setTransferOpen} />
      <QRISModal open={qrisOpen} onOpenChange={setQrisOpen} />
    </>
  );
};

export default LinkList;
