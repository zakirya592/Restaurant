import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DataTableProvider from "./Contexts/DataTableContext";
import { QueryClient, QueryClientProvider } from "react-query";
import RolesProvider from "./Contexts/FetchRolesContext.jsx";
import PatientInformation from "./Pages/patientInformation/patientInformation.jsx";
import Login from "./Pages/adminLogin/login.jsx";
import PatientTable from "./Pages/patientInformation/patientTable.jsx";
import UpdatePatientInformation from "./Pages/patientInformation/UpdatePatientInformation.jsx";
import Department from "./Pages/Department/Department.jsx";
import Users from "./Pages/MasterData/Users/Users.jsx";
import Roless from "./Pages/MasterData/Roles/Roless.jsx";
import Beds from "./Pages/MasterData/Beds/Beds.jsx";
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
                    <Route
                      path="/patient-information"
                      element={
                        <ProtectedRoute allowedRoles={["Registered Patients"]}>
                          <PatientInformation />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/update/patient-information/:Id"
                      element={<UpdatePatientInformation />}
                    />
                    {/* Product */}
                    <Route path="/Products" element={<Products />} />
                    <Route path="/Add-Products" element={<Addproduct />} />
                    {/* Categories */}
                    <Route path="/Categories" element={<Categories />} />

                    {/* Master Data */}
                    <Route
                      path="/Department"
                      // element={<Department />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Department />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      // element={<Users />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Users />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/Roles"
                      // element={<Roless />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Roless />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/Beds"
                      // element={<Beds />}
                      element={
                        <ProtectedRoute allowedRoles={["MasterData"]}>
                          <Beds />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/PatientJourney"
                      element={
                        <ProtectedRoute allowedRoles={["Patient Journey"]}>
                          <History />
                        </ProtectedRoute>
                      }
                    />
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
