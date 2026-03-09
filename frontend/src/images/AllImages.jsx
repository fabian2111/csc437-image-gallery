import { useState } from "react";
import { MainLayout } from "../MainLayout.jsx";
import { fetchAll } from "./ImageFetcher.js";
import { ImageGrid } from "./ImageGrid.jsx";
import { useEffect } from "react";
import useFetch from "./useFetch.jsx";

export function AllImages() {
    const [imageData, isFetching, errorData] = useFetch(null);

    return (
        <>
            <h2>All Images</h2>
            {isFetching && <div>
                <p>Loading...</p>
                </div>}

            {(!isFetching && errorData != "") ? <div>
                <p>{errorData}</p>
            </div> : null}

            {!isFetching && <ImageGrid images={imageData} /> }

        </>
    );
}
