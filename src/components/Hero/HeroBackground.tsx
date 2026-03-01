const HeroBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Cool glow behind the showcase, echoing the light source in the mock */}
      <div className="absolute right-[-10%] top-[8%] h-[38rem] w-[38rem] rounded-full bg-brand-600/25 blur-[120px]" />
      <div className="absolute left-[-15%] bottom-[-10%] h-[30rem] w-[30rem] rounded-full bg-brand-700/15 blur-[120px]" />
      {/* Faint grid to keep the flat navy from reading as empty */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #1a2543 1px, transparent 1px), linear-gradient(to bottom, #1a2543 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />
    </div>
  )
}

export default HeroBackground
