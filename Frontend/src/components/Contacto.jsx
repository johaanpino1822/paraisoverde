import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane, FaTwitter } from "react-icons/fa"; // Importa FaTwitter

const Contacto = () => {
    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 py-20 px-4 mt-40">
            {/* Contenedor principal */}
            <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
                {/* Sección de información de contacto */}
                <div className="w-full lg:w-1/3 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white flex flex-col justify-center">
                    <h2 className="text-4xl font-bold mb-6 animate-fade-in">Contáctanos</h2>
                    <p className="text-lg mb-8 animate-fade-in delay-100">
                        Estamos aquí para ayudarte. ¡No dudes en ponerte en contacto con nosotros!
                    </p>

                    {/* Información de contacto */}
                    <div className="space-y-6 animate-fade-in delay-200">
                        <div className="flex items-center gap-4">
                            <FaMapMarkerAlt className="text-2xl" />
                            <p className="text-lg">Calle Falsa 123, Ciudad Imaginaria</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaPhoneAlt className="text-2xl" />
                            <p className="text-lg">+123 456 7890</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <FaEnvelope className="text-2xl" />
                            <p className="text-lg">info@turismo.com</p>
                        </div>
                    </div>

                    {/* Redes sociales */}
                    <div className="flex gap-4 mt-8 animate-fade-in delay-300">
                        <a href="#" className="text-white hover:text-blue-200 transition-all">
                            <FaTwitter className="text-2xl" /> {/* Ahora FaTwitter está definido */}
                        </a>
                        <a href="#" className="text-white hover:text-blue-200 transition-all">
                            <FaEnvelope className="text-2xl" />
                        </a>
                        <a href="#" className="text-white hover:text-blue-200 transition-all">
                            <FaPhoneAlt className="text-2xl" />
                        </a>
                    </div>
                </div>

                {/* Sección del formulario de contacto */}
                <div className="w-full lg:w-2/3 p-8">
                    <h3 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">Envíanos un Mensaje</h3>
                    <form className="space-y-6 animate-fade-in delay-100">
                        {/* Nombre y Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Ingresa tu nombre"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Ingresa tu email"
                                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {/* Asunto */}
                        <div>
                            <label htmlFor="asunto" className="block text-sm font-medium text-gray-700 mb-2">
                                Asunto
                            </label>
                            <input
                                type="text"
                                id="asunto"
                                name="asunto"
                                placeholder="Ingresa el asunto"
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        {/* Mensaje */}
                        <div>
                            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-2">
                                Mensaje
                            </label>
                            <textarea
                                id="mensaje"
                                name="mensaje"
                                rows="5"
                                placeholder="Escribe tu mensaje aquí..."
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                required
                            />
                        </div>

                        {/* Botón de enviar */}
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            <FaPaperPlane className="text-xl" />
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contacto;