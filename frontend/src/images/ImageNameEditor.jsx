import { useState } from "react";

export function ImageNameEditor({ imageId, initialValue, updateImageName }) {
    const [isEditingName, setIsEditingName] = useState(false);
    const [nameInput, setNameInput] = useState(initialValue || "");

    const [isSending, setSendState] = useState(false);
    const [sendError, setErrorState] = useState(false);

    function handleEditPressed() {
        setIsEditingName(true);
        setNameInput(initialValue || "");
    }
    async function handleSubmitPressed() {
        // TODO
        setErrorState(false);
        let sendData = -1;
        sendData = await fetch(`/api/images/${imageId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify( { name: nameInput } ) })
        if(sendData.status != -1){
            setSendState(false);
            setIsEditingName(false);
            if(sendData.status == 204){
                 updateImageName(nameInput);
            }
            else{
                setErrorState(true);

            }
        }
        setSendState(false);
    }

    if (isEditingName) {
        return (
            <div style={{ margin: "1em 0" }}>
                <label>
                    {!isSending &&  <p>New Name</p>}
                    <div aria-live="polite">
                        {isSending && <p>Renaming image...</p>}
                     </div>

                    <input
                        required
                        style={{ marginLeft: "0.5em" }}
                        disabled={isSending}
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                    />
                </label>
                <button disabled={nameInput.length === 0 && isSending} onClick={ () => {setSendState(true);  handleSubmitPressed() }  }>Submit</button>
                <button onClick={() => setIsEditingName(false)}>Cancel</button>
            </div>
        );
    } else {
        return (
            <div style={{ margin: "1em 0" }}>


                <div aria-live="polite" >
                    {sendError && <p>Error in renaming image.</p>}
                </div>
                <button onClick={handleEditPressed}>Edit name</button>
            </div>
        );
    }
}
