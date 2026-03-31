import { motion } from "framer-motion";
import { Wand2, ScanEye, Image } from "lucide-react";

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
      "Notre IA analyse l'espace, l'éclairage et la disposition pour vous recommander les meilleures couleurs, styles et agencements adaptés à votre pièce.",
  },
  {
    icon: Image,
    title: "Rendus Haute Définition",
    description:
      "Visualisez le nouveau design avec une qualité exceptionnelle. Comparez les styles et sauvegardez vos transformations préférées en un clic.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* إضافة لمسة خفيفة ديال الخلفية باش يجي متناسق مع الهيرو */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(var(--primary-rgb),0.03)_0,transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Fonctionnalités Principales
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Une suite d'outils puissants pour transformer votre espace de vie grâce à l'intelligence artificielle.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group bg-card rounded-[2rem] p-10 border border-border hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
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