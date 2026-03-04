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
import { useYearContext } from "@/contexts/YearContext";

const Index = () => {
  const { total, loading, lastUpdate } = useDonasiTotal();
  const { total: realisasiTotal, loading: realisasiLoading } = useRealisasiTotal();
  const { config } = useYearContext();

  // Conditional styling - gunakan config jika ada, otherwise gunakan CSS default
  const hasCustomBackground = config.backgroundImage;
  const backgroundStyles = hasCustomBackground ? {
    backgroundImage: `url('${config.backgroundImage}')`,
    backgroundSize: config.backgroundImageSize || '150px',
    backgroundRepeat: 'repeat',
    backgroundAttachment: 'fixed',
  } : undefined;

  const containerClass = hasCustomBackground 
    ? "min-h-screen bg-background islamic-pattern-base"
    : "min-h-screen bg-background islamic-pattern";

  return (
    <div 
      className={containerClass}
      style={backgroundStyles}
    >
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
