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
import SocialMediaModal from "./SocialMediaModal";

const LinkList = () => {
  const [transferOpen, setTransferOpen] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);

  const links = [
    {
      icon: Landmark,
      title: "Donasi via Transfer Bank",
      subtitle: "Bank BSI dan UOB",
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
      title: "Konfirmasi Donasi",
      subtitle: "Isi form konfirmasi donasi Anda",
      href: "https://forms.gle/qoKqviu7XksLSBT58",
    },
    {
      icon: MessageCircle,
      title: "Pertanyaan dan Informasi",
      subtitle: "Hubungi kami via WhatsApp",
      href: "https://wa.me/6285155238000",
    },
    {
      icon: FileText,
      title: "Proposal Program",
      subtitle: "Unduh dokumen proposal lengkap",
      href: "https://drive.google.com/file/d/10uaohZ3cxUyyTtA7yRhAH2i2xbyIr993/view?usp=sharing",
    },
    {
      icon: Instagram,
      title: "Media Sosial",
      subtitle: "Instagram & Facebook",
      onClick: () => setSocialMediaOpen(true),
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
      <SocialMediaModal open={socialMediaOpen} onOpenChange={setSocialMediaOpen} />
    </>
  );
};

export default LinkList;
