import { useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchById } from "./ImageFetcher.js";
import { useParams } from "react-router";
import { useEffect } from "react";
import useFetch from "./useFetch.jsx";
import { ImageNameEditor } from "./ImageNameEditor.jsx"



export function ImageDetails(authToken) {
    const { imageId } = useParams();

    const [image, isFetching, errorData, imageName, setImageName] = useFetch(imageId, authToken);

    function updateImageName(newName){
        setImageName(newName);
    }

    //if (!image) {
       // return <h2>Image not found</h2>;
    //}
    return ( <>
            {isFetching && <div>
                <p>Loading...</p>
                </div>}
            {(!isFetching && errorData != "") ? <div>
                <h2>Image not found</h2>
                <p>{errorData}</p>
            </div> : null}

           {(!isFetching && errorData == "") && <>
           <h2>{imageName}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor imageId={image._id} updateImageName={updateImageName} authToken={authToken}></ImageNameEditor>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
            </>}
        </>
    )
}
