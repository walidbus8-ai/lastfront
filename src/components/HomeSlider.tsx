import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const HomeSlider = () => {
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000",
      title: "Design Intérieur IA",
      desc: "Transformez vos pièces en un clic."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1616489953149-80413554625b?q=80&w=2000",
      title: "Styles Modernes",
      desc: "Choisissez parmi des dizaines de styles photoréalistes."
    }
  ];

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg mb-8">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        className="h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="relative h-full w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* Overlay لزيادة وضوح النص */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-12 text-white">
                <h2 className="text-4xl font-bold mb-4 animate-fade-in">{slide.title}</h2>
                <p className="text-lg opacity-90 max-w-md">{slide.desc}</p>
                <button className="mt-6 bg-[#4A725D] hover:bg-[#3d5e4d] text-white px-6 py-2 rounded-full w-fit transition-all">
                  Commencer
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeSlider;