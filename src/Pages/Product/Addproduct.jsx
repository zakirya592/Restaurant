
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import SideNav from "../../components/Sidebar/SideNav";
import Spinner from "../../components/spinner/spinner";
import { baseUrl } from "../../utils/config";
import { Input } from '@nextui-org/react';
import { Select, SelectItem, Textarea, Image } from "@heroui/react";

const Addproduct = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [productname, setproductname] = useState("");
  const [ticket, setTicket] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setNewCategoryImage(file);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      }
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const patientData = {
      name: productname,
    };

    try {
      const response = await axios.post(`${baseUrl}/api/v2/patients`, patientData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        const { data } = response.data;
        setTicket(`${baseUrl}/${data.ticket}`);
        setPdfUrl(data.ticket);
        const pdfResponse = await axios.get(`${baseUrl}/${data.ticket}`, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(pdfResponse.data);
        setPdfBlobUrl(blobUrl);
        setShowPopup(true);
        toast.success("Successfully submitted product data!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const printTicket = () => {
    const iframe = document.getElementById('pdfFrame');
    if (iframe) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!patientId) {
      toast.error("Please search for a product first");
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: productname,
      };

      const response = await axios.post(
        `${baseUrl}/api/v2/patients/re-register/${patientId}`,
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        const { data } = response.data;
        setTicket(`${baseUrl}/${data.ticket}`);
        setPdfUrl(data.ticket);
        const pdfResponse = await axios.get(`${baseUrl}/${data.ticket}`, { responseType: 'blob' });
        const blobUrl = URL.createObjectURL(pdfResponse.data);
        setPdfBlobUrl(blobUrl);
        setShowPopup(true);
        toast.success("product updated successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating product");
    } finally {
      setLoading(false);
    }
  };

  const Productypes = [
    { key: "cat", label: "Cat" },
    { key: "dog", label: "Dog" },
    { key: "elephant", label: "Elephant" },
    { key: "lion", label: "Lion" },
  ];

   const Producsize = [
     { key: "sm", label: "Small" },
     { key: "md", label: "Medium" },
     { key: "lg", label: "Large" },
     { key: "xl", label: "Extra Large" },
   ];

  return (
    <div className="bg-gray-100">
      <SideNav>
        <div className="min-h-screen flex flex-col antialiased bg-white text-black">
          <div className="container mx-auto p-6">
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h5 className="text-green-600 text-2xl font-bold mb-6">
                Add Product
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Product Name */}
                <Input
                  isRequired
                  variant="faded"
                  label="Product Name"
                  labelPlacement="outside"
                  placeholder="Enter Product Name"
                  type="text"
                  classNames={{
                    label: "text-lg font-medium text-gray-700",
                    inputWrapper:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                  }}
                  value={productname}
                  onChange={(e) => setproductname(e.target.value)}
                />

                <Input
                  label="Price"
                  isRequired
                  variant="faded"
                  labelPlacement="outside"
                  placeholder="0.00"
                  startContent={
                    <div className="pointer-events-none flex items-center">
                      <span className="text-default-400 text-small">Rs</span>
                    </div>
                  }
                  classNames={{
                    label: "text-lg font-medium text-gray-700",
                    inputWrapper:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                  }}
                  type="number"
                />

                <Select
                  //   className="max-w-xs"
                  items={Productypes}
                  isRequired
                  variant="faded"
                  labelPlacement="outside"
                  label="Product Types "
                  placeholder="Select an Product Types"
                  classNames={{
                    label: "text-lg font-medium text-gray-700",
                    trigger:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                  }}
                >
                  {(Productypes) => (
                    <SelectItem>{Productypes.label}</SelectItem>
                  )}
                </Select>

                <Select
                  //   className="max-w-xs"
                  items={Producsize}
                  isRequired
                  variant="faded"
                  labelPlacement="outside"
                  label="Product Size "
                  placeholder="Select an Product Size"
                  classNames={{
                    label: "text-lg font-medium text-gray-700",
                    trigger:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                  }}
                >
                  {(Producsize) => <SelectItem>{Producsize.label}</SelectItem>}
                </Select>

                <Textarea
                  label="Description"
                  labelPlacement="outside"
                  variant="faded"
                  placeholder="Enter your description"
                  isClearable
                  className="col-span-2"
                  classNames={{
                    inputWrapper:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                    label: "text-lg font-medium text-gray-700",
                  }}
                />

                <Input
                  type="file"
                  label="Image"
                  variant="faded"
                  labelPlacement="outside"
                  onChange={handleImageChange}
                  accept="image/*"
                  classNames={{
                    inputWrapper:
                      "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                    label: "text-lg font-medium text-gray-700",
                  }}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <Image
                      src={imagePreview}
                      alt="Category preview"
                      className="max-w-full max-h-full rounded-lg object-cover"
                      width={200}
                      height={250}
                    />
                  </div>
                )}
              </div>
              <div className="flex justify-between mt-6">
                <button
                  className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                  onClick={() => navigate(-1)}
                >
                  {t("Close")}
                </button>
                {patientId ? (
                  <button
                    onClick={handleUpdate}
                    type="button"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                  >
                    {t("Print Ticket")}
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
                  >
                    {t("Add")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </SideNav>
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold">Ticket Information</h2>
            {pdfBlobUrl ? (
              <iframe
                src={pdfBlobUrl}
                width="100%"
                height="600px"
                title="PDF Document"
                id="pdfFrame"
              />
            ) : (
              <p>No PDF available</p>
            )}
            <button
              onClick={closePopup}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
            <button
              onClick={printTicket}
              className="mt-4 ml-40 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Print
            </button>
          </div>
        </div>
      )}
      {loading && <Spinner />}
    </div>
  );
};

export default Addproduct;
