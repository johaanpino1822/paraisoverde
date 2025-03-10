import React from "react";
import styled from "styled-components";
import "swiper/css";
import "swiper/css/effect-creative"; // Importar el módulo EffectCreative
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCreative, Autoplay } from "swiper/modules";

// Estilos con Styled Components
const SlideshowContainer = styled.section`
  position: relative;
  width: 100%;
  height: 375px;
  overflow: hidden;
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

const Content = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  z-index: 2;
  width: 90%;
  max-width: 800px;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  animation: fadeIn 2s ease-in-out; /* Animación más lenta */

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Description = styled.p`
  font-size: 1.25rem;
  line-height: 1.6;
  animation: fadeIn 2.5s ease-in-out; /* Animación más lenta */

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const SlideImage = styled.div`
  width: 100%;
  height: 375px;
  background-size: cover;
  background-position: center;
  transition: opacity 1.5s ease-in-out; /* Transición más lenta */
`;

// Animación de entrada
const fadeIn = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Datos de las imágenes
const images = [
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/portada-scaled-2.webp",
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/1611094927808182-scaled.webp",
  "https://arranquemospues.com.co/wp-content/uploads/2024/01/colombia-and-experience.webp",
];

// Configuración del efecto creativo (transición vertical suave)
const creativeEffect = {
  prev: {
    translate: [0, "-20%", 0], // Desplazamiento hacia arriba más corto
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" }, // Transición más lenta
  },
  next: {
    translate: [0, "20%", 0], // Desplazamiento hacia abajo más corto
    opacity: 0,
    transition: { duration: 1.5, ease: "easeInOut" }, // Transición más lenta
  },
};

// Componente
const SlideshowComponent = () => {
  return (
    <SlideshowContainer>
      <style>{fadeIn}</style> {/* Inyectar la animación */}
      <Swiper
        modules={[EffectCreative, Autoplay]}
        effect="creative"
        creativeEffect={creativeEffect}
        autoplay={{ delay: 5000, disableOnInteraction: false }} // Delay más largo (5 segundos)
        speed={1500} // Velocidad de la transición más lenta (1.5 segundos)
        loop
        className="w-full h-full"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <SlideImage style={{ backgroundImage: `url(${src})` }} />
          </SwiperSlide>
        ))}
      </Swiper>
      <Overlay />
      <Content>
        <Title>Nuestros destinos</Title>
        <Description>
          Bienvenido a un mundo de maravillas esperándote en cada rincón. Nuestros destinos
          turísticos te invitan a explorar la diversidad de paisajes, sumergirte en la cultura
          local y vivir experiencias auténticas. ¡Conócelos y deja que la aventura comience!
        </Description>
      </Content>
    </SlideshowContainer>
  );
};

export default SlideshowComponent;