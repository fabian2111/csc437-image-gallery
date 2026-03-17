import { useNavigate } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import React, {useState, useActionState} from "react";

export function UploadPage(authToken) {
    const inputId = React.useId();
    const [fileURL, setFileURL] = useState(null);

    const navigate = useNavigate();

    function handleFileUpload(e){
        const file = e.target.files[0];
        const url = readAsDataURL(file);
        setFileURL(url);
    }

    function readAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
        });
    }

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            // const image = formData.get("image");
            // const name = formData.get("name");

            const response = await fetch("/api/images", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken.authToken}`
                },
                body: formData
            })

            console.log(response)

            if(!response.ok){
                setFileURL(null);
                return {
                    type: "error",
                    message: response.statusText
                }
            }
            else{
                const imgJson = await response.json();
                // console.log(imgJson);
                // setFileURL(null);
                // navigate(`/images/${imgJson.imageId}`);
            }
            return {
                    type: "success",
                    message: "Successfully uploaded image"
                }


        }

    )

    return (
        <>
            <h2>Upload</h2>
            {(result && result.type) === "error" && <p>Error: {result.message}</p>}
            <form action={submitAction}>
                <div>
                    <label htmlFor={inputId}>Choose image to upload: </label>
                    <input
                        id={inputId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={(e) => handleFileUpload(e)}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending} />
                    </label>
                </div>

                <div> {/* Preview img element */}
                    <img style={{width: "20em", maxWidth: "100%"}} src={fileURL} alt="" />
                </div>

                <input type="submit" value="Confirm upload" disabled={isPending} />
            </form>
        </>
    );
}
