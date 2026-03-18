import { useState } from "react";
import { AlertCircle } from "lucide-react";
import LinkCard from "./LinkCard";
import TransferBankModal from "./TransferBankModal";
import QRISModal from "./QRISModal";
import SocialMediaModal from "./SocialMediaModal";
import DonationReportModal from "./DonationReportModal";
import FAQModal from "./FAQModal";
import HowToDonateModal from "./HowToDonateModal";
import DonationProductsModal from "./DonationProductsModal";
import PenyaluranGalleryModal from "./PenyaluranGalleryModal";
import { useYearContext } from "@/contexts/YearContext";

const LinkList = () => {
  const { config } = useYearContext();
  const [transferOpen, setTransferOpen] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [howToDonateOpen, setHowToDonateOpen] = useState(false);
  const [donationProductsOpen, setDonationProductsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // Map action types to their handlers
  const getHandler = (action?: string) => {
    switch (action) {
      case "transfer":
        return () => setTransferOpen(true);
      case "qris":
        return () => setQrisOpen(true);
      case "report":
        return () => setReportOpen(true);
      case "faq":
        return () => setFaqOpen(true);
      case "howToDonate":
        return () => setHowToDonateOpen(true);
      case "donationProducts":
        return () => setDonationProductsOpen(true);
      case "social":
        return () => setSocialMediaOpen(true);
      case "gallery":
        return () => setGalleryOpen(true);
      default:
        return undefined;
    }
  };

  return (
    <>
      {!config.donationStatus.isOpen && (
        <section className="px-4 pb-6 w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <div className="relative overflow-hidden rounded-2xl 
              border border-destructive 
              bg-destructive 
              text-destructive-foreground 
              px-6 py-4 
              shadow-md 
              transition-all duration-300 
              hover:shadow-lg 
              hover:-translate-y-0.5 
              hover:bg-destructive/90
              group">

            <div className="flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl 
                  bg-destructive-foreground/20 
                  flex items-center justify-center 
                  text-destructive-foreground
                  transition-all duration-300
                  group-hover:bg-destructive-foreground
                  group-hover:text-destructive">
                <AlertCircle size={20} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm md:text-base">
                  Donasi Ditutup
                </p>
                <p className="text-xs mt-0.5 opacity-90">
                  {config.donationStatus.closedMessage}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <section className="px-4 pb-8 w-full max-w-md mx-auto">
        <div className="flex flex-col gap-3">
          {config.links
            .filter((link) => {
              // Hide transfer and QRIS links if donations are closed
              if (!config.donationStatus.isOpen) {
                return !['transfer', 'qris'].includes('action' in link ? link.action : '');
              }
              return true;
            })
            .map((link, index) => (
            <div
              key={link.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${0.4 + index * 0.08}s`, opacity: 0 }}
            >
              <LinkCard 
                {...link}
                onClick={getHandler('action' in link ? link.action : undefined)}
              />
            </div>
          ))}
        </div>
      </section>

      <TransferBankModal open={transferOpen} onOpenChange={setTransferOpen} />
      <QRISModal open={qrisOpen} onOpenChange={setQrisOpen} />
      <SocialMediaModal open={socialMediaOpen} onOpenChange={setSocialMediaOpen} />
      <DonationReportModal open={reportOpen} onOpenChange={setReportOpen} />
      <FAQModal open={faqOpen} onOpenChange={setFaqOpen} />
      <HowToDonateModal open={howToDonateOpen} onOpenChange={setHowToDonateOpen} />
      <DonationProductsModal open={donationProductsOpen} onOpenChange={setDonationProductsOpen} />
      <PenyaluranGalleryModal open={galleryOpen} onOpenChange={setGalleryOpen} />
    </>
  );
};

export default LinkList;
