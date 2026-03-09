import { useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchById } from "./ImageFetcher.js";
import { useParams } from "react-router";
import { useEffect } from "react";
import useFetch from "./useFetch.jsx";
import { ImageNameEditor } from "./ImageNameEditor.jsx"



export function ImageDetails() {
    const { imageId } = useParams();

    const [image, isFetching, errorData, imageName, setImageName] = useFetch(imageId);

    //
    //const [imageName, setImageName] = useState(image.name);


    // const [image, _setImage] = useState();
    // const [isFetching, setFetchState] = useState(false);
    // const [errorData, setErrorData] = useState("");

    function updateImageName(newName){
        setImageName(newName);
    }

    // useEffect( () => {
    //     async function setName() {

    //          return await setImageName(image.name)
    //     }
    //     setName();

    // },[]  )


    // async function addImage(){
    //     setErrorData("")
    //     try{
    //             setFetchState(true)
    //             const dbImg = await fetch(`/api/images/${imageId}`)
    //             if(dbImg.status == 404){
    //                 throw new Error(`Error: HTTP ${dbImg.status} ${dbImg.statusText}`)
    //             }
    //             const img = await dbImg.json();

    //             _setImage(img[0])
    //         }
    //         catch(error){
    //             setErrorData(error.message)
    //             _setImage("")

    //         } finally {
    //             setFetchState(false);
    //         }


    // }

    // addImage();


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
            <ImageNameEditor imageId={image._id} updateImageName={updateImageName}></ImageNameEditor>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
            </>}
        </>
    )
}
