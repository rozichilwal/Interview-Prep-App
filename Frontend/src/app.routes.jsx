import {createBrowserRouter} from "react-router";
import Login from "./feature/auth/pages/Login";
import Register from "./feature/auth/pages/Register";
import Protected from "./feature/auth/components/Protected";
import Home from "./feature/interview/pages/Home";
import Interview from "./feature/interview/pages/Interview";


export const router = createBrowserRouter([
    {
        path:"/login",
        element:<Login/>
    },
    {
        path:"/register",
        element:<Register/>
    },
     {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    }
])