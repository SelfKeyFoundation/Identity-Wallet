const express = require("express");
app = express();
bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("port", 3333);

app.post("/", (req, res) => {
    res.status(200).json({ message: "OK" });
});

app.get("/", (req, res) => {
    res.status(200).json({ message: "OK" });
});

app.listen(app.get("port"), () => {
    console.log("Mock Local: ", app.get("port"));
});
