import React from "react";
import { motion } from "framer-motion";


const AboutSection = () => {
  return (
    <div className="container-fluid py-5 bg-light position-relative">
      <motion.div
        className="container pt-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="row align-items-center">
          <div className="col-lg-6" style={{ minHeight: "500px" }}>
            <motion.div
              className="position-relative h-100 overflow-hidden rounded-3 shadow-lg"
              whileHover={{ scale: 1.05 }}
            >
              <img
                className="position-absolute w-100 h-100"
                src="src\image\carrousel1.jpg"
                alt="About Us"
                style={{ objectFit: "cover", borderRadius: "15px" }}
              />
            </motion.div>
          </div>
          <div className="col-lg-6 pt-5 pb-lg-5">
            <motion.div 
              className="about-text bg-white p-4 p-lg-5 my-lg-5 shadow-lg rounded-3 position-relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h6 
                className="text-primary text-uppercase" 
                style={{ letterSpacing: "5px" }}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                About Us
              </motion.h6>
              <motion.h1 
                className="mb-3 fw-bold text-dark"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                We Provide Best Tour Packages In Your Budget
              </motion.h1>
              <motion.p 
                className="text-muted"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Experience unforgettable adventures with our carefully curated tour packages.
                Explore breathtaking destinations, enjoy premium services, and create memories 
                that last a lifetime.
              </motion.p>
              <div className="row mb-4">
                <div className="col-6">
                  <motion.img 
                    className="img-fluid rounded-3 shadow-lg"
                    src="/image/carrousel1.jpg"
                    alt="Tour Package 1" 
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
                <div className="col-6">
                  <motion.img 
                    className="img-fluid rounded-3 shadow-lg"
                    src="/image/carrousel1.jpg" 
                    alt="Tour Package 2" 
                    whileHover={{ scale: 1.1 }}
                  />
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.1 }}>
                <button className="btn btn-primary btn-lg mt-1 shadow">
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