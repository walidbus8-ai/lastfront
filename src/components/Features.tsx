import { motion } from "framer-motion";
import { Wand2, ScanEye, View } from "lucide-react";

const features = [
  {
    icon: Wand2,
    title: "Génération IA",
    description:
      "Prenez une photo de votre pièce et obtenez instantanément un design complet et personnalisé. Murs, sol, meubles — tout est repensé par notre IA.",
  },
  {
    icon: ScanEye,
    title: "Analyse Intelligente",
    description:
      "Notre IA analyse l'espace, l'éclairage et la disposition pour vous recommander les meilleures couleurs, styles et agencements adaptés à votre budget.",
  },
  {
    icon: View,
    title: "Réalité Augmentée",
    description:
      "Visualisez le nouveau design directement dans votre pièce grâce à la réalité augmentée. Testez, ajustez et validez avant de vous lancer.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Une suite d'outils puissants pour transformer votre espace de vie en quelques clics.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="bg-card rounded-2xl p-8 border border-border hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-serif text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
