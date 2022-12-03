exports.home = (req, res) => {
    res.render("home", {
        title: "Home Page",
        name: req.user.name,
        email: req.user.email
    })
}