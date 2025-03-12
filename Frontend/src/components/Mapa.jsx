import React from "react";
import styled from "styled-components";

// Estilos con Styled Components
const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #007bff, #0056b3);
  color: #ffffff;
  padding: 1.5rem;
  text-align: center;
`;

const Title = styled.h3`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.9;
`;

const IframeContainer = styled.div`
  position: relative;
  padding-top: 56.25%; /* Relación de aspecto 16:9 */
  overflow: hidden;
`;

const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  transition: transform 0.3s ease-in-out;

  ${Card}:hover & {
    transform: scale(1.02);
  }
`;

const Actions = styled.div`
  padding: 1.5rem;
  text-align: center;
`;

const Button = styled.a`
  display: inline-block;
  background: #28a745;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s ease-in-out, transform 0.3s ease-in-out;

  &:hover {
    background: #218838;
    transform: translateY(-3px);
  }
`;

// Componente Mapa
const Mapa = () => {
  return (
    <Container>
      <Card>
        {/* Encabezado */}
        <Header>
          <Title>Ubicación - San José de La Montaña, Antioquia</Title>
          <Subtitle>Explora nuestra ubicación en el mapa</Subtitle>
        </Header>

        {/* Mapa */}
        <IframeContainer>
          <Iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7922.680624167005!2d-75.6892409140859!3d6.849747074898346!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e445513ea555fa1%3A0x3e8cc58fbd36d772!2sSan%20Jos%C3%A9%20de+La%20Monta%C3%B1a,%20Antioquia!5e0!3m2!1ses!2sco!4v1731459082801!5m2!1ses!2sco"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map"
          />
        </IframeContainer>

        {/* Botón de acción */}
        <Actions>
          <Button
            href="https://www.google.com/maps/dir//San+José+de+La+Montaña,+Antioquia/@6.8497471,-75.6892409,14z/data=!4m8!4m7!1m0!1m5!1m1!1s0x8e445513ea555fa1:0x3e8cc58fbd36d772!2m2!1d-75.6717324!2d6.8497471?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
          >
            Obtener Direcciones
          </Button>
        </Actions>
      </Card>
    </Container>
  );
};

export default Mapa;