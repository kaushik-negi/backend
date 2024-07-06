import Shop from '../models/shop.model.js';
import Products from '../models/products.models.js';

// Create a new shop
export const createShop = async (req, res) => {
    try {
        const shop = await Shop.create(req.body);
        res.status(201).json({
            success: true,
            data: shop
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get all shops
export const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find().populate('inventory');
        res.status(200).json({
            success: true,
            data: shops
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Get a single shop by ID
export const getShopById = async (req, res) => {
    try {
        const shop = await Shop.findById(req.params.id).populate('inventory');
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }
        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Update a shop
export const updateShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }
        res.status(200).json({
            success: true,
            data: shop
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// Delete a shop
export const deleteShop = async (req, res) => {
    try {
        const shop = await Shop.findByIdAndDelete(req.params.id);
        if (!shop) {
            return res.status(404).json({
                success: false,
                message: 'Shop not found'
            });
        }
        res.status(200).json({
            success: true,
            message: 'Shop deleted successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
