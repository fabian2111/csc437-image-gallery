import { MongoClient } from "mongodb";
import { getEnvVar } from "./getEnvVar.js";
import { ObjectId } from "mongodb"
import bcrypt from "bcrypt";

export class CredentialsProvider {
    constructor(mongoClient) {
        this.mongoClient = mongoClient;
        const collectionName = getEnvVar("CREDS_COLLECTION_NAME");
        this.collection = this.mongoClient.db().collection(collectionName);
    }

    async registerUser(username, email, password){
       const existingUser = await this.collection.findOne({username: username});
       //console.log(existingUser);
       if(existingUser != null){
            return false;
       }

       const salt = await bcrypt.genSalt(10);
       const hashedPass = await bcrypt.hash(password, salt);

    //    const session = this.mongoClient.startSession();

    //    try{
    //         await session.withTransaction(async () => {

    //         this.collection.insertOne({
    //         username: username,
    //         password: hashedPass
    //         })


    //         const usersCol = getEnvVar("USERS_COLLECTION_NAME");
    //         this.mongoClient.db().collection(usersCol).insertOne({
    //             username: username,
    //             email: email
    //         })

    //         return true;
    //         })
    //    } finally {
    //         await session.endSession();
    //    }


        this.collection.insertOne({
            username: username,
            password: hashedPass
        })


        const usersCol = getEnvVar("USERS_COLLECTION_NAME");
        this.mongoClient.db().collection(usersCol).insertOne({
            username: username,
            email: email
        })

        return true;

    }

    async verifyPassword(username, password){
        const user = await this.collection.findOne( {username: username} );
        if(user == null){
            return false;
        }

        return await bcrypt.compare(password, user.password);
    }


}
