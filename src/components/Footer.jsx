import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css"; // Archivo de estilos mejorado

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          {/* Sección 1 - Soluciones */}
          <div className="col-md-4">
            <h5>🌿 Soluciones</h5>
            <ul className="footer-list">
              <li><a href="#">Turismo ecológico</a></li>
              <li><a href="#">Rutas de aventura</a></li>
              <li><a href="#">Guías personalizados</a></li>
            </ul>
          </div>

          {/* Sección 2 - Soporte */}
          <div className="col-md-4">
            <h5>💡 Soporte</h5>
            <ul className="footer-list">
              <li><a href="#">Centro de ayuda</a></li>
              <li><a href="#">Términos y condiciones</a></li>
              <li><a href="#">Política de privacidad</a></li>
            </ul>
          </div>

          {/* Sección 3 - Suscripción */}
          <div className="col-md-4">
            <h5>📩 Suscríbete</h5>
            <p>Recibe las últimas novedades y ofertas exclusivas.</p>
            <form className="subscribe-form">
              <input type="email" placeholder="Tu correo" required />
              <button type="submit">Suscribirse</button>
            </form>
            {/* Redes sociales */}
            <div className="social-icons">
              <a href="#" className="social-btn facebook"><FontAwesomeIcon icon={faFacebook} /></a>
              <a href="#" className="social-btn twitter"><FontAwesomeIcon icon={faTwitter} /></a>
              <a href="#" className="social-btn instagram"><FontAwesomeIcon icon={faInstagram} /></a>
              <a href="#" className="social-btn linkedin"><FontAwesomeIcon icon={faLinkedin} /></a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <hr />

        {/* Derechos reservados */}
        <div className="footer-bottom">
          <p>&copy; 2024 Paraiso Verde. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
