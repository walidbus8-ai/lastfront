import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah M.",
    role: "Propriétaire",
    text: "RoomAI a complètement transformé mon salon ! Les propositions étaient à la fois créatives et réalistes. Je recommande vivement.",
    rating: 5,
  },
  {
    name: "Karim B.",
    role: "Architecte d'intérieur",
    text: "Un outil incroyable pour présenter des idées à mes clients. La visualisation AR est un vrai plus pour convaincre.",
    rating: 5,
  },
  {
    name: "Amina L.",
    role: "Étudiante",
    text: "J'ai pu redécorer ma chambre universitaire avec un budget limité grâce aux recommandations intelligentes de l'app.",
    rating: 4,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ce que disent nos utilisateurs
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Découvrez les expériences de ceux qui ont transformé leur intérieur avec RoomAI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < t.rating ? "text-primary fill-primary" : "text-border"}`}
                  />
                ))}
              </div>
              <p className="text-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div>
                <p className="font-semibold text-foreground text-sm">{t.name}</p>
                <p className="text-muted-foreground text-xs">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
