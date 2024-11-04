import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Editservice() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [selectedImages, setSelectedImages] = useState([]);
  const [state, setState] = useState({
    serviceName: "",
    description: "",
    carMakeModel: "",
    carColor: "",
    plateNumber: "",
    driverName: "",
    driverLicenseNumber: "",
    driverPhoneNumber: "",
    driverEmail: "",
    pickupPrice: "",
    extraLuggage: "",
    waitingTime: "",
    availableFrom: "",
    availableTo: "",
    cancellationPolicy: "",
    refundPolicy: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  useEffect(() => {
    if (!loading && (!user || user.interface !== "partner")) {
      navigate("/signin");
    }
  }, [user, loading, navigate]);

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files).filter(file => file.size <= 5 * 1024 * 1024);
    if (selectedImages.length + files.length > 5) {
      toast.warn("You can only upload up to 5 images.");
    } else {
      setSelectedImages(prev => [...prev, ...files]);
    }
    e.target.value = "";
  };

  const handleImageRemove = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields dynamically
    const requiredFields = [
      "serviceName", "description", "carMakeModel", "carColor", "plateNumber", 
      "driverName", "driverLicenseNumber", "driverPhoneNumber", "driverEmail", 
      "pickupPrice", "availableFrom", "availableTo", "cancellationPolicy", 
      "refundPolicy", "contactName", "contactPhone", "contactEmail"
    ];

    for (let field of requiredFields) {
      if (!state[field]) {
        toast.error(`${field.replace(/([A-Z])/g, " $1")} is required.`);
        return;
      }
    }

    const formData = new FormData();
    Object.entries(state).forEach(([key, value]) => {
      formData.append(key, typeof value === "boolean" ? value.toString() : value);
    });
    selectedImages.forEach(image => formData.append("images", image));

    try {
      const response = await axios.post("/airportpickuplisting", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.error) {
        toast.error(response.data.details);
      } else {
        toast.success(response.data.message);
        navigate("/partner/managelistings/");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "An error occurred. Please try again.");
      if (error.response?.data?.details) {
        error.response.data.details.forEach(detail => toast.error(detail));
      }
    }
  };

  return (
    <div>
      <h2>Hello {user?.first_name}</h2>
      <form onSubmit={handleSubmit} className="form_area_6">
        {/* Image Upload Section */}
        <section className="list_1">
          <h2>Add images</h2>
          <div className="box_of_media" onClick={() => fileInputRef.current.click()}>
            <h3>Upload media</h3>
            <p>Upload up to 5 images. Max 8MB per image.</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            multiple 
            onChange={handleImageSelect} 
            style={{ display: "none" }} 
          />
          <div className="image_preview">
            {selectedImages.map((image, index) => (
              <div key={index} className="image_container">
                <img src={URL.createObjectURL(image)} alt={`Preview ${index + 1}`} />
                <button type="button" className="remove-btn" onClick={() => handleImageRemove(index)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Information Section */}
        <section className="list_2">
          <h2>Add information</h2>
          <label>
            Service name
            <input type="text" name="serviceName" value={state.serviceName} onChange={handleChange} />
          </label>
          <label>
            Description
            <textarea name="description" value={state.description} onChange={handleChange} />
          </label>
          
          {/* Repeat similar pattern for each input field */}
          
          <button type="submit">Submit</button>
        </section>
      </form>
    </div>
  );
}
