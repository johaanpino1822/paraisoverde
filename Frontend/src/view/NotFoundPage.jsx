import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <p className="fs-3"> 
          <span className="text-danger">Oops!</span> Página no encontrada
        </p>
        <p className="lead">
          La página que estás buscando no existe.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Button variant="primary" onClick={() => navigate(-1)}>
            <FaArrowLeft className="me-2" /> Volver
          </Button>
          <Button variant="outline-primary" onClick={() => navigate('/')}>
            <FaHome className="me-2" /> Ir al Inicio
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFoundPage;