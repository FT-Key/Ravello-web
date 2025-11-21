import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Award,
  Clock,
  CreditCard,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const destinations = [
    "Europa",
    "América",
    "Asia",
    "Caribe",
    "África",
    "Oceanía",
  ];
  const services = [
    "Paquetes turísticos",
    "Vuelos",
    "Hoteles",
    "Traslados",
    "Seguros",
    "Visa y documentación",
  ];
  const company = [
    "Sobre Ravello",
    "Trabaja con nosotros",
    "Prensa",
    "Blog de viajes",
    "Términos y condiciones",
    "Política de privacidad",
  ];

  return (
    <footer className="bg-gradient-to-br from-blue-600 via-blue-800 to-blue-600 text-white">
      {/* Wave superior */}
      <div className="relative">
        <svg
          className="w-full h-16"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: "scaleY(-1)" }}
        >
          <path
            d="M0,0 C300,80 600,80 900,40 C1050,20 1150,0 1200,0 L1200,120 L0,120 Z"
            fill="var(--background)"
          />
        </svg>
      </div>

      {/* Confianza y seguridad */}
      <div className="border-b border-white border-opacity-20 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <Shield size={32} className="mb-2 text-cyan-400" />
              <h4 className="font-semibold mb-1">Compra Segura</h4>
              <p className="text-sm opacity-80">Certificado SSL</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Award size={32} className="mb-2 text-cyan-400" />
              <h4 className="font-semibold mb-1">+15 años</h4>
              <p className="text-sm opacity-80">De experiencia</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Clock size={32} className="mb-2 text-cyan-400" />
              <h4 className="font-semibold mb-1">Atención 24/7</h4>
              <p className="text-sm opacity-80">Siempre disponibles</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <CreditCard size={32} className="mb-2 text-cyan-400" />
              <h4 className="font-semibold mb-1">Financiación</h4>
              <p className="text-sm opacity-80">Hasta 12 cuotas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enlaces principales */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Columna 1: Logo y descripción */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/ravello-mini-logo.svg"
                  alt="Logo"
                  className="w-11 h-11"
                />
                <h3 className="text-2xl font-bold">Ravello</h3>
              </div>
              <p className="text-sm opacity-90 leading-relaxed mb-4">
                Agencia de viajes con más de 15 años conectando personas con sus
                destinos soñados. Experiencia, confianza y las mejores ofertas
                del mercado.
              </p>

              {/* Redes sociales */}
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} color="black" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all hover:scale-110"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} color="black" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter size={20} color="black" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={20} color="black" />
                </a>
              </div>
            </div>

            {/* Columna 2: Destinos */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative inline-block">
                Destinos
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
              </h4>
              <ul className="space-y-2">
                {destinations.map((dest, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-sm opacity-90 hover:opacity-100 hover:text-cyan-400 transition-all inline-block hover:translate-x-1"
                    >
                      {dest}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Servicios */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative inline-block">
                Servicios
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
              </h4>
              <ul className="space-y-2">
                {services.map((service, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-sm opacity-90 hover:opacity-100 hover:text-cyan-400 transition-all inline-block hover:translate-x-1"
                    >
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 4: Empresa */}
            <div>
              <h4 className="font-bold text-lg mb-4 relative inline-block">
                Empresa
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-red-500"></span>
              </h4>
              <ul className="space-y-2">
                {company.map((item, idx) => (
                  <li key={idx}>
                    <a
                      href="#"
                      className="text-sm opacity-90 hover:opacity-100 hover:text-cyan-400 transition-all inline-block hover:translate-x-1"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-12 pt-8 border-t border-white border-opacity-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <Phone size={20} color="black" />
                </div>
                <div>
                  <h5 className="font-semibold mb-1">Teléfono</h5>
                  <a
                    href="tel:+5491123456789"
                    className="text-sm opacity-90 hover:text-cyan-400"
                  >
                    +54 911 2345-6789
                  </a>
                  <p className="text-xs opacity-70 mt-1">Lun a Vie 9-19hs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <Mail size={20} color="black" />
                </div>
                <div>
                  <h5 className="font-semibold mb-1">Email</h5>
                  <a
                    href="mailto:info@ravello.com"
                    className="text-sm opacity-90 hover:text-cyan-400"
                  >
                    info@ravello.com
                  </a>
                  <p className="text-xs opacity-70 mt-1">Respuesta en 24hs</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} color="black" />
                </div>
                <div>
                  <h5 className="font-semibold mb-1">Oficinas</h5>
                  <p className="text-sm opacity-90">Av. Corrientes 1234, CABA</p>
                  <p className="text-xs opacity-70 mt-1">
                    Buenos Aires, Argentina
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white border-opacity-20 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-80 text-center md:text-left">
              © 2025 Ravello Turismo. Todos los derechos reservados. | Legajo
              EVyT N° 12345
            </p>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs opacity-70">Aceptamos:</span>
              <div className="flex gap-2">
                {["Visa", "Mastercard", "Amex", "Mercado Pago"].map(
                  (payment, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded bg-blue-900 text-white text-xs font-semibold border border-white border-opacity-30"
                    >
                      {payment}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;