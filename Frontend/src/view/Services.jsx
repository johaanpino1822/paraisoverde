import React, { useEffect, useState } from "react";
import axios from "axios";

import Footer from "../components/Footer";
import Hotescard from "../components/HotelCard";

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/hotels/public")
      .then((res) => {
        console.log("=== DEBUG HOTELES ===");
        
        const hotelesConImagenes = res.data.map(hotel => {
          let imageUrl = null;
          
          if (hotel.images && hotel.images.length > 0) {
            const primeraImagen = hotel.images[0];
            
            console.log('Imagen objeto:', primeraImagen);
            
            // Si es un objeto con propiedad path
            if (typeof primeraImagen === 'object' && primeraImagen.path) {
              // ✅ USAR EL BACKEND (puerto 5000) para servir imágenes
              imageUrl = `http://localhost:5000${primeraImagen.path}`;
            } 
            // Si es un string
            else if (typeof primeraImagen === 'string') {
              imageUrl = `http://localhost:5000/uploads/hotels/${primeraImagen}`;
            }
          }
          
          console.log(`Hotel: ${hotel.name}`);
          console.log('URL de imagen:', imageUrl);
          console.log('---');
          
          return {
            ...hotel,
            imageUrl: imageUrl || 'http://localhost:5000/img/default.jpg'
          };
        });
        
        console.log("=== FIN DEBUG ===");
        setHoteles(hotelesConImagenes);
      })
      .catch((err) => {
        console.error("Error al obtener los hoteles:", err);
      });
  }, []);

  return (
    <div className="hoteles-container mt-20">
      <div className="hotel-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {hoteles.map((hotel) => (
          <Hotescard
            key={hotel._id}
            name={hotel.name}
            location={hotel.location}
            price={hotel.priceRange}
            image={hotel.imageUrl}
            amenities={hotel.amenities}
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Hoteles;