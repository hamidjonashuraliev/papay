let productController = module.exports;

productController.getAllProducts = async (req, res) => {
    try {
        console.log("GET: controller/getAllProducts");
    } catch {
        console.log(`Error, controller/getAllProducts, ${err.message}`);
        res.json({ state: "fail", message: err.message });
    }
};

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

productController.updateChoosenProduct = async (req, res) => {
    try {
        console.log("POST: controller/updateChoosenProduct");
    } catch {
        console.log(`Error, controller/updateChoosenProduct, ${err.message}`);
    }
};
