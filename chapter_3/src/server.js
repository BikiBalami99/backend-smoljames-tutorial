import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// Get the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
// Serves the HTML file from the /public directory
// Tells express to serve all files from the public folder as static assets / file. Any requests for the css files will be resolved to the public directory.
// We are doing the ../public because currently this module is inside the src folder which is adjacent to the public folder.
app.use(express.static(path.join(__dirname, "../public")));

// Serve the HTML file on the root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
