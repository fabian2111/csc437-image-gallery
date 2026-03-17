import express from "express";
import jwt from "jsonwebtoken";
import { getEnvVar } from "../src/getEnvVar.js";


/**
 * Creates a Promise for a JWT token, with a specified username embedded inside.
 *
 * @param username the username to embed in the JWT token
 * @return a Promise for a JWT
 */
function generateAuthToken(username) {
    return new Promise((resolve, reject) => {
        const payload = {
            username
        };
        jwt.sign(
            payload,
            getEnvVar("JWT_SECRET"),
            { expiresIn: "1d" },
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}


export function registerAuthRoutes(app, credentialsprovider){

    app.use(express.json())

    app.post("/api/users", async (req, res) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if(username == null || email == null || password == null){
            res.status(400).send({
                error: "Bad request",
                message: "Missing username, email, or password"
            })
        }
        else{

            const addUser = await credentialsprovider.registerUser(req.body.username, req.body.email, req.body.password);

            if(addUser){
                const token = await generateAuthToken(username);
                res.status(201).send({
                    token: token
                });
            }
            else{
                res.status(409).send({
                    error: "Conflict",
                    message: "Username already taken"
                })
            }
        }
    });

    app.post("/api/auth/tokens", async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        if(username == null || password == null){
            res.status(400).send({
                error: "Bad request",
                message: "Missing username or password"
            })
        }
        else{
            if(await credentialsprovider.verifyPassword(username, password)){
                const token = await generateAuthToken(username);
                res.status(200).send({
                    token: token
                })
            }
            else{
                res.status(401).send({
                    error: "Unauthorized",
                    message: "Incorrect username or password"
                })
            }


        }




    })



}
