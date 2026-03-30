import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import DashBoard from "../pages/dashboard"
import Home from "../pages/Home"
const AppRouter = () => {
   

    return (
        <BrowserRouter >
            {/* <Layout> */}
                <Routes>

                    <Route path="/" element={<Home />} />
                    <Route path="dashboard" element={<DashBoard />} />
                    {/* <Route path="*" element={<Home />} /> */}
                    
                    
                </Routes>
            {/* </Layout> */}
        </BrowserRouter>
    )
}

export default AppRouter