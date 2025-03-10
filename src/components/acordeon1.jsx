import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";

// Datos de las imágenes
const images = [
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/portada-scaled-2.webp",
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/1611094927808182-scaled.webp",
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/colombia-and-experience.webp",
];

// Configuración del efecto creativo
const creativeEffect = {
  prev: {
    translate: [0, "-20%", 0],
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
  next: {
    translate: [0, "20%", 0],
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" },
  },
};

// Componente
const SlideshowComponent = () => {
  return (
    <div className="relative w-full h-[375px] md:h-[500px] overflow-hidden">
      {/* Swiper */}
      <Swiper
        modules={[EffectCreative, Autoplay]}
        effect="creative"
        creativeEffect={creativeEffect}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1500}
        loop
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${src})` }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white z-20 px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          Nuestros destinos
        </h2>
        <p className="text-lg md:text-xl max-w-2xl animate-fade-in-up delay-500">
          Bienvenido a un mundo de maravillas esperándote en cada rincón. Nuestros destinos
          turísticos te invitan a explorar la diversidad de paisajes, sumergirte en la cultura
          local y vivir experiencias auténticas. ¡Conócelos y deja que la aventura comience!
        </p>
      </div>
    </div>
  );
};

export default SlideshowComponent;