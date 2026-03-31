import { useState } from "react";
import { motion } from "framer-motion";
import { Images, Sparkles, Layout } from "lucide-react";

const galleryItems = [
  {
    style: "Moderne Minimaliste",
    before: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    after: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
  },
  {
    style: "Scandinave Épuré",
    before: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800&q=80",
    after: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80",
  },
  {
    style: "Classique Élégant",
    before: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
];

const Gallery = () => {
  const [sliderPositions, setSliderPositions] = useState<number[]>(galleryItems.map(() => 50));

  const handleSlider = (index: number, e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const x = ((clientX - rect.left) / rect.width) * 100;
    setSliderPositions((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(100, x));
      return next;
    });
  };

  return (
    <section id="gallery" className="relative py-20 bg-background overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Rendus IA Pro
          </div>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Galerie <span className="text-primary">Avant / Après</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            Découvrez comment notre technologie transforme radicalement vos espaces de vie.
          </p>
        </motion.div>

        {/* Grid Container - مجموع بـ max-w-5xl باش يجي صغير شوية */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.style}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div
                className="relative rounded-2xl overflow-hidden aspect-[3/2] cursor-col-resize select-none border border-border shadow-md transition-all duration-300 group-hover:shadow-xl"
                onMouseMove={(e) => handleSlider(index, e)}
                onTouchMove={(e) => handleSlider(index, e)}
              >
                {/* After image */}
                <img
                  src={item.after}
                  alt={`${item.style} - Après`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Before image (Clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden border-r-2 border-white/40"
                  style={{ width: `${sliderPositions[index]}%` }}
                >
                  <img
                    src={item.before}
                    alt={`${item.style} - Avant`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ 
                        width: `calc(100 * 100 / ${sliderPositions[index]})`, 
                        maxWidth: "none" 
                    }}
                  />
                </div>

                {/* Slider Handle */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none"
                  style={{ left: `${sliderPositions[index]}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg border border-primary/20">
                    <div className="flex gap-0.5">
                       <div className="w-0.5 h-3 bg-primary/60 rounded-full" />
                       <div className="w-0.5 h-3 bg-primary/60 rounded-full" />
                    </div>
                  </div>
                </div>

                {/* Labels */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-black/40 backdrop-blur-md text-[8px] text-white font-bold uppercase tracking-widest px-2 py-1 rounded">
                    Avant
                  </span>
                  <span className="bg-primary/80 backdrop-blur-md text-[8px] text-white font-bold uppercase tracking-widest px-2 py-1 rounded">
                    Après
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between px-1">
                <h3 className="text-sm font-bold text-foreground">{item.style}</h3>
                <Layout className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;