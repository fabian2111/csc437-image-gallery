import React, { useActionState } from "react";
import { MainLayout } from "./MainLayout.jsx";
import "./LoginPage.css";
import { Link } from "react-router";
import { useNavigate } from "react-router";

export function LoginPage( { isRegistering, setAuthToken } ) {
    const emailInputId = React.useId();
    const usernameInputId = React.useId();
    const passwordInputId = React.useId();

    const navigate = useNavigate();

    async function registerUser(username, email, password){
        const response = await fetch("/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            })
            return response;
    }

    async function loginUser(username, password){
        const response = await fetch("/api/auth/tokens", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        })
        return response;


    }

    const [result, submitAction, isPending] = useActionState(
        async (previousState, formData) => {
            const email = formData.get("email");
            const username = formData.get("username");
            const password = formData.get("password");

            if(!username || !password || (isRegistering && !email)){
                return {
                    type: "error",
                    message: `Email, username, and password cannot be empty`,
                };
            }



            if(isRegistering){
                const response = await registerUser(username, email, password);
                if(response.status === 201){
                    console.log("Successfully created account");
                    const token = await response.json().then(res => res.token)
                    setAuthToken(token);
                    navigate("/");
                }
                else if(response.status === 409){
                    console.log("Username already taken")
                    return {
                        type: "error",
                        message: "Username already taken"
                    }
                }

                return {
                    type: "success",
                    message: "Successfully created an account"
                }

            }
            else{
                const response = await loginUser(username, password);

                if(response.status === 200){
                    const token = await response.json().then(res => res.token)

                    setAuthToken(token);
                    navigate("/");
                    return {
                        type: "success",
                        message: "Successfully logged in"
                    }
                }
                else if(response.status === 401){
                    console.log("Incorrect username or password");
                    return {
                        type: "error",
                        message: "Incorrect username or password"
                    }
                }
            }

        },
        null
    )


    //if(isRegistering){
         return (
        <>
            { isRegistering ? <h2>Register a new account</h2> : <h2>Log in</h2>}
            {( result && result.type === "success") && <p className={`message ${result.type}`}>{result.message}</p>}
            <div aria-live="polite">
                {(result && result.type) === "error" && result.message}
            </div>
            {isPending && <p>Loading...</p>}
            <form className="LoginPage-form" action={submitAction}>

                {isRegistering && <>
                <label htmlFor={emailInputId}>Email</label>
                <input id={emailInputId} name={"email"} required disabled={isPending}/>
                </>}

                <label htmlFor={usernameInputId} >Username</label>
                <input id={usernameInputId} name={"username"} required disabled={isPending}/>

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} name={"password"} type="password" required disabled={isPending}/>

                <input type="submit" value="Submit" disabled={isPending} />
            </form>

            {isRegistering &&  <div className="flex">
                <p>Already have an account?</p>
                <Link to="/login">Login here</Link>
            </div>}

            {!isRegistering && <div className="flex">
                <p>Don't have an account?</p>
                <Link to="/register">Register here</Link>
            </div>}
        </>
    );



    //}
    // else{
    //      return (
    //     <>
    //         <h2>Login</h2>
    //         <form className="LoginPage-form" action={submitAction}>
    //             <label htmlFor={usernameInputId}>Username</label>
    //             <input id={usernameInputId} required />

    //             <label htmlFor={passwordInputId}>Password</label>
    //             <input id={passwordInputId} type="password" required />

    //             <input type="submit" value="Submit" />
    //         </form>

    //         <div className="flex">
    //             <p>Don't have an account?</p>
    //             <Link to="/register">Register here</Link>
    //         </div>
    //     </>
    // );
    // }


}
