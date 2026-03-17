import express from "express";
import { verifyAuthToken } from "./verifyAuthToken.js";
//import { ImageProvider } from "../ImageProvider";
import { imageMiddlewareFactory } from "./imageUploadMiddleware.js";
import { handleImageFileErrors } from "./imageUploadMiddleware.js";

export function registerImageRoutes(app, imageProvider) {

    function waitDuration(numMs){
        return new Promise(resolve => setTimeout(resolve, numMs));
    }

    app.use("/api/images{/*all}", verifyAuthToken);

    app.use(express.json())

    app.get("/api/images",  async (req, res) => {
        //const images = new ImageProvider(mongo);

        const imgArray = await imageProvider.getAllImageWithAuthor()

        waitDuration(1000).then(() => res.send(imgArray));

    })

    app.post("/api/images",
    imageMiddlewareFactory.single("image"),
    handleImageFileErrors,
    async (req, res) => {
        // Final handler function after the above two middleware functions finish running
        if(req.body.name == null || req.file == null){
            res.status(400).send();
            return;
        }
        const src = `/uploads/${req.file.filename}`
        const name = req.body.name;
        const authorId = req.userInfo.username;

        const newImageId = await imageProvider.createImage(src, name, authorId);

        res.status(201).send({
            imageId: `${newImageId}`
        })
    }
);

    app.get("/api/images/:imageId", async (req, res) => {

        const img = await imageProvider.getOneImage(req.params.imageId);

        if(img == null){
            res.status(404).send({
                error: "Not Found",
                message: "No image with that ID"
            });
        }
        else{
            res.send(img);
        }

    })

    app.patch("/api/images/:imageId", async (req, res) => {
        await waitDuration(1000);

        const MAX_NAME_LENGTH = 100;

        const img = await imageProvider.getOneImage(req.params.imageId);

        if(img[0].author.username != req.userInfo.username){
            res.status(403).send({
                error: "Forbidden",
                message: "This user does not own this image"
            });
        }
        else{

        const updateImg = await imageProvider.updateImageName(req.params.imageId, req.body.name)

        if(updateImg == 404){
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
        }
        else if(updateImg == 400){
            res.status(400).send({
                error: "Bad Request",
                message: "Body is not formatted correctly"
            });
        }

        else if(updateImg == 413){
            res.status(413).send({
                error: "Content Too Large",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
        }

        else{
            res.status(204).send();
        }


        }




    })


}
