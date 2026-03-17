import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"

export class ImageProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("IMAGES_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    getAllImages() {
        // Without any options or filters passed to it, find() will get all documents in the collection.
        return this.collection.find().toArray();
    }

    async getAllImageWithAuthor(){
        const pipeline = [];

        pipeline.push({
            $lookup: {
                from: 'users',
                localField: 'authorId',
                foreignField: 'username',
                as: 'author',
            },
        });

        pipeline.push({
            $unwind: {
                path: '$author'
            }
        })

        pipeline.push({
            $unset: ["authorId"]
        })

        return await this.collection.aggregate(pipeline).toArray()

    }

    async getOneImage(imageId) {
    // Do keep in mind the type of _id in the DB is ObjectId, not string
    // Use `new ObjectId(imageId)` to convert a string to an ObjectId.
    // import { ObjectId } from "mongodb"

        if(ObjectId.isValid(imageId)){

            //const image = await this.collection.findOne({ _id: new ObjectId(imageId) });

            const pipeline = [];
            pipeline.push({
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: 'username',
                    as: 'author',
                },
            })

            pipeline.push({
                $match: {
                    _id: new ObjectId(imageId),
                }
            })

            pipeline.push({
                $unwind: {
                    path: '$author'
                }
            })

            pipeline.push({
                $unset: ["authorId"]
            })

            return await this.collection.aggregate(pipeline).toArray();

        }
        else{
            return null;
        }
    }

    async updateImageName(imageId, newName) {
    // Do keep in mind the type of _id in the DB is ObjectId, not string
    // Use `new ObjectId(imageId)` to convert a string to an ObjectId.
        //const imgId = new ObjectId(imageId);

        //Blue merle herding sheep

        if(newName == undefined){
            return 400;
        }

        else if(newName.length >= 100){
            return 413;
        }

        else if(ObjectId.isValid(imageId)){
            const updatedDoc = await this.collection.updateOne( { _id: new ObjectId(imageId) } , { $set: { name: newName} });
            //console.log(updatedDoc.matchedCount)
            return updatedDoc.matchedCount;

        }
        else{
            return 404;

        }
    }

    async createImage(src, name, authorId){

        const newImage = await this.collection.insertOne({
            src: src,
            name: name,
            authorId: authorId
        });

        return newImage.insertedId;

    }



}
