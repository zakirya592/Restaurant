import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Image,
} from "@nextui-org/react";

function AddCategory({ isOpen, onClose }) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewCategoryImage(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleClose = () => {
    setNewCategoryName("");
    setNewCategoryImage(null);
    setImagePreview(null);
    onClose();
  };

  const handleAddCategory = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newCategoryName);
      formData.append("image", newCategoryImage);

    //   await createCategory(formData).unwrap();
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleClose}
      placement="top-center"
      classNames={{
        base: "max-w-md",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Add New Category
            </ModalHeader>
            <ModalBody>
              <Input
                variant="faded"
                labelPlacement="outside"
                label="Category Name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                classNames={{
                  label: "text-lg font-medium text-gray-700",
                  inputWrapper:
                    "shadow-md hover:shadow-lg transition-shadow duration-200 py-5",
                }}
              />
              <Input
                variant="faded"
                labelPlacement="outside"
                type="file"
                label="Category Image"
                onChange={handleImageChange}
                accept="image/*"
                classNames={{
                  label: "text-lg font-medium text-gray-700",
                  inputWrapper:
                    "shadow-md hover:shadow-lg transition-shadow duration-200 mt-5",
                }}
              />
              {imagePreview && (
                <div className="mt-2">
                  <Image
                    src={imagePreview}
                    alt="Category preview"
                    className="max-w-full h-auto rounded-lg"
                    width={200}
                  />
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={handleClose}
                className="hover:bg-danger-100"
              >
                Cancel
              </Button>
              <Button
                // isLoading={isLoading}
                color="primary"
                onPress={handleAddCategory}
                // className="bg-navy-600 text-white hover:bg-navy-700"
                isDisabled={!newCategoryName}
              >
                Add Category
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

export default AddCategory;
