import React from 'react';

const TourismSection = () => {
  const destinations = [
    {
      id: 1,
      name: "París, Francia",
      description: "La ciudad del amor, famosa por su Torre Eiffel, el Louvre y su exquisita gastronomía.",
      image: "https://via.placeholder.com/400x300?text=París",
      link: "#",
    },
    {
      id: 2,
      name: "Tokio, Japón",
      description: "Una mezcla fascinante de tradición y modernidad, con templos antiguos y tecnología de vanguardia.",
      image: "https://via.placeholder.com/400x300?text=Tokio",
      link: "#",
    },
    {
      id: 3,
      name: "Nueva York, EE.UU.",
      description: "La ciudad que nunca duerme, hogar de Times Square, Central Park y la Estatua de la Libertad.",
      image: "https://via.placeholder.com/400x300?text=Nueva+York",
      link: "#",
    },
    {
      id: 4,
      name: "Santorini, Grecia",
      description: "Famosa por sus impresionantes puestas de sol, casas blancas y vistas al mar Egeo.",
      image: "https://via.placeholder.com/400x300?text=Santorini",
      link: "#",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Destinos Populares
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="relative overflow-hidden rounded-lg shadow-lg group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {destination.name}
                </h3>
                <p className="text-white text-sm mb-4">
                  {destination.description}
                </p>
                <a
                  href={destination.link}
                  className="inline-block bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
                >
                  Explorar
                </a>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-100 group-hover:opacity-0 transition-opacity duration-300">
                <h3 className="text-2xl font-bold text-white text-center">
                  {destination.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourismSection;