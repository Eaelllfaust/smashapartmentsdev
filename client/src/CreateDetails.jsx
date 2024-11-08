import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateDetails() {
  const { state } = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [DOB, setDOB] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log("Selected file:", file);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
      } else {
        const response = await axios.post("/register", {
          email,
          firstName,
          lastName,
          phoneNumber,
          DOB,
          gID,
          password,
        });

        if (response.data.error) {
          toast.error(response.data.error);
        } else {
          setPassword("");
          setConfirmPassword("");
          toast.success("Check email for verification code");
          navigate("/authme");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <>
        <div className="shade_2 df">
          <h1>Create account</h1>
          <img src="assets/linear_bg.png" className="shade_bg" alt="" />
          <div className="shade_item">
            <img src="assets/bg (2).png" alt="" />
          </div>
          <div className="shade_item">
            <img src="assets/bg (1).png" alt="" />
          </div>
          <div className="shade_item">
            <img src="assets/bg (4).png" alt="" />
          </div>
          <div className="shade_item">
            <img src="assets/bg (3).png" alt="" />
          </div>
        </div>
        <section className="form_area">
          <form className="div" onSubmit={handleSubmit}>
            <h2>Contact details</h2>
            <br />
            <p>
              Your full name, phone number and an offical document are needed to
              ensure the security of your Smash apartments account.
            </p>
            <br />
            <label htmlFor="firstname">First name</label>
            <br />
            <input
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br />
            <label htmlFor="lastname">Last name</label>
            <br />
            <input
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <br />
            <label htmlFor="dob">Date of birth</label>
            <br />
            <input
              type="date"
              placeholder="Date of birth"
              value={DOB}
              onChange={(e) => setDOB(e.target.value)}
            />
            <br />
            <label htmlFor="phone">Phone number</label>
            <br />
            <input
              type="text"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <br />
            <br />
            <label htmlFor="ID">Government issued ID</label>
            <br />
            <div
              onClick={() => document.getElementById("fileInput").click()}
              style={{
                cursor: "pointer",
                padding: "10px",
                backgroundColor: "#f89820",
                color: "white",
                borderRadius: "5px",
                textAlign: "center",
                width: "150px",
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              Upload ID
            </div>

            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {selectedFile && <p>Selected file: {selectedFile.name}</p>}
            <br />
            <label htmlFor="password">Password</label>
            <br />
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            <br />
            <label htmlFor="confirm">Confirm password</label>
            <br />
            <input
              type="password"
              id="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
            <br />
            <button type="submit" className="button_5 stick">
              Create account
            </button>
            <br />
            <p className="legal_text">
              By signing in or creating an account, you agree with
              our&nbsp;Terms &amp; Conditions&nbsp;and&nbsp;Privacy Statement
            </p>
          </form>
        </section>
      </>
    </div>
  );
}
