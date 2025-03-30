// backend/controllers/siteController.js

const Site = require('../models/Site');

exports.createSite = async (req, res) => {
    try {
        const site = new Site(req.body);
        await site.save();
        res.status(201).json(site);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSites = async (req, res) => {
    try {
        const sites = await Site.find();
        res.json(sites);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
