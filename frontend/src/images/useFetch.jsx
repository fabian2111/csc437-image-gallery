
import { useState, useEffect } from "react";

export default function useFetch(imageId, authToken){

    const [imageData, _setImageData] = useState([]);
    const [isFetching, setFetchState] = useState(true);
    const [errorData, setErrorData] = useState("");

    const [imageName, setImageName] = useState("");


    useEffect(() => {
    // Code in here will run just once when this component is created
    // (Or just twice in development mode)
        async function getData(){
        try{
            const response = await fetch("/api/images", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${authToken.authToken}`,
                },
            });

            if(!response.ok){
                throw new Error(`Error: HTTP ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            if(imageId != null){
                const dbImg = await fetch(`/api/images/${imageId}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${authToken.authToken}`
                    }
                })

                if(dbImg.status == 404){
                    throw new Error(`Error: HTTP ${dbImg.status} ${dbImg.statusText}`)
                }

                const img = await dbImg.json();

                _setImageData(img[0])
                setImageName(img[0].name)
            }
            else{
               _setImageData(result);
           }
        } catch(error) {
            //console.error(error.message);
            setErrorData(error.message);
            _setImageData([])
        } finally {
            setFetchState(false);
        }
    }

       getData();
    }, []);

    return [imageData, isFetching, errorData, imageName, setImageName];

}
