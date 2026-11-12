import { createBrowserRouter } from "react-router-dom";
import Protected from "./features/components/Protected";
import Home from "./features/ai/Home";
import RegisterPage from "./features/auth/pages/RegisterPage";
import LoginPage from "./features/auth/pages/LoginPage";
import EmailVerifyPage from "./features/auth/pages/EmailVerifyPage";
import ForgetPassPage from "./features/auth/pages/ForgetPassPage";
import UpdatePassword from "./features/auth/pages/updatePassword";



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
    }, 
    {
       path : "/forgetpassword",
         element : <ForgetPassPage/>
    }, 
    {
        path : "/updatePassword",
        element : <UpdatePassword/>
    }
])