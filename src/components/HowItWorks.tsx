import { motion } from "framer-motion";
import { Camera, Cpu, CheckCircle2 } from "lucide-react"; // حيدنا Smartphone وزدنا CheckCircle2

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
    icon: CheckCircle2, // الـ Icon الجديدة
    step: "03",
    title: "Visualisez le résultat", // العنوان الجديد بلا AR
    description: "Explorez les rendus professionnels en HD et choisissez votre design préféré.", // الوصف الجديد
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Trois étapes simples pour transformer votre intérieur grâce à notre IA.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="text-center group"
            >
              <div className="relative mx-auto mb-8">
                {/* الدائرة الكبيرة اللي فيها الـ Icon */}
                <div className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300 border border-primary/5">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                {/* الدائرة الصغيرة اللي فيها الرقم */}
                <span className="absolute -top-3 right-[30%] w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-extrabold flex items-center justify-center shadow-lg border-4 border-background">
                  {step.step}
                </span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                {step.title}
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;