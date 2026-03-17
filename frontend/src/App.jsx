import { AllImages } from "./images/AllImages.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { UploadPage } from "./UploadPage.jsx";
import { LoginPage } from "./LoginPage.jsx";
import { Routes, Route } from "react-router";
import { MainLayout } from "./MainLayout.jsx";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import { useState } from "react";
import { ProtectedRoute } from "./ProtectedRoute.jsx"

function App() {
    const [authToken, setAuthToken] = useState("");

    return <Routes>
        <Route path={VALID_ROUTES.HOME} element={<MainLayout />}>

        <Route index element={<ProtectedRoute authToken={authToken}>
            <AllImages authToken={authToken}></AllImages>
        </ProtectedRoute>} />

        <Route path={VALID_ROUTES.IMAGE} element={<ProtectedRoute authToken={authToken}>
            <ImageDetails authToken={authToken}></ImageDetails>
        </ProtectedRoute>} />

        <Route path={VALID_ROUTES.UPLOAD} element={<ProtectedRoute authToken={authToken}>
            <UploadPage authToken={authToken}></UploadPage>
        </ProtectedRoute>} />

        <Route path={VALID_ROUTES.LOGIN} element={<LoginPage isRegistering={false} setAuthToken={setAuthToken}/>} />
        <Route path={VALID_ROUTES.REGISTER} element={<LoginPage isRegistering={true} setAuthToken={setAuthToken}/>} />
    </Route>
    </Routes>
}

export default App;
