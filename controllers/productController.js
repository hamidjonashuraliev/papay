// product-related controller in papay adminka web application
const assert = require("assert"); // A Node.js built-in module for making assertions.
const Definer = require("../lib/mistake"); // A utility class that contains predefined error messages.
let productController = module.exports;
const Product = require("../models/Product"); //  imports the Product model, which a class responsible for handling database interactions related to products.

// This is an asynchronous function designed to handle an HTTP GET request to retrieve all products.
productController.getAllProducts = async (req, res) => {
    try {
        console.log("GET: controller/getAllProducts");
    } catch {
        console.log(`Error, controller/getAllProducts, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

// This is asynchronous function designed to handle an HTTP POST request to add a new product.
productController.addNewProduct = async (req, res) => {
    try {
        console.log("POST: controller/addNewProduct");
        // console.log("Request files: ", req.files);
        assert(req.files, Definer.general_err3);
        // console.log(req.member);
        // res.json({ state: "success", test: "OK" });
        const product = new Product();
        let data = req.body;

        data.product_images = req.files.map((ele) => {
            return ele.path;
        });

        const result = await product.addNewProductData(data, req.member);

        const html = `<script>
                    alert(new dish added successfully);
                    window.location.replace('/resto/products/menu');
                  </script>`;
        res.end(html);
    } catch (err) {
        console.log(`Error, controller/addNewProduct, ${err.message}`);
    }
};

// This function handles updating a chosen product.
productController.updateChoosenProduct = async (req, res) => {
    try {
        console.log("POST: controller/updateChoosenProduct");
    } catch (err) {
        console.log(`Error, controller/updateChoosenProduct, ${err.message}`);
    }
};
