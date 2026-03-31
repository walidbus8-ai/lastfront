import InteriorDesignPanel from "@/components/InteriorDesignPanel";
import Navbar from "@/components/Navbar";
import Footer from '@/components/Footer';
import Chatbot from "@/components/Chatbot";
import HomeSlider from '../components/HomeSlider';
function Dashboard() {
  return (
    <div>
       
         <InteriorDesignPanel/> 
         <Chatbot/>
       
      <Footer/>
    </div>
  );
}
export default Dashboard;