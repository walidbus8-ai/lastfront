import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import HomeSlider from "../components/HomeSlider";
import ColorPalette from '../components/ColorPalette';

const Dashboard = () => {
  const [userName, setUserName] = useState("Utilisateur");
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUserName(user.nom || "Client");
      } catch (e) {
        console.error("Erreur de parsing", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      
      {/* --- إضافة السلايدر هنا الفوق --- */}
      <div className="w-full max-w-4xl mb-6"> 
         <HomeSlider />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 text-center border border-slate-100"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <span className="text-4xl">👋</span>
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Bienvenue, {userName} !
        </h1>
        <p className="text-slate-500 mb-8 leading-relaxed">
          Votre compte RoomAI est actif. Vous avez maintenant accès à toutes nos fonctionnalités immobilières.
        </p>

        <div className="space-y-4">
          <div className="p-4 bg-green-50/50 rounded-xl border border-green-100 text-left">
            <span className="text-xs font-bold uppercase text-green-600 tracking-wider">Statut</span>
            <p className="text-green-700 font-semibold text-sm">Session sécurisée et active</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full py-6 rounded-xl border-slate-200 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all duration-300"
            onClick={handleLogout}
          >
            Se déconnecter
          </Button>
        </div>
      </motion.div>

      <footer className="mt-8 text-slate-400 text-xs tracking-widest uppercase">
        RoomAI &copy; 2026 - Intelligence Immobilière
      </footer>
    </div>
  );
};

export default Dashboard;