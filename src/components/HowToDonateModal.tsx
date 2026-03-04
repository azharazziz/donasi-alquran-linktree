import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useYearContext } from "@/contexts/YearContext";

interface HowToDonateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const HowToDonateModal = ({ open, onOpenChange }: HowToDonateModalProps) => {
  const { config } = useYearContext();

  if (!config.howToDonate) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            {config.howToDonate.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {config.howToDonate.description}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4 min-h-0">
          <div className="space-y-3">
            {config.howToDonate.steps.map((step) => (
              <div
                key={step.number}
                className="flex gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm">
                    {step.title}
                  </h4>
                  <p className="text-sm text-foreground/70 mt-1">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToDonateModal;
