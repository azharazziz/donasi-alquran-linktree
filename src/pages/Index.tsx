import DonationHeader from "@/components/DonationHeader";
import DonationAmount from "@/components/DonationAmount";
import LinkList from "@/components/LinkList";
import NiatDoa from "@/components/NiatDoa";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <div className="flex flex-col items-center max-w-lg mx-auto">
        <DonationHeader />
        <DonationAmount amount="Rp 125.000.000" />
        <LinkList />
        <NiatDoa />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
