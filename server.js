const express = require("express");

const app = express();

app.use(
    express.json({
        extended: false,
    })
);

app.get("/", (req, res) =>
    res.json({
        Author: "Rajarshee Chatterjee",
        Version: "1.0.0",
        Github: "https://github.com/rajarsheechatterjee/LNReader-backend",
    })
);

app.use("/api/", require("./api/latest"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
