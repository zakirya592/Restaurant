import axios from "axios";
import { Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Beds from "../../Images/Beds.jpg";
import CentralWaitingArea from "../../Images/Central Waiting Area.png";
import Department from "../../Images/Department.png";
import logo from "../../Images/logo.png";
import logout from "../../Images/logout.png";
import MasterData from "../../Images/masterdata.png";
import PatientJourneyicon from "../../Images/PatientJourneyicon.png";
import Registration from "../../Images/Registration.png";
import Rolesicon from "../../Images/Roles.png";
import Usersicon from "../../Images/users.png";
import { baseUrl } from "../../utils/config";

function SideNav({ children }) {
  const [userRoles, setUserRoles] = useState([]);
  const [activeTab, setActiveTab] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(() => {
    const savedState = localStorage.getItem("sidebarOpen");
    return savedState ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isOpen));
  }, [isOpen]);

  useEffect(() => {
  getAllRegisteredMembers();
  }, []);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const sidebarItems = [
    {
      label: "Products",
      path: "/Products",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
          <img src={Registration} alt="Products" className="w-5 h-5" />
        </div>
      ),
    },
    {
      label: "Categories",
      path: "/Categories",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
          <img src={Registration} alt="Categories" className="w-5 h-5" />
        </div>
      ),
    },

    {
      label: "History",
      path: "/PatientJourney",
      icon: (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-green-50">
          <img src={PatientJourneyicon} alt="History" className="w-5 h-5" />
        </div>
      ),
    },
  ];

  const [userData, setUserData] = useState(() => {
    const storedUserData = localStorage.getItem("userdata");
    return storedUserData ? JSON.parse(storedUserData) : null;
  });

  const handleItemClick = (item) => {
   navigate(item.path);
  };

  const logoutbutton = () => {
    localStorage.removeItem("userdata");
    localStorage.removeItem("sidebarOpen");
    localStorage.removeItem("userRoles");
    navigate("/");
  };
  
  const accessToken = localStorage.getItem("accessToken");
  const storedUserData = JSON.parse(localStorage.getItem("userdata"));
  
  const getAllRegisteredMembers = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/user/${storedUserData?.user?.id || ""}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const response = res.data?.data?.roles?.map((role) => role.name) || [];
      // Save roles to state
      setUserRoles(response);
      // Save roles to localStorage
      localStorage.setItem("userRoles", JSON.stringify(response));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-0 lg:h-screen">
        <div className="body-content">
          <nav
            className={`fixed top-0 transition-all duration-300 ease-in-out bg-primary text-white lg:mt-0 mt-16 bottom-0 flex flex-col shadow-lg overflow-hidden z-50 ${
              isOpen ? "w-[280px]" : "w-[80px]"
            }`}
            id="sidenav"
          >
            {/* Logo Section */}
            <div className="flex items-center w-full px-4 py-5 justify-center bg-primary">
              <div
                className={`transition-opacity duration-300 justify-center cursor-pointer ${
                  !isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img src={logo} alt="logo" className="w-12 h-12" />
              </div>
              <div
                className={`transition-opacity duration-300 cursor-pointer ${
                  isOpen ? "opacity-0 w-0" : "opacity-100"
                }`}
                onClick={() => navigate("/Home")}
              >
                <img src={logo} alt="logo" className="w-10 h-10" />
              </div>
            </div>

            {/* Profile Section */}
            {isOpen && (
              <div className="px-4 py-4 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-lg">
                      {userData?.user?.name?.charAt(0) || "U"}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-md font-medium text-white truncate">
                      {userData?.user?.name || "User"}
                    </p>
                    <p className="text-xs text-white truncate">
                      {userData?.user?.email || "admin@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="flex-1 overflow-y-auto py-4">
              <ul className="px-3 space-y-1">
                {sidebarItems.map((item, index) => (
                  <li key={index} className="mb-1">
                    <div
                      className={`flex items-center py-2.5 px-3 rounded-lg transition-all duration-200 relative group cursor-pointer ${
                        activeTab === item.path
                          ? "bg-green-100 text-green-800 font-medium"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                      onClick={() => handleItemClick(item)}
                    >
                      {item.icon}
                      <span
                        className={`font-medium whitespace-nowrap transition-all duration-300 ms-3 ${
                          !isOpen && "opacity-0 w-0 overflow-hidden"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Logout Section */}
            <div className="border-t border-gray-100 px-4 py-4">
              <div
                onClick={logoutbutton}
                className="flex items-center py-2 px-3 rounded-lg cursor-pointer hover:bg-red-50 text-gray-700 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-50">
                  <img src={logout} alt="Logout" className="w-5 h-5" />
                </div>
                <span
                  className={`font-medium whitespace-nowrap transition-all duration-300 ms-3 ${
                    !isOpen && "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Log-out
                </span>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div
          className={`mx-auto transition-all duration-300 content-wrapper ${
            isOpen ? "lg:ml-[280px]" : "lg:ml-[80px]"
          }`}
        >
          {/* Top navbar */}
          <section className="sticky top-0 z-40 px-4 py-3 bg-white shadow-sm flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {!isOpen ? (
                  <Menu size={22} className="text-gray-600" />
                ) : (
                  <X size={22} className="text-gray-600" />
                )}
              </button>
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-800">
                  {location.pathname
                    .substring(1)
                    .replace(/-/g, " ")
                    .charAt(0)
                    .toUpperCase() +
                    location.pathname
                      .substring(1)
                      .replace(/-/g, " ")
                      .slice(1)
                      .toLowerCase() || "Dashboard"}
                </h2>
              </div>
            </div>
          </section>

          {/* Page content */}
          <div className="main-content">{children}</div>
        </div>
      </div>
    </>
  );
}

export default SideNav;
