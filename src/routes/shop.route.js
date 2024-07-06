import express from 'express';
import {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop
} from '../controllers/shop.controller.js';

const router = express.Router();

router.route('/shops')
    .post(createShop)
    .get(getAllShops);

router.route('/shops/:id')
    .get(getShopById)
    .put(updateShop)
    .delete(deleteShop);

export default router;
