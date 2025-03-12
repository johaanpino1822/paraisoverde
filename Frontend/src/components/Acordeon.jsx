import React from "react";
import styled from "styled-components";

// Estilos con Styled Components
const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  margin-top:100px;

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 10px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease-in-out;

  ${Card}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  background: ${({ buttonColor }) => buttonColor || "#ff6b6b"};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: ${({ buttonColor }) => buttonColor ? darkenColor(buttonColor, 0.1) : "#ff4757"};
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
  }
`;

// Función para oscurecer el color del botón
const darkenColor = (color, percentage) => {
  let colorHex = color.replace('#', '');
  let r = parseInt(colorHex.substring(0, 2), 16);
  let g = parseInt(colorHex.substring(2, 4), 16);
  let b = parseInt(colorHex.substring(4, 6), 16);
  
  r = Math.floor(r * (1 - percentage));
  g = Math.floor(g * (1 - percentage));
  b = Math.floor(b * (1 - percentage));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const SiteCard = React.memo(({ image, title, description, buttonText, buttonColor, altText }) => {
  return (
    <Card>
      <Image src={image} alt={altText || title} />
      <Overlay>
        <Title>{title}</Title>
        <Description>{description}</Description>
        <Button buttonColor={buttonColor}>{buttonText}</Button>
      </Overlay>
    </Card>
  );
});

export default SiteCard;
