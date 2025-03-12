import { useState } from "react";
import { Card, Button, Container, Row, Col, Form } from "react-bootstrap";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import "./Hoteles.css";

// Datos de ejemplo (puedes reemplazar con datos dinámicos)
const hotelesData = [
  { id: 1, nombre: "Hotel Paraíso", ubicacion: "Cancún, México", precio: 150, estrellas: 5, imagen: "/images/hotel1.jpg" },
  { id: 2, nombre: "Montaña Azul", ubicacion: "Suiza", precio: 200, estrellas: 4, imagen: "/images/hotel2.jpg" },
  { id: 3, nombre: "Playa Dorada", ubicacion: "Punta Cana", precio: 120, estrellas: 3, imagen: "/images/hotel3.jpg" },
  { id: 4, nombre: "Lujo Urbano", ubicacion: "Nueva York", precio: 250, estrellas: 5, imagen: "/images/hotel4.jpg" },
];

export default function Hoteles() {
  const [filtro, setFiltro] = useState("");

  // Filtra los hoteles según el precio o la categoría
  const hotelesFiltrados = hotelesData.filter((hotel) => 
    filtro === "" || hotel.precio <= filtro || hotel.estrellas.toString() === filtro
  );

  return (
    <Container className="hoteles-container py-5">
      <h2 className="text-center mb-4">🏨 Descubre Nuestros Hoteles</h2>

      {/* Filtro de Hoteles */}
      <Form className="mb-4 d-flex justify-content-center">
        <Form.Select className="filtro-select" onChange={(e) => setFiltro(e.target.value)}>
          <option value="">Filtrar por...</option>
          <option value="100">Menos de $100</option>
          <option value="150">Menos de $150</option>
          <option value="200">Menos de $200</option>
          <option value="3">3 Estrellas</option>
          <option value="4">4 Estrellas</option>
          <option value="5">5 Estrellas</option>
        </Form.Select>
      </Form>

      <Row>
        {hotelesFiltrados.map((hotel) => (
          <Col key={hotel.id} md={6} lg={4} className="mb-4">
            <Card className="hotel-card shadow-sm">
              <Card.Img variant="top" src={hotel.imagen} className="hotel-img" />
              <Card.Body>
                <Card.Title className="hotel-title">{hotel.nombre}</Card.Title>
                <Card.Text className="text-muted">
                  <FaMapMarkerAlt /> {hotel.ubicacion}
                </Card.Text>
                <Card.Text>
                  <strong>${hotel.precio} / noche</strong>
                </Card.Text>
                <div className="hotel-stars">
                  {[...Array(hotel.estrellas)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                </div>
                <Button variant="primary" className="hotel-btn">Ver Detalles</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
