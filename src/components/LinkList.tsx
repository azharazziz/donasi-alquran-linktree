import { useState } from "react";
import LinkCard from "./LinkCard";
import TransferBankModal from "./TransferBankModal";
import QRISModal from "./QRISModal";
import SocialMediaModal from "./SocialMediaModal";
import DonationReportModal from "./DonationReportModal";
import { LINKS } from "@/config";

const LinkList = () => {
  const [transferOpen, setTransferOpen] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [socialMediaOpen, setSocialMediaOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  // Map action types to their handlers
  const getHandler = (action?: string) => {
    switch (action) {
      case "transfer":
        return () => setTransferOpen(true);
      case "qris":
        return () => setQrisOpen(true);
      case "report":
        return () => setReportOpen(true);
      case "social":
        return () => setSocialMediaOpen(true);
      default:
        return undefined;
    }
  };

  return (
    <>
      <section className="px-4 pb-8 w-full max-w-md mx-auto">
        <div className="flex flex-col gap-3">
          {LINKS.map((link, index) => (
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
    </>
  );
};

export default LinkList;
