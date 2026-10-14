import {createHashRouter, RouterProvider} from "react-router-dom"
import Login from "./Login";
import Dashboard from "./Dashboard"
const Body = () => {
    const appRouter = createHashRouter([
        {
            path : "/",
            element : <Login/>
        },
        {
            path : "/dashboard",
            element : <Dashboard/>
        }
    ])
    return(
        <div style={{backgroundImage :"radial-gradient(circle at 50% 20%, #0f1e46, #070e24, #020617)", minHeight: "100vh",
        width: "100%"}}>
            <RouterProvider router = {appRouter}/>
        </div>
    )
}
export default Body