const NiatDoa = () => {
  return (
    <section className="px-4 pb-6 w-full max-w-md mx-auto animate-fade-in-up" style={{ animationDelay: "0.85s", opacity: 0 }}>
      <div className="rounded-2xl bg-primary/5 border border-primary/10 p-6 text-center">
        <div className="gold-divider mb-4 max-w-[120px] mx-auto" />
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-medium">
          Niat Donasi
        </p>
        <p className="text-sm md:text-base font-serif italic text-foreground leading-relaxed">
          &ldquo;Saya niat berdonasi Al-Qur&apos;an karena Allah Ta&apos;ala,
          semoga menjadi amal jariyah yang terus mengalir pahalanya.&rdquo;
        </p>
        <div className="gold-divider mt-4 max-w-[120px] mx-auto" />
      </div>
    </section>
  );
};

export default NiatDoa;
