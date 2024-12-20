import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { toast } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

export default function Editservice() {

  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [existingImages, setExistingImages] = useState([]);
  const [images, setImages] = useState({
    existing: [], 
    new: [], 
  });
  const id = new URLSearchParams(location.search).get("id");
  const [selectedImages, setSelectedImages] = useState([]);
  const fileInputRef = useRef(null);

  const [state, setState] = React.useState({
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
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== "partner") {
      navigate("/");
    } else if (id) {
      fetchListingData(id);
    }
  }, [user, loading, navigate, id]);
  const fetchListingData = async (listingId) => {
    try {
      const response = await axios.get(`/getservicelisting/${listingId}`);
      const data = response.data.serviceListing;
      setState({
        serviceName: data.serviceName, 
        description: data.description,
        carMakeModel: data.carMakeModel,
        carColor: data.carColor,
        plateNumber: data.plateNumber,
        driverName: data.driverName,
        driverLicenseNumber: data.driverLicenseNumber,
        driverPhoneNumber: data.driverPhoneNumber,
        driverEmail: data.driverEmail,
        pickupPrice: data.pickupPrice,
        extraLuggage: data.extraLuggage,
        waitingTime: data.waitingTime,
        availableFrom: data.availableFrom.slice(0, 10),
        availableTo: data.availableTo.slice(0, 10),
        cancellationPolicy: data.cancellationPolicy,
        refundPolicy: data.refundPolicy,
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        contactEmail: data.contactEmail,
      });

      setImages((prev) => ({
        ...prev,
        existing: data.images.map((img) => ({
          url: img.location,
          name: img.name,
        })),
      }));
    } catch (error) {
      toast.error("Failed to load listing data.");
    }
  };
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 8 * 1024 * 1024);

    if (validFiles.length < files.length) {
      toast.error("Some files exceed the 8MB size limit.");
    }

    if (images.existing.length + images.new.length + validFiles.length > 15) {
      toast.error("You can only upload up to 15 images.");
      return;
    }

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => ({
      ...prev,
      new: [...prev.new, ...newImages],
    }));

    e.target.value = "";
  };

  const handleImageRemove = (index, type) => {
    setImages((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));

    // If removing a new image, revoke its object URL
    if (type === "new" && images.new[index]?.preview) {
      URL.revokeObjectURL(images.new[index].preview);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState({
      ...state,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    // Append all form fields
    Object.keys(state).forEach((key) => {
      const value = state[key];
      formData.append(
        key,
        typeof value === "boolean" ? value.toString() : value
      );
    });

    // Append new images
    images.new.forEach((image) => {
      formData.append("images", image.file);
    });

    // Append existing image URLs - Modified to send each URL separately
    images.existing.forEach((image) => {
      formData.append("existingImages", image.url); // Changed from existingImages[] to existingImages
    });

    try {
      const response = await axios.put(`/airportpickuplisting/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(
        error.response?.data?.error || "An error occurred. Please try again."
      );
    }
  };

  return (
    <>
      <div className="shade_2">
        <h1>Our vendor</h1>
        <img
          src="/assets/linear_bg.png"
          className="shade_bg"
          alt="Background pattern"
        />
        <div className="shade_item">
          <img src="/assets/bg (2).png" alt="Partner image 1" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (1).png" alt="Partner image 2" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (4).png" alt="Partner image 3" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (3).png" alt="Partner image 4" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <section className="form_area_6">
          <div className="list_holder">
            <div className="list_1">
              <h2 className="support_text">Add images</h2>
              <br />
              <div className="box_of_media" onClick={triggerFileInput}>
                <div>
                  <h3>
                    Upload media <i className="bx bx-plus" />
                  </h3>
                  <p>
                    Upload up to 15 images, and minimum of 4 images. 8MB Max per
                    image.
                  </p>
                </div>
              </div>
              <div className="image_preview">
                {images.existing.map((image, index) => (
                  <div key={`existing-${index}`} className="image_container">
                    <img
                      src={`https://smashapartments.com/uploads/${image.name}`}
                      alt={`existing preview ${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index, "existing")}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                {images.new.map((image, index) => (
                  <div key={`new-${index}`} className="image_container">
                    <img src={image.preview} alt={`new preview ${index}`} />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index, "new")}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: "none" }}
              />
            </div>
            <div className="list_2 v85">
              <h2 className="support_text">Add information</h2>
              <br />
              <div className="form">
                <h3>Basic information</h3>
                <br />
                <label htmlFor="service-name">Service name</label>
                <br />
                <input
                  id="service-name"
                  className="input"
                  type="text"
                  placeholder="Service name"
                  name="serviceName"
                  value={state.serviceName}
                  onChange={handleChange}
                />
                <br />
                <label htmlFor="description">Description</label>
                <br />
                <textarea
                  id="description"
                  placeholder="Enter description"
                  name="description"
                  value={state.description}
                  onChange={handleChange}
                />
                <div className="line" />
                <div className="form">
                  <h3>Vehicle details</h3>
                  <br />
                  <label htmlFor="car-make-model">Car make and model</label>
                  <br />
                  <input
                    id="car-make-model"
                    className="input"
                    type="text"
                    placeholder="Car make and model"
                    name="carMakeModel"
                    value={state.carMakeModel}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="car-color">Car color</label>
                  <br />
                  <input
                    id="car-color"
                    className="input"
                    type="text"
                    placeholder="Car color"
                    name="carColor"
                    value={state.carColor}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="plate-number">Plate number</label>
                  <br />
                  <input
                    id="plate-number"
                    className="input"
                    type="text"
                    placeholder="Plate number"
                    name="plateNumber"
                    value={state.plateNumber}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="driver-name">Driver's name</label>
                  <br />
                  <input
                    id="driver-name"
                    className="input"
                    type="text"
                    placeholder="Driver's name"
                    name="driverName"
                    value={state.driverName}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="driver-license-number">
                    Driver's license number
                  </label>
                  <br />
                  <input
                    id="driver-license-number"
                    className="input"
                    type="text"
                    placeholder="Driver's license number"
                    name="driverLicenseNumber"
                    value={state.driverLicenseNumber}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="driver-phone-number">
                    Driver's phone number
                  </label>
                  <br />
                  <input
                    id="driver-phone-number"
                    className="input"
                    type="tel"
                    placeholder="Driver's phone number"
                    name="driverPhoneNumber"
                    value={state.driverPhoneNumber}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="driver-email">Driver's email address</label>
                  <br />
                  <input
                    id="driver-email"
                    className="input"
                    type="email"
                    placeholder="Driver's email address"
                    name="driverEmail"
                    value={state.driverEmail}
                    onChange={handleChange}
                  />
                  <br />
                  <h3>Pricing</h3>
                  <br />
                  <div className="line" />
                  <label htmlFor="pickup-price">Pickup price</label>
                  <br />
                  <input
                    id="pickup-price"
                    className="input"
                    type="number"
                    placeholder="Pickup price"
                    name="pickupPrice"
                    value={state.pickupPrice}
                    onChange={handleChange}
                  />
                  <br />
                  <h3>Additional details</h3>
                  <br />
                  <label htmlFor="extra-luggage">Extra luggage</label>
                  <br />
                  <input
                    id="extra-luggage"
                    className="input"
                    type="number"
                    placeholder="Enter amount"
                    name="extraLuggage"
                    value={state.extraLuggage}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="waiting-time">Waiting </label>
                  <br />
                  <input
                    id="waiting-time"
                    className="input"
                    type="number"
                    placeholder="Enter amount"
                    name="waitingTime"
                    value={state.waitingTime}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="available-from">Available from</label>
                  <br />
                  <input
                    id="available-from"
                    required
                    className="input"
                    type="date"
                    name="availableFrom"
                    value={state.availableFrom}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="available-to">To</label>
                  <br />
                  <input
                    id="available-to"
                    required
                    className="input"
                    type="date"
                    name="availableTo"
                    value={state.availableTo}
                    onChange={handleChange}
                  />
                  <br />
                  <div className="line" />
                  <h3>Policies</h3>
                  <br />
                  <label htmlFor="cancellation-policy">
                    Cancellation policy
                  </label>
                  <br />
                  <textarea
                    id="cancellation-policy"
                    placeholder="Cancellation policy"
                    name="cancellationPolicy"
                    value={state.cancellationPolicy}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="refund-policy">Refund policy</label>
                  <br />
                  <textarea
                    id="refund-policy"
                    placeholder="Refund policy"
                    name="refundPolicy"
                    value={state.refundPolicy}
                    onChange={handleChange}
                  />
                  <div className="line" />
                  <h3>Contact information</h3>
                  <br />
                  <label htmlFor="contact-name">Name</label>
                  <br />
                  <input
                    id="contact-name"
                    className="input"
                    type="text"
                    placeholder="Name"
                    name="contactName"
                    value={state.contactName}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="contact-phone">Phone</label>
                  <br />
                  <input
                    id="contact-phone"
                    className="input"
                    type="tel"
                    placeholder="Phone"
                    name="contactPhone"
                    value={state.contactPhone}
                    onChange={handleChange}
                  />
                  <br />
                  <label htmlFor="contact-email">Email</label>
                  <br />
                  <input
                    id="contact-email"
                    className="input"
                    type="email"
                    placeholder="Email"
                    name="contactEmail"
                    value={state.contactEmail}
                    onChange={handleChange}
                  />
                  <br />
                  <div className="button b2" onClick={handleSubmit}>
                    Add listing
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
}
