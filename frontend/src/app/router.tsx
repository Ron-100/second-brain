import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { Home, Dashboard, Allcollection, Twitter, Youtube, Docs, Links, Unauthorised } from "../pages";
import Layout from "./Layout";

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
        <Route path="/" element={<Layout/>}>
            <Route path="*" element={<Unauthorised/>}/>
            <Route path="" element={<Home/>}/>
            <Route path="dashboard">
                <Route path="" element={<Dashboard />} />
                <Route path="all" element={<Allcollection />}/>
                <Route path="twitter" element={<Twitter/>}/>
                <Route path="youtube" element={<Youtube/>}/>
                <Route path="docs" element={<Docs/>}/>
                <Route path="links" element={<Links/>}/>
            </Route>
        </Route>
        
        </>
    )
)

export default router