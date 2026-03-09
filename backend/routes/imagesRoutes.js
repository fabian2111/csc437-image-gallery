import express from "express";
//import { ImageProvider } from "../ImageProvider";

export function registerImageRoutes(app, imageProvider) {

    function waitDuration(numMs){
        return new Promise(resolve => setTimeout(resolve, numMs));
    }

    app.get("/api/images",  async (req, res) => {
        //const images = new ImageProvider(mongo);

        const imgArray = await imageProvider.getAllImageWithAuthor()

        waitDuration(1000).then(() => res.send(imgArray));

    })

    app.get("/api/images/:imageId", async (req, res) => {

        const img = await imageProvider.getOneImage(req.params.imageId);

        if(img == null){
            res.status(404).send({
                error: "Not Found",
                message: "No image with that ID"
            });
        }
        else{

        }
        res.send(img);
    })


    app.use(express.json())

    app.put("/api/images/:imageId", (req, res) => {
        const MAX_NAME_LENGTH = 100;
        const updateImg = imageProvider.updateImageName(req.params.imageId, req.body.name);

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

        else if(updateImg == 0) {
            res.status(404).send({
                error: "Not Found",
                message: "Incorrect Image"
            });
        }
        else {
            res.status(204).send();
        }



    })


}
