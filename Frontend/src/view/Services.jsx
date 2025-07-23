import React, { useEffect, useState } from "react";
import axios from "axios";

import Footer from "../components/Footer";
import Hotescard from "../components/HotelCard";

function Hoteles() {
  const [hoteles, setHoteles] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/hotels/public")
 // Cambia por tu URL real si usas dominio
      .then((res) => {
        setHoteles(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener los hoteles:", err);
      });
  }, []);

  return (
    <div className="hoteles-container">
      <div className="hotel-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
        {hoteles.map((hotel) => (
          <Hotescard
            key={hotel._id}
            name={hotel.name}
            location={hotel.location}
            price={hotel.priceRange}
            image={hotel.image} // base64 o URL
            amenities={hotel.amenities} // asegúrate que sea array
          />
        ))}
      </div>
      <Footer />
    </div>
  );
}

export default Hoteles;
