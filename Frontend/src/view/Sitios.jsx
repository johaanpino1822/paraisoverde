// src/view/SitiosTuristicos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import SiteCard from "../components/SiteCard";

function SitiosTuristicos() {
  const [sitios, setSitios] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sites/public")
      .then((res) => setSitios(res.data))
      .catch((err) => console.error("Error al obtener sitios turísticos:", err));
  }, []);
    
  return (
    
    <div className="sitios-container mb-52 mt-56">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {sitios.map((sitio) => (
          <SiteCard 
            key={sitio._id}
            name={sitio.name}
            location={sitio.location}
            category={sitio.category}
            entranceFee={sitio.entranceFee}
            image={sitio.image}
            highlights={sitio.highlights}
          />
        ))} 
      </div>
     
      
      
     
    </div>
  );
}

export default SitiosTuristicos;

