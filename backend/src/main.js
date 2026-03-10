import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import { connectMongo } from "./connectMongo.js";
import { ImageProvider } from "./ImageProvider.js";
import { registerImageRoutes } from "../routes/imagesRoutes.js";


const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";
const app = express();
app.use(express.static(STATIC_DIR));

const mongo = connectMongo();
const images = new ImageProvider(mongo);

registerImageRoutes(app, images)

app.get("/api/hello", (req, res) => {
    res.send("Hello, World " + SHARED_TEST);

});

app.get(Object.values(VALID_ROUTES), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
})

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
