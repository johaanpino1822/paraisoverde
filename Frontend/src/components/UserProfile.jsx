import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Card, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaUserShield } from 'react-icons/fa';

const UserProfile = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <Container className="py-5">
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Mi Perfil</h3>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="d-flex align-items-center mb-4">
            <div className="bg-primary rounded-circle p-3 me-3">
              <FaUser size={24} className="text-white" />
            </div>
            <div>
              <h4 className="mb-1">{userInfo?.username}</h4>
              <span className="badge bg-secondary">
                <FaUserShield className="me-1" />
                {userInfo?.role}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <h5 className="d-flex align-items-center">
              <FaEnvelope className="me-2 text-primary" />
              Información de Contacto
            </h5>
            <hr />
            <p><strong>Email:</strong> {userInfo?.email}</p>
          </div>

          <div className="d-flex gap-2">
            <Button variant="primary">Editar Perfil</Button>
            <Button variant="outline-secondary">Cambiar Contraseña</Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserProfile;