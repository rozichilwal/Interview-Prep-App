import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Protected from "./feature/auth/components/Protected";

const Login = lazy(() => import("./feature/auth/pages/Login"));
const Register = lazy(() => import("./feature/auth/pages/Register"));
const Home = lazy(() => import("./feature/interview/pages/Home"));
const Interview = lazy(() => import("./feature/interview/pages/Interview"));

const SuspenseWrapper = ({ children }) => (
    <Suspense fallback={<main className='loading-screen'><h1>Loading...</h1></main>}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <SuspenseWrapper><Login /></SuspenseWrapper>
    },
    {
        path: "/register",
        element: <SuspenseWrapper><Register /></SuspenseWrapper>
    },
    {
        path: "/",
        element: <Protected><SuspenseWrapper><Home /></SuspenseWrapper></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><SuspenseWrapper><Interview /></SuspenseWrapper></Protected>
    }
])