import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useYearContext } from "@/contexts/YearContext";

interface FAQModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FAQModal = ({ open, onOpenChange }: FAQModalProps) => {
  const { config } = useYearContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-serif text-primary">
            Pertanyaan yang Sering Diajukan
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Temukan jawaban untuk pertanyaan umum Anda
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 px-6 pb-6 pt-4 min-h-0">
          {config.faq && config.faq.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {config.faq.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary py-3">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-foreground/80 leading-relaxed pb-3">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <p className="text-sm text-muted-foreground">Belum ada FAQ tersedia</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQModal;
