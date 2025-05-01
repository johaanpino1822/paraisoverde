import React from "react";
import { motion } from "framer-motion";
import About1 from "../image/Hotel.jpg";


const AboutSection = () => {
  return (
    <div className="w-full py-16 bg-gradient-to-r from-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Contenedor principal */}
      <motion.div
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Imagen */}
          <motion.div
            className="w-full lg:w-1/2 h-[500px] relative overflow-hidden rounded-3xl shadow-2xl"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img src={About1} alt="Aventuras Increíbles" className="carousel-image" />
            <div className="absolute inset-0 bg-black/20 rounded-3xl" />
          </motion.div>

          {/* Texto y contenido */}
          <div className="w-full lg:w-1/2 space-y-6">
            <motion.div
              className="bg-white p-8 rounded-3xl shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Subtítulo */}
              <motion.h6
                className="text-lg font-semibold text-blue-600 uppercase tracking-widest"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                About Us
              </motion.h6>

              {/* Título */}
              <motion.h1
                className="text-4xl font-bold text-gray-900 mt-4"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We Provide the Best Tour Packages in Your Budget
              </motion.h1>

              {/* Descripción */}
              <motion.p
                className="text-gray-600 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Experience unforgettable adventures with our carefully curated tour packages.
                Explore breathtaking destinations, enjoy premium services, and create memories
                that last a lifetime.
              </motion.p>

              {/* Galería de imágenes */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <motion.div
                  className="relative h-40 rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                   <img src={About1} alt="Aventuras Increíbles" className="carousel-image" />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
                <motion.div
                  className="relative h-40 rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={About1} alt="Aventuras Increíbles" className="carousel-image" />
                  <div className="absolute inset-0 bg-black/20" />
                </motion.div>
              </div>

              {/* Botón */}
              <motion.div
                className="mt-6"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all">
                  Book Now
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutSection;