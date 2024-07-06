import mongoose from 'mongoose';

const shopSchema = new mongoose.Schema({
    ownerImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    shopImage: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    address: {
        type: String,
        required: [true, "Please enter shop address"]
    },
    rating: {
        type: Number,
        default: 0
    },
    inventory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Shop = mongoose.model('Shop', shopSchema);

export default Shop;
