import { useState } from "react";
import { Container, Row, Col, Form, Card, Badge } from "react-bootstrap";
import { FaStar, FaMapMarkerAlt, FaHotel, FaHeart, FaRegHeart } from "react-icons/fa";
import "./Hoteles.css";

// Import images
import HotelParaiso from "../image/Hotel.jpg";
import MontanaAzul from "../image/Hotel.jpg";
import PlayaDorada from "../image/Hotel.jpg";
import LujoUrbano from "../image/Hotel.jpg";

// Constants
const FILTER_OPTIONS = [
  { value: "", label: "Filtrar por..." },
  { value: "100", label: "Menos de $100" },
  { value: "150", label: "Menos de $150" },
  { value: "200", label: "Menos de $200" },
  { value: "3", label: "3 Estrellas" },
  { value: "4", label: "4 Estrellas" },
  { value: "5", label: "5 Estrellas" },
];

const SAMPLE_HOTELS = [
  { 
    id: 1, 
    nombre: "Hotel Paraíso", 
    ubicacion: "Cancún, México", 
    precio: 150, 
    estrellas: 5, 
    imagen: HotelParaiso,
    destacado: true
  },
  { 
    id: 2, 
    nombre: "Montaña Azul", 
    ubicacion: "Suiza", 
    precio: 200, 
    estrellas: 4, 
    imagen: MontanaAzul 
  },
  { 
    id: 3, 
    nombre: "Playa Dorada", 
    ubicacion: "Punta Cana", 
    precio: 120, 
    estrellas: 3, 
    imagen: PlayaDorada,
    destacado: true
  },
  { 
    id: 4, 
    nombre: "Lujo Urbano", 
    ubicacion: "Nueva York", 
    precio: 250, 
    estrellas: 5, 
    imagen: LujoUrbano 
  },
];

const HotelCard = ({ hotel }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className="hotel-card">
      <div className="hotel-image-container">
        <Card.Img 
          variant="top" 
          src={hotel.imagen} 
          alt={`Imagen de ${hotel.nombre}`} 
          className="hotel-image"
          loading="lazy"
        />
        {hotel.destacado && (
          <Badge pill bg="warning" text="dark" className="hotel-badge">
            Destacado
          </Badge>
        )}
        <button 
          className="favorite-btn"
          onClick={() => setIsFavorite(!isFavorite)}
          aria-label={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          {isFavorite ? (
            <FaHeart className="text-danger" />
          ) : (
            <FaRegHeart className="text-white" />
          )}
        </button>
        <div className="rating-badge">
          {Array.from({ length: hotel.estrellas }).map((_, i) => (
            <FaStar key={i} className="star-icon" />
          ))}
        </div>
      </div>
      
      <Card.Body>
        <Card.Title className="hotel-name">{hotel.nombre}</Card.Title>
        <Card.Text className="hotel-location">
          <FaMapMarkerAlt className="me-2" />
          {hotel.ubicacion}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="hotel-price">${hotel.precio}</span>
            <span className="price-period"> /noche</span>
          </div>
          <button 
            className="btn btn-primary btn-sm hotel-btn"
            aria-label={`Ver detalles de ${hotel.nombre}`}
          >
            Ver detalles
          </button>
        </div>
      </Card.Body>
    </Card>
  );
};

const FilterSelect = ({ value, onChange }) => (
  <Form.Select
    className="filter-select"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    aria-label="Filtrar hoteles"
  >
    {FILTER_OPTIONS.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Form.Select>
);

export default function Hoteles() {
  const [filter, setFilter] = useState("");

  const filteredHotels = SAMPLE_HOTELS.filter((hotel) => {
    if (!filter) return true;
    const filterValue = parseInt(filter);
    return ["100", "150", "200"].includes(filter) 
      ? hotel.precio <= filterValue 
      : hotel.estrellas === filterValue;
  });

  return (
    <Container className="hotel-listing-container py-5">
      <header className="text-center mb-5">
        <FaHotel size={48} className="mb-3 text-primary" />
        <h1 className="display-5 fw-bold">Descubre Nuestros Hoteles</h1>
        <p className="lead text-muted">Encuentra el alojamiento perfecto para tu próximo viaje</p>
      </header>

      <Row className="justify-content-center mb-5">
        <Col md={8} lg={6}>
          <FilterSelect value={filter} onChange={setFilter} />
        </Col>
      </Row>

      {filteredHotels.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredHotels.map((hotel) => (
            <Col key={hotel.id}>
              <HotelCard hotel={hotel} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col md={8} className="text-center py-5">
            <h4 className="mb-3">No se encontraron hoteles con los filtros seleccionados</h4>
            <button 
              className="btn btn-outline-primary"
              onClick={() => setFilter("")}
            >
              Limpiar filtros
            </button>
          </Col>
        </Row>
      )}
    </Container>
  );
}