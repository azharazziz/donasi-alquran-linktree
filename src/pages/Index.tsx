import DonationHeader from "@/components/DonationHeader";
import DonationAmount from "@/components/DonationAmount";
import RealisasiAmount from "@/components/RealisasiAmount";
import HighlightCards from "@/components/HighlightCards";
import LinkList from "@/components/LinkList";
import NiatDoa from "@/components/NiatDoa";
import DonaturSection from "@/components/DonaturSection";
import Footer from "@/components/Footer";
import { YearSwitcher } from "@/components/YearSwitcher";
import { useDonasiTotal, useRealisasiTotal } from "@/hooks/useGoogleSheets";

const Index = () => {
  const { total, loading, lastUpdate } = useDonasiTotal();
  const { total: realisasiTotal, loading: realisasiLoading } = useRealisasiTotal();

  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <div className="flex flex-col items-center max-w-lg mx-auto">
        {/* Year Switcher */}
        <div className="w-full px-4 pt-4 pb-2">
          <div className="flex justify-center">
            <YearSwitcher variant="buttons" />
          </div>
        </div>

        <DonationHeader />
        <DonationAmount amount={total} loading={loading} lastUpdate={lastUpdate} />
        <RealisasiAmount amount={realisasiTotal} loading={realisasiLoading} />
        <HighlightCards />
        <LinkList />
        <NiatDoa />
        <DonaturSection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
