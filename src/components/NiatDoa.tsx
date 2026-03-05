import { useYearContext } from "@/contexts/YearContext";

const NiatDoa = () => {
  const { config } = useYearContext();
  return (
    <section 
      className="px-4 pb-6 w-full max-w-md mx-auto animate-fade-in-up" 
      style={{ animationDelay: "0.85s", opacity: 0 }}
    >
      <div className="rounded-2xl 
          bg-primary 
          text-primary-foreground
          border border-primary 
          p-6 text-center 
          shadow-md 
          transition-all duration-300 
          hover:shadow-lg 
          hover:-translate-y-0.5">

        <div className="gold-divider mb-4 max-w-[120px] mx-auto" />

        <p className="text-xs uppercase tracking-widest opacity-80 mb-3 font-medium">
          {config.niatDonasi.label}
        </p>

        <p className="text-sm md:text-base font-serif italic leading-relaxed opacity-95">
          &ldquo;{config.niatDonasi.text}&rdquo;
        </p>

        <div className="gold-divider mt-4 max-w-[120px] mx-auto" />
      </div>
    </section>
  );
};

export default NiatDoa;
