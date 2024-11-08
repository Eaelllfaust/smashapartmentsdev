import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CreateDetails() {
  const { state } = useLocation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
      } else {
        const response = await axios.post("/register", {
          email,
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
          <div className="div">
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
            <label htmlFor="phone">Phone number</label>
            <br />
            <input
              type="text"
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
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
          </div>
        </section>
      </>
    </div>
  );
}
