import React, { useEffect, useState, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ReserveRental() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [rental, setRentalDetails] = useState(null);
  const [withDriver, setWithDriver] = useState("no");
  const [pickupLocation, setPickupLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [insuranceAmount, setInsuranceAmount] = useState(0);
  const [fuelAmount, setFuelAmount] = useState(0);
  const [commission, setCommission] = useState(0);
  const [vat, setVAT] = useState(0);
  const [waitingTimeFee, setWaitingTimeFee] = useState(500); // example waiting time fee
  const { user } = useContext(UserContext);
  const [basePrice, setBasePrice] = useState(0);

  const VAT_RATE = 0.075; // 7.5%
  const COMMISSION_RATE = 0.1; // 10%

  const rentalId = searchParams.get("id");

  useEffect(() => {
    const fetchRentalDetails = async () => {
      try {
        const response = await axios.get(`/getrentaldetails/${rentalId}`);
        setRentalDetails(response.data);
        setInsuranceAmount(response.data.insurance || 0);
        setFuelAmount(response.data.fuel || 0);
      } catch (error) {
        console.error("Error fetching rental details:", error);
        toast.error("Failed to load rental details. Please try again later.");
      }
    };

    if (rentalId) {
      fetchRentalDetails();
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v2/inline.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [rentalId]);

  useEffect(() => {
    if (rental && pickupDate && pickupTime) {
      const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
      const availableFromDate = new Date(rental.availableFrom);
      const availableToDate = new Date(rental.availableTo);

      if (
        selectedDateTime < availableFromDate ||
        selectedDateTime > availableToDate
      ) {
        toast.error(
          "Selected date and time are not within the available range."
        );
        return;
      }

      let calculatedBasePrice = parseFloat(rental.rentalPrice) || 0;
      let insurance = parseFloat(insuranceAmount) || 0;
      let fuel = parseFloat(fuelAmount) || 0;

      // Calculate discount
      let discount = 0;
      if (rental.discount_percentage) {
        discount =
          (calculatedBasePrice + insurance + fuel) *
          (parseFloat(rental.discount_percentage) / 100);
      }

      // Price with discount
      const priceWithDiscount =
        calculatedBasePrice + insurance + fuel - discount;

      // Calculate VAT and commission
      const calculatedVat = priceWithDiscount * 0.075; // 7.5% VAT
      const calculatedCommission = priceWithDiscount * 0.1; // 10% commission

      // Final price with VAT and commission
      const finalPrice =
        priceWithDiscount + calculatedVat + calculatedCommission;

      // Update state with calculated values
      setBasePrice(calculatedBasePrice);
      setDiscountAmount(discount);
      setVAT(calculatedVat);
      setCommission(calculatedCommission);
      setTotalPrice(finalPrice);
    }
  }, [rental, pickupDate, pickupTime, withDriver, insuranceAmount, fuelAmount]);

  const handlePayment = () => {
    if (!user) {
      toast.error("Please create an account or sign in to continue.");
      return;
    }

    if (user.interface !== "user") {
      toast.error("Please signin as a customer to continue.");
      return;
    }

    if (!pickupLocation || !pickupDate || !pickupTime || !dropoffLocation) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    if (!rental) {
      toast.error("Rental details are not available. Please try again.");
      return;
    }

    const selectedDateTime = new Date(`${pickupDate}T${pickupTime}`);
    const availableFromDate = new Date(rental.availableFrom);
    const availableToDate = new Date(rental.availableTo);

    if (
      selectedDateTime < availableFromDate ||
      selectedDateTime > availableToDate
    ) {
      toast.error("This listing is not available on the selected date.");
      return;
    }

    const paystack = new window.PaystackPop();
    paystack.newTransaction({
      key: "pk_test_aa805fbdf79594d452dd669b02148a98482bae70",
      amount: Math.round(totalPrice * 100),
      email: user.email,
      onSuccess: (transaction) => {
        verifyPaymentAndBook(transaction.reference);
      },
      onCancel: () => {
        toast.error("Payment cancelled. Please try again.");
      },
    });
  };

  const verifyPaymentAndBook = async (reference) => {
    try {
      const response = await axios.post("/verify_payment_rental", {
        reference,
        rentalId,
        withDriver: withDriver === "true",
        pickupLocation,
        pickupDate,
        pickupTime,
        dropoffLocation,
        totalPrice,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        navigate("/user");
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying payment and creating booking:", error);
      toast.error(
        error.response?.data?.error ||
          "An error occurred. Please try again later."
      );
    }
  };
  return (
    <>
      <div className="shade_2 df">
        <h1>Search for car rentals</h1>
        <p>From budget cars to luxury vehicles and everything in between</p>
        <img
          src="/assets/linear_bg.png"
          className="shade_bg"
          alt="Background"
        />
        <div className="shade_item">
          <img src="/assets/bg (2).png" alt="Shade Item 1" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (1).png" alt="Shade Item 2" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (4).png" alt="Shade Item 3" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (3).png" alt="Shade Item 4" />
        </div>
      </div>
      <section className="majestic mml">
        <div className="col_3">
          {rental && (
            <div className="listings_list">
              <div className="list_node">
                <div className="list_1">
                  <img
                    src={
                      rental.images?.[0]?.url
                        ? `https://smashapartments.com/uploads/${rental.images[0].media_name}`
                        : "/assets/bg (3).png"
                    }
                    alt={rental.carNameModel || "Car Rental Image"}
                  />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{rental.carNameModel}</h2>
                        <div className="star_holder">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`bx bx-star ${
                                i < Math.floor(rental.averageRating || 0)
                                  ? "bxs-star"
                                  : ""
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {rental.driverName}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div className="n94">
                        <h3>
                          {rental.averageRating >= 4.5 ? "Excellent" : "Good"}
                        </h3>
                        <h3>
                          {rental.reviewCount
                            ? `${rental.reviewCount} reviews`
                            : "No reviews"}
                        </h3>
                      </div>
                      <div
                        className="rating_cont"
                        style={{
                          marginLeft: 10,
                          maxWidth: "50px !important",
                          minWidth: "100px !important",
                        }}
                      >
                        {rental.averageRating || "N/A"}{" "}
                        <i className="bx bxs-star"></i>
                      </div>
                    </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>{rental.carType}</h3>
                      <p>{rental.description}</p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>{rental.discount || "0"}% discounted</div>
                        <div>Pricing</div>
                      </div>
                      <div className="amount_main">
                        <h1>NGN {rental.rentalPrice?.toLocaleString()}</h1>
                      </div>
                      <div className="o33">
                        <div>Includes taxes</div>
                      </div>
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="info_row">
            <div className="l54">
              <div>
                <h3>Email</h3>
                <p>{rental?.contactEmail}</p>
              </div>
              <div>
                <h3>Phone</h3>
                <p>{rental?.contactPhone}</p>
              </div>
            </div>
          </div>
          <br />
          <div className="detail">
            <h2>Confirm booking details</h2>
            <br />
            <div className="form h89">
              <label htmlFor="withDriver">With driver</label>
              <select
                id="withDriver"
                value={withDriver}
                onChange={(e) => setWithDriver(e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="form h89">
              <label htmlFor="pickupLocation">Pickup location</label>
              <input
                type="text"
                id="pickupLocation"
                placeholder="Pickup location"
                className="input"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
              />
            </div>
            <div className="form h89">
              <label htmlFor="pickupDate">Pickup date</label>
              <input
                type="date"
                id="pickupDate"
                className="input"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </div>
            <div className="form h89">
              <label htmlFor="pickupTime">Pickup time</label>
              <input
                type="time"
                id="pickupTime"
                className="input"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              />
            </div>
            <div className="form h89">
              <label htmlFor="dropoffLocation">Drop off location</label>
              <input
                type="text"
                id="dropoffLocation"
                placeholder="Drop off location"
                className="input"
                value={dropoffLocation}
                onChange={(e) => setDropoffLocation(e.target.value)}
              />
            </div>
            <br />
            <div className="l54">
              <div>
                <h3>Checking availability</h3>
                <p className="checking">
                  {rental
                    ? new Date(pickupDate) >= new Date(rental.availableFrom) &&
                      new Date(pickupDate) <= new Date(rental.availableTo)
                      ? "Available"
                      : "Not available for selected dates"
                    : "Checking..."}
                </p>
              </div>
            </div>
            <br />
            <h2>Your price summary</h2>
            <br />
            <div className="l02">
              <div className="l02_1">
                <div>Base Price</div>
                <div>NGN {basePrice.toLocaleString()}</div>
              </div>
              <div className="l02_1">
                <div>Discount</div>
                <div>NGN {(discountAmount || 0).toLocaleString()}</div>
              </div>
              {insuranceAmount > 0 && (
                <div className="l02_1">
                  <div>Insurance</div>
                  <div>NGN {(insuranceAmount || 0).toLocaleString()}</div>
                </div>
              )}
              {fuelAmount > 0 && (
                <div className="l02_1">
                  <div>Fuel</div>
                  <div>NGN {(fuelAmount || 0).toLocaleString()}</div>
                </div>
              )}
              <div className="l02_1">
                <div>VAT (7.5%)</div>
                <div>NGN {vat.toLocaleString()}</div>
              </div>
              <div className="l02_1">
                <div>Commission (10%)</div>
                <div>NGN {commission.toLocaleString()}</div>
              </div>
            </div>
            <h2>Total</h2>
            <br />
            <h2 className="sum">NGN {(totalPrice || 0).toLocaleString()}</h2>
            <br />
            <div className="button b3 b2" onClick={handlePayment}>
              Make payment
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
