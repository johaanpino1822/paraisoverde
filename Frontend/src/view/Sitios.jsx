// src/view/SitiosTuristicos.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../components/Footer";
import SiteCard from "../components/SiteCard";

function SitiosTuristicos() {
  const [sitios, setSitios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSitios = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/sites/public");
        console.log("Sitios recibidos:", response.data);
        setSitios(response.data);
      } catch (error) {
        console.error("Error al obtener sitios turísticos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSitios();
  }, []);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Cargando sitios turísticos...</div>
      </div>
    );
  }

  return (
    <div className="sitios-container mb-52 mt-56">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {sitios.map((sitio) => (
          <SiteCard 
            key={sitio._id}
            id={sitio._id}
            name={sitio.name}
            description={sitio.description}
            location={sitio.location}
            category={sitio.category}
            entranceFee={sitio.entranceFee}
            images={sitio.images} // ← Ahora es un array
            highlights={sitio.highlights}
          />
        ))}
      </div>
     
    </div>
  );
}

export default SitiosTuristicos;