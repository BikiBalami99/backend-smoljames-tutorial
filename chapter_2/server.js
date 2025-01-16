const express = require("express");
const app = express();
const PORT = 8383;

let data = ["james"];
// Middleware

app.use(express.json());

// Website endpoints

app.get("/", (req, res) => {
    res.send(`
        <body 
            style="background-color: pink;
            padding: 20px;
            color: blue;">
                <h1>DATA:</h1>
                <p>${JSON.stringify(data)}</p>
                <a href="/dashboard">Dashboard</a>
        </body>
        `);
});

app.get("/dashboard", (req, res) => {
    console.log(req.method);
    res.send(`
        <body>
            <h1>Dashboard</h1>
            <a href="/">Home</a>
        </body>
        `);
});

// Api endpoints

app.get("/api/data", (req, res) => {
    console.log("This is for data");
    res.send(data);
});

app.post("/api/data", (req, res) => {
    const newEntry = req.body;
    console.log(newEntry);
    data.push(newEntry.name);
    res.sendStatus(201);
});

app.delete("/api/data", (req, res) => {
    data.pop();
    console.log("We deleted the last entry");
    res.sendStatus(203);
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
