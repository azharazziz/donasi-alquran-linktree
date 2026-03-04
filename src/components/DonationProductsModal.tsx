import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useYearContext } from "@/contexts/YearContext";

interface DonationProductsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DonationProductsModal = ({ open, onOpenChange }: DonationProductsModalProps) => {
  const { config } = useYearContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!config.donationProducts || config.donationProducts.length === 0) {
    return null;
  }

  const current = config.donationProducts[currentIndex];

  const handlePrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? config.donationProducts!.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === config.donationProducts!.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            Wujud Donasi
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Donasi yang Anda berikan akan diwujudkan dalam bentuk produk-produk berikut
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4 min-h-0 space-y-4">
          {current.image && (
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-48 object-contain rounded-lg"
            />
          )}

          <div>
            <h3 className="text-2xl font-serif font-semibold text-primary mb-2">
              {current.title}
            </h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {current.description}
            </p>
          </div>

          {/* Advantages */}
          {current.advantages && current.advantages.length > 0 && (
            <div>
              <h4 className="font-medium text-primary text-sm mb-3">Kelebihan:</h4>
              <ul className="space-y-2">
                {current.advantages.map((advantage, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                    </span>
                    <span className="text-foreground/80">{advantage}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reasons */}
          {current.reasons && current.reasons.length > 0 && (
            <div>
              <h4 className="font-medium text-primary text-sm mb-3">Alasan Berdonasi:</h4>
              <ul className="space-y-2">
                {current.reasons.map((reason, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                    </span>
                    <span className="text-foreground/80">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Navigation */}
        {config.donationProducts.length > 1 && (
          <div className="px-6 pb-6 pt-4 border-t border-border flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              className="h-9 w-9"
            >
              <ChevronLeft size={18} />
            </Button>

            <div className="flex-1 text-center">
              <p className="text-sm text-muted-foreground">
                {currentIndex + 1} dari {config.donationProducts.length}
              </p>
              <div className="flex gap-2 justify-center mt-2">
                {config.donationProducts.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-6"
                        : "bg-border w-2"
                    }`}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="h-9 w-9"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DonationProductsModal;
