import React from 'react';
import image1 from '../image/paramo3.jpg';
import image2 from '../image/paisaje.jpg';
import paramo2 from '../image/paramo2.jpg';
import Card6 from '../image/Card6.jpg'
import Card5 from '../image/Card5.jpg'

function CardGroup() {
  return (   
    <div className="container mx-auto px-4 py-12">
      {/* Título */}
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
        Explora Nuestros Paisajes
      </h2>

      {/* Contenedor de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Tarjeta 1 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={image1}
            alt="Páramo"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Páramo</h3>
            <p className="text-gray-600 mb-4">
              Descubre la majestuosidad del páramo, un ecosistema único lleno de vida y misterio.
            </p>
            
            
          </div>
        </div>

        {/* Tarjeta 2 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={image2}
            alt="Aventura Natural"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Aventura Natural</h3>
            <p className="text-gray-600 mb-4">
              Vive una experiencia inolvidable rodeado de paisajes impresionantes y biodiversidad.
            </p>
            
           
          </div>
        </div>

        {/* Tarjeta 3 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={paramo2}
            alt="Reserva Natural"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Reserva Natural</h3>
            <p className="text-gray-600 mb-4">
              Explora reservas naturales y sumérgete en la tranquilidad de la naturaleza.
            </p>
            
           

           
          </div>
          
        </div>
      </div>
       {/* Contenedor de tarjetas */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Tarjeta 4 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={image1}
            alt="Páramo"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">El valle de los Osos</h3>
            <p className="text-gray-600 mb-4">
              Descubre la majestuosidad del páramo, un ecosistema único lleno de vida y misterio.
            </p>
            
            
          </div>
        </div>

        {/* Tarjeta 5 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={Card5}
            alt="Aventura Natural"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">El bosque de niebla</h3>
            <p className="text-gray-600 mb-4">
              Vive una experiencia inolvidable rodeado de paisajes impresionantes y biodiversidad.
            </p>
            
           
          </div>
        </div>

        {/* Tarjeta 6 */}
        <div className="group relative overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <img
            src={Card6}
            alt="Reserva Natural"
            className="w-full h-64 object-cover transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="p-6 bg-white">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">El chorro del Aguila</h3>
            <p className="text-gray-600 mb-4">
              Explora reservas naturales y sumérgete en la tranquilidad de la naturaleza.
            </p>
            
           

           
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default CardGroup;