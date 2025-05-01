import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "../css/Carrousel.css"; // Archivo CSS mejorado
import Carrousel1 from "../image/carrousel1.jpg";
import Carrousel2 from "../image/carrousel2.jpg";
import Carrousel4 from "../image/carrousel333.jpg";

const Carrousel = () => {
  return (
    <div className="carousel-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        effect="fade"
        className="custom-swiper"
      >
        <SwiperSlide>
          <div className="slide">
            <img src={Carrousel1} alt="Descubre Lugares Únicos" className="carousel-image" />
            <div className="carousel-overlay">
              <h2>Descubre Lugares Únicos</h2>
              <p>Explora los mejores destinos turísticos con nosotros.</p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={Carrousel2} alt="Aventuras Increíbles" className="carousel-image" />
            <div className="carousel-overlay">
              <h2>Aventuras Increíbles</h2>
              <p>Vive experiencias inolvidables en cada destino.</p>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="slide">
            <img src={Carrousel4} alt="Viaja con Estilo" className="carousel-image" />
            <div className="carousel-overlay">
              <h2>Viaja con Estilo</h2>
              <p>Encuentra los mejores hoteles y servicios exclusivos.</p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Carrousel;