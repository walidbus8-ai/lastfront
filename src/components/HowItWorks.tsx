import { motion } from "framer-motion";
import { Camera, Cpu, Smartphone } from "lucide-react";

const steps = [
  {
    icon: Camera,
    step: "01",
    title: "Prenez une photo",
    description: "Capturez votre pièce sous n'importe quel angle avec votre smartphone.",
  },
  {
    icon: Cpu,
    step: "02",
    title: "L'IA génère le design",
    description: "Notre algorithme analyse et crée plusieurs propositions de design adaptées.",
  },
  {
    icon: Smartphone,
    step: "03",
    title: "Visualisez en AR",
    description: "Explorez le résultat en réalité augmentée et choisissez votre préféré.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Trois étapes simples pour transformer votre intérieur.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="relative mx-auto mb-6">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
