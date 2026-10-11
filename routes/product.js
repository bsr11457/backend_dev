const express = require("express");
const router = express.Router();
const c=require("../controllers/productController");
const {protect} = require("../middleware/auth")
//     {
//         id: 1, 
//         name: "Laptop",
//         price: 50000
//     },
//     {
//         id: 2,
//         name: "Mobile",
//         price: 20000
//     },
//     {
//         id: 3,
//         name: "Charger",
//         price: 250
//     }
// ];

// router.get("", (req, res) => {
//     res.send(products);
// });

router.get("/:id", c.getProductById);

       
router.post("",protect, c.createProduct);

router.put("/:id",protect, c.updateProduct);

router.delete("/:id",protect, c.deleteProduct);
router.get("",protect,c.getProducts);

module.exports = router;
