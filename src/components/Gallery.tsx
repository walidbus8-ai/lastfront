import { useState } from "react";
import { motion } from "framer-motion";

const galleryItems = [
  {
    style: "Moderne",
    before: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop",
  },
  {
    style: "Scandinave",
    before: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop",
  },
  {
    style: "Classique",
    before: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop",
    after: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=600&h=400&fit=crop",
  },
];

const Gallery = () => {
  const [sliderPositions, setSliderPositions] = useState<number[]>(galleryItems.map(() => 50));

  const handleSlider = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setSliderPositions((prev) => {
      const next = [...prev];
      next[index] = Math.max(0, Math.min(100, x));
      return next;
    });
  };

  return (
    <section id="gallery" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Galerie Avant / Après
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Glissez pour comparer les transformations réalisées par notre IA.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.style}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className="relative rounded-xl overflow-hidden aspect-[3/2] cursor-col-resize select-none"
                onMouseMove={(e) => handleSlider(index, e)}
              >
                {/* After image (full) */}
                <img
                  src={item.after}
                  alt={`${item.style} - Après`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Before image (clipped) */}
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPositions[index]}%` }}
                >
                  <img
                    src={item.before}
                    alt={`${item.style} - Avant`}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ width: `${100 / (sliderPositions[index] / 100)}%`, maxWidth: "none" }}
                  />
                </div>
                {/* Slider line */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary-foreground/80 shadow-lg"
                  style={{ left: `${sliderPositions[index]}%` }}
                >
                  <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-primary-foreground/90 flex items-center justify-center shadow-md">
                    <span className="text-xs font-bold text-foreground">↔</span>
                  </div>
                </div>
                {/* Labels */}
                <span className="absolute top-3 left-3 bg-foreground/70 text-primary-foreground text-xs px-2 py-1 rounded">
                  Avant
                </span>
                <span className="absolute top-3 right-3 bg-primary/80 text-primary-foreground text-xs px-2 py-1 rounded">
                  Après
                </span>
              </div>
              <p className="text-center text-sm font-medium text-foreground mt-3">
                Style {item.style}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
