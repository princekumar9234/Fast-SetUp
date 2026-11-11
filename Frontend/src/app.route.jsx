import { createBrowserRouter } from "react-router-dom";
import Protected from "./features/components/Protected";
import Home from "./features/ai/Home";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import EmailVerifyPage from "./features/auth/pages/EmailVerifyPage";



export const router = createBrowserRouter([
    {
        path :"/",
        element : <Protected>
            <Home/>
        </Protected>
    },
     {
        path : "/register",
        element : <RegisterPage/>
    },
    {
        path :"/login",
        element : <LoginPage/>
    }, 
    {
        path: "/emailVerify",
        element : <EmailVerifyPage/>
    }
])