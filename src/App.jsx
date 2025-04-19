import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataTableProvider from "./Contexts/DataTableContext";
import { QueryClient, QueryClientProvider } from "react-query";
import RolesProvider from "./Contexts/FetchRolesContext.jsx";
import Login from "./Pages/adminLogin/login.jsx";
import newRequest from "./utils/newRequest.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./Pages/NotFound/NotFound.jsx";
import History from "./Pages/PatientJourney2/History.jsx";
import Home from "./Pages/Home/Home.jsx";
import Products from "./Pages/Product/Products.jsx";
import Addproduct from "./Pages/Product/Addproduct.jsx";
import Categories from "./Pages/Categories/Categories.jsx";
const queryClient = new QueryClient();

export const RolesContext = createContext([]);

const App = () => {
  const [userRoles, setUserRoles] = useState([]);
  const accessuserdata = JSON.parse(localStorage.getItem("userdata"));
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await newRequest.get(`/api/v1/user/${accessuserdata?.user?.id || ""}`);
        setUserRoles(response?.data?.data?.roles?.map(role => role.name) || []);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);
  return (
    <>
      <DataTableProvider>
        <QueryClientProvider client={queryClient}>
          <RolesProvider>
            <div>
              <RolesContext.Provider value={userRoles}>
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/Home" element={<Home />} />
                    {/* Product */}
                    <Route path="/Products" element={<Products />} />
                    <Route path="/Add-Products" element={<Addproduct />} />
                    {/* Categories */}
                    <Route path="/Categories" element={<Categories />} />
                    {/* History */}
                    <Route path="/PatientJourney" element={<History />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </RolesContext.Provider>
            </div>
          </RolesProvider>
        </QueryClientProvider>
      </DataTableProvider>
    </>
  );
};

export default App;
