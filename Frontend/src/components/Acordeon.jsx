import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import PropTypes from "prop-types";

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Estilos con Styled Components
const Card = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin: 20px;
  background: ${({ theme }) => theme.cardBackground || "#fff"};
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-10px) rotate(${({ tilt }) => tilt || 0}deg);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.18);
  }

  ${({ glow }) => glow && css`
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 18px;
      box-shadow: 0 0 20px ${glow};
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::after {
      opacity: 0.7;
    }
  `}

  @media (max-width: 768px) {
    max-width: 100%;
    margin: 15px 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease, filter 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.1);
    ${({ grayscaleOnHover }) => grayscaleOnHover && "filter: grayscale(80%);"}
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ overlayGradient }) => 
    overlayGradient || "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7))"};
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  opacity: ${({ alwaysVisible }) => alwaysVisible ? 1 : 0};
  transition: opacity 0.4s ease, background 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
  }
`;

const ContentWrapper = styled.div`
  transform: translateY(${({ alwaysVisible }) => alwaysVisible ? "0" : "20px"});
  transition: transform 0.4s ease;
  width: 100%;

  ${Card}:hover & {
    transform: translateY(0);
  }
`;

const Title = styled.h3`
  font-size: 1.6rem;
  margin-bottom: 0.8rem;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
  color: ${({ titleColor }) => titleColor || "#fff"};
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
  color: ${({ descriptionColor }) => descriptionColor || "rgba(255,255,255,0.9)"};
`;

const Button = styled.button`
  background: ${({ buttonColor }) => buttonColor || "#ff6b6b"};
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 30px;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: ${({ buttonColor }) => darkenColor(buttonColor, 0.15) || "#ff4757"};
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.25);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%);
    transform-origin: 50% 50%;
  }
  
  &:focus:not(:active)::after {
    animation: ${pulse} 0.5s ease-out;
  }

  @media (max-width: 768px) {
    padding: 0.6rem 1.2rem;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 15px;
  right: 15px;
  background: ${({ badgeColor }) => badgeColor || "#ff4757"};
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  z-index: 2;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
`;

// Función para oscurecer el color del botón
const darkenColor = (color, percentage) => {
  if (!color) return "#ff4757";
  
  let colorHex = color.replace('#', '');
  if (colorHex.length === 3) {
    colorHex = colorHex.split('').map(c => c + c).join('');
  }
  
  let r = parseInt(colorHex.substring(0, 2), 16);
  let g = parseInt(colorHex.substring(2, 4), 16);
  let b = parseInt(colorHex.substring(4, 6), 16);
  
  r = Math.max(0, Math.floor(r * (1 - percentage)));
  g = Math.max(0, Math.floor(g * (1 - percentage)));
  b = Math.max(0, Math.floor(b * (1 - percentage)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

const SiteCard = React.memo(({ 
  image, 
  title, 
  description, 
  buttonText, 
  buttonColor, 
  altText,
  badgeText,
  badgeColor,
  tilt = 2,
  glow,
  alwaysVisible = false,
  grayscaleOnHover = false,
  overlayGradient,
  titleColor,
  descriptionColor,
  onClick
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Card 
      tilt={tilt} 
      glow={glow}
      aria-label={`Card for ${title}`}
      onClick={onClick}
      role="article"
    >
      {badgeText && <Badge badgeColor={badgeColor}>{badgeText}</Badge>}
      <ImageContainer>
        <Image 
          src={image} 
          alt={altText || title} 
          loading="lazy"
          grayscaleOnHover={grayscaleOnHover}
        />
      </ImageContainer>
      <Overlay 
        overlayGradient={overlayGradient}
        alwaysVisible={alwaysVisible}
      >
        <ContentWrapper alwaysVisible={alwaysVisible}>
          <Title titleColor={titleColor}>{title}</Title>
          <Description descriptionColor={descriptionColor}>
            {description}
          </Description>
          {buttonText && (
            <Button 
              buttonColor={buttonColor}
              aria-label={buttonText}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onMouseLeave={() => setIsPressed(false)}
              pressed={isPressed}
            >
              {buttonText}
            </Button>
          )}
        </ContentWrapper>
      </Overlay>
    </Card>
  );
});

SiteCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  buttonColor: PropTypes.string,
  altText: PropTypes.string,
  badgeText: PropTypes.string,
  badgeColor: PropTypes.string,
  tilt: PropTypes.number,
  glow: PropTypes.string,
  alwaysVisible: PropTypes.bool,
  grayscaleOnHover: PropTypes.bool,
  overlayGradient: PropTypes.string,
  titleColor: PropTypes.string,
  descriptionColor: PropTypes.string,
  onClick: PropTypes.func,
};

SiteCard.defaultProps = {
  description: "",
  buttonText: "View More",
  buttonColor: "#ff6b6b",
  alwaysVisible: false,
  grayscaleOnHover: false,
  tilt: 2,
};

export default SiteCard;