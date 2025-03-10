import React from 'react';
import image1 from '../image/paramo3.jpg';
import image2 from '../image/paisaje.jpg';
import paramo2 from '../image/paramo2.jpg';

function CardGroup() {
  return (
    <div className="container mt-5">
    <h2 className="text-center mb-4 fw-bold">Explora Nuestros Paisajes</h2>
    <div className="row g-4">
      {/* Tarjeta 1 */}
      <div className="col-md-4">
        <div className="card border-0 shadow-lg rounded">
          <img src={image1} className="card-img-top rounded-top" alt="Páramo" />
          <div className="card-body">
            <h5 className="card-title fw-bold">Páramo</h5>
            <p className="card-text">
              Descubre la majestuosidad del páramo, un ecosistema único lleno de vida y misterio.
            </p>
            <p className="text-muted small">Última actualización: hace 3 minutos</p>
            <button className="btn btn-custom w-100">Ver más</button>
          </div>
        </div>
      </div>
  
      {/* Tarjeta 2 */}
      <div className="col-md-4">
        <div className="card border-0 shadow-lg rounded">
          <img src={image2} className="card-img-top rounded-top" alt="Imagen 2" />
          <div className="card-body">
            <h5 className="card-title fw-bold">Aventura Natural</h5>
            <p className="card-text">
              Vive una experiencia inolvidable rodeado de paisajes impresionantes y biodiversidad.
            </p>
            <p className="text-muted small">Última actualización: hace 3 minutos</p>
            <button className="btn btn-custom w-100">Ver más</button>
          </div>
        </div>
      </div>
  
      {/* Tarjeta 3 */}
      <div className="col-md-4">
        <div className="card border-0 shadow-lg rounded">
          <img src={paramo2} className="card-img-top rounded-top" alt="Reserva Natural" />
          <div className="card-body">
            <h5 className="card-title fw-bold">Reserva Natural</h5>
            <p className="card-text">
              Explora reservas naturales y sumérgete en la tranquilidad de la naturaleza.
            </p>
            <p className="text-muted small">Última actualización: hace 3 minutos</p>
            <button className="btn btn-custom w-100">Ver más</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default CardGroup;
