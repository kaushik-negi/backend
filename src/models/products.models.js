import mongoose,{Schema} from "mongoose"
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";



const packSizeSchema = new mongoose.Schema({
    weight: {
        value: {
            type: Number,
            required: [true, "Please enter the weight of the product"]
        },
        unit: {
            type: String,
            enum: ['g', 'ml', 'kg', 'L'],
            required: [true, "Please enter the unit of the weight"]
        }
    },
    price: {
        type: Number,
        required: [true, "Please enter the product price"]
    },
    cuttedPrice: {
        type: Number,
    },
    packType: {
        type: String,
        enum: ['pouch', 'multipack'],
        required: [true, "Please enter the pack type"]
    },
    pouchCount: {
        type: Number,
        required: function() { return this.packType === 'multipack'; },
        validate: {
            validator: function(v) {
                return this.packType !== 'multipack' || (v && v > 0);
            },
            message: 'Pouch count is required for multipack and should be greater than 0'
        }
    }
});

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product description"]
    },
    highlights: [
        {
            type: String,
            required: true
        }
    ],
    specifications: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            }
        }
    ],
    packSize: [
      packSizeSchema
    ],
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    brand: {
        name: {
            type: String,
            required: true
        },
        logo: {
            public_id: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            }
        }
    },
    category: {
        type: String,
        required: [true, "Please enter product category"]
    },
    stock: {
        type: Number,
        required: [true, "Please enter product stock"],
        maxlength: [4, "Stock cannot exceed limit"],
        default: 1
    },
    warranty: {
        type: Number,
        default: 1
    },
    ratings: {
        type: Number,
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


const Product = mongoose.model('Product', productSchema);

export default Product;
