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
      default:
        return undefined;
    }
  };

  return (
    <>
      {!config.donationStatus.isOpen && (
        <section className="px-4 pb-6 w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
          <div className="relative overflow-hidden rounded-2xl border border-destructive/50 dark:border-destructive/40 bg-destructive/5 dark:bg-destructive/10 px-6 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 hover:border-destructive/70 group">
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.08))'}} />
            <div className="relative flex items-center gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-destructive/15 dark:bg-destructive/25 flex items-center justify-center text-destructive transition-colors duration-300 group-hover:bg-destructive group-hover:text-destructive-foreground">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-destructive dark:text-destructive text-sm md:text-base">
                  Donasi Ditutup
                </p>
                <p className="text-xs text-destructive/70 dark:text-destructive/80 mt-0.5">
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
    </>
  );
};

export default LinkList;
