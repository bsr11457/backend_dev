const Product = require("../models/productss");


exports.getProducts = async (req, res, next) => {
    try {
        const { search, instock, minprice, maxprice, sort } = req.query;

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const filter = {};

        if (search) {
            const safe=search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")
            filter.name = {
                $regex: safe,
                $options: "i"
            };
        }

        if (instock !== undefined) {
            filter.instock = instock === "true";
        }

        if (minprice !== undefined || maxprice !== undefined) {
            filter.price = {};

            if (minprice !== undefined) {
                filter.price.$gte = Number(minprice);
            }

            if (maxprice !== undefined) {
                filter.price.$lte = Number(maxprice);
            }
        }

        console.log(filter);

        const total = await Product.countDocuments(filter);

        const results = await Product.find(filter)
            .sort(sort || "-createdAt")
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            total,
            page,
            pages: Math.ceil(total / limit),
            results
        });

    } catch (error) {
        next(error);
    }
};



exports.getProductById= async (req, res,next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}
exports.getMyProducts=async(req,res,next)=>{

    try{
        const products=await Product.find({createdBy:req.user.id});
        res.status(200).json(products);
    }
    catch (error) {
        next(error);
    }
}
exports.createProduct = async (req, res, next) => {
   try {
        const {name, price} = req.body;

        if (!name) {
            return res.status(400).json({
                message: "Name not found"
            })
        }

        if (!price) {
            return res.status(400).json({
                message: "price not found"
            })
        }

        const product = await Product.create({
            ...req.body, 
            createdBy: req.user.id
        })
        return res.status(201).json(product);
   } catch (err) {
        next(err);
   }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({
                error: "Product Not found"
            });
        }
        if (String(product.createdBy) !== req.user.id) {
            return res.status(403).json({
                error: "You can only change your own products"
            });
        }
        delete req.body.createdBy;
        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                returnDocument: "after",
                runValidators: true
            }
        );
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

exports.deleteProduct =  async (req, res, next) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        if (String(product.createdBy) !== req.user.id) {
            return res.status(401).json({
                message: "u cant' delete other products"
            });
        }
        
        await product.deleteOne();
        res.status(200).json({
            message: "Product deleted successfully"
        })
    } catch (err) {
        next(err);
    }
}
