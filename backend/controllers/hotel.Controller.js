const Hotel = require('../models/Hotel');

exports.createHotel = async (req, res) => {
  try {
    const { name, description, location, priceRange, amenities } = req.body;

    const images = req.files?.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`) || [];

    const hotel = new Hotel({
      name,
      description,
      location,
      priceRange,
      amenities: amenities?.split(',') || [],
      images,
      createdBy: req.user._id
    });

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el hotel' });
  }
};

exports.getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los hoteles' });
  }
};

exports.getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el hotel' });
  }
};

exports.updateHotel = async (req, res) => {
  try {
    const { name, description, location, priceRange, amenities } = req.body;

    const images = req.files?.map(file => `data:${file.mimetype};base64,${file.buffer.toString('base64')}`) || [];

    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel no encontrado' });

    hotel.name = name;
    hotel.description = description;
    hotel.location = location;
    hotel.priceRange = priceRange;
    hotel.amenities = amenities?.split(',') || [];
    hotel.images = [...hotel.images, ...images]; // conserva las anteriores

    await hotel.save();
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el hotel' });
  }
};
