let memberConteroller = module.exports;

memberConteroller.home = (req, res) => {
    console.log("GET cont.home");
    res.send("home sahifasidasiz");
};

memberConteroller.signup = (req, res) => {
    console.log("POST cont.signup");
    res.send("signup sahifasidasiz");
};

memberConteroller.login = (req, res) => {
    console.log("Post cont.login");
    res.send("login sahifasidasiz");
};

memberConteroller.logout = (req, res) => {
    console.log("GET cont.logout");
    res.send("logout sahifasidasiz");
};
