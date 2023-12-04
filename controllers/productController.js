// product-related controller in papay adminka web application
let productController = module.exports;

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
        // console.log(req.member);
        // res.json({ state: "success", test: "OK" });
        res.send("OK");

        // TODO: product creation develop
    } catch {
        console.log(`Error, controller/addNewProduct, ${err.message}`);
    }
};

// This function handles updating a chosen product.
productController.updateChoosenProduct = async (req, res) => {
    try {
        console.log("POST: controller/updateChoosenProduct");
    } catch {
        console.log(`Error, controller/updateChoosenProduct, ${err.message}`);
    }
};
