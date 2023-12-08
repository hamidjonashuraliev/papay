// product-related controller in papay adminka web application
const assert = require("assert"); // A Node.js built-in module for making assertions.
const Definer = require("../lib/mistake"); // A utility class that contains predefined error messages.
let productController = module.exports;
const Product = require("../models/Product"); //  imports the Product model, which a class responsible for handling database interactions related to products.

// This is an asynchronous function designed to handle an HTTP GET request to retrieve all products.
productController.getAllProducts = async (req, res) => {
    try {
        console.log("GET: controller/getAllProducts");
        const product = new Product();
        const result = await product.getAllProductsData(req.member, req.body);
        res.json({ state: "success", data: result });
    } catch (err) {
        console.log(`Error, controller/getAllProducts, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

productController.getChosenProduct = async (req, res) => {
    try {
        console.log("GET: controller/getChosenProduct");
        const product = new Product(),
        id = req.params.id,
        result = await product.getChosenProductData(req.member, id);

        res.json({ state: "success", data: result });
    } catch {
        err;
    }
    {
        console.log(`Error, controller/getChosenProduct, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

// This is asynchronous function designed to handle an HTTP POST request to add a new product.
productController.addNewProduct = async (req, res) => {
    try {
        console.log("POST: controller/addNewProduct");
        // console.log("Request files: ", req.files);
        assert.ok(req.files, Definer.general_err3);
        // console.log(req.member);
        const product = new Product();
        let data = req.body;

        data.product_images = req.files.map((ele) => {
            return ele.path;
        });
        // Extracts the paths of uploaded files from req.files and assigns them to the product_images property of data.

        const result = await product.addNewProductData(data, req.member);
        // Calls the addNewProductData method of the Product Service model to add the new product to the database, passing in the product data and the member information from req.member.

        const html = `<script>
                    alert('new dish added successfully');
                    window.location.replace('/resto/products/menu');
                  </script>`;
        res.end(html);
        //Constructs an HTML response containing a JavaScript alert and a redirection to the product menu page and sends it as the response.
    } catch (err) {
        console.log(`Error, controller/addNewProduct, ${err.message}`);
    }
};

// This function handles updating a chosen product.
productController.updateChosenProduct = async (req, res) => {
    try {
        console.log("POST: controller/updateChosenProduct");
        const product = new Product(); // Creates a new Product instance.
        const id = req.params.id; // Retrieves the id parameter from the request's URL (req.params.id).
        const result = await product.updateChosenProductData(
            id,
            req.body,
            req.member._id
        );
        // Calls the updateChosenProductData method of the Product Service model to update the chosen product in the database, passing in the product ID (id), the product data from req.body, and the member's _id from req.member.

        await res.json({ state: "success", data: result }); // Sends a JSON response with a "success" state and the updated product data.
    } catch (err) {
        console.log(`Error, controller/updateChosenProduct, ${err.message}`);
    }
};
