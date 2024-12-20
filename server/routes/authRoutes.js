const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  test,
  registerUser,
  loginUser,
  getFullProfile,
  logoutUser,
  updateUserDetails,
  updatePayment,
  getPaymentMethod,
  createPartner,
  createStayListing,
  upload,
  createOfficeListing,
  createService,
  createRental,
  getListings,
  getListingData,
  likeProperty,
  checkLiked,
  verifyPaymentAndBook,
  getActiveListings,
  getInactiveListings,
  getUserBookings,
  getCurrentBookings,
  getCooffices,
  getCoOfficeData,
  verifyPaymentAndBookCooffice,
  getPickups,
  getPickupData,
  reserveAndBookPickup,
  getRentals,
  getRentalDetails,
  verifyPaymentAndBookRental,
  getNewsletter,
  getUserPreferences,
  updateUserPreferences,
  cancelBooking,
  getCurrentRentals,
  cancelRental,
  getCurrentPickups,
  cancelService,
  getCurrentOfficeSpaces,
  cancelOfficeSpace,
  getallActiveListings,
  getUpcomingBookings,
  getTotalEarnings,
  userComplaint,
  updatePartnerDetails,
  updatePayoutSettings,
  getPayoutSettings,
  getAllInactiveListings,
  getAllListings,
  updateStatus,
  getEndedBookings,
  getAllBookings,
  updatebookingstatus,
  loginPartner,
  verifyAccount,
  resetPassword,
  loginAdmin,
  getUpcomingBookingsGeneral,
  activeUsers,
  getallActiveListingsGeneral,
  getAllInactiveListingsGeneral,
  getAllListingsGeneral,
  getEndedBookingsGeneral,
  getAllBookingsGeneral,
  allUsers,
  getUsers,
  updateUserStatus,
  totalEarning,
  revenue,
  bookingStatus,
  bookingsOverTime,
  revenueByListing,
  userAnalytics,
  usersJoiningOverTime,
  bookingData,
  payoutDetails,
  uploadReceipt,
  uploadReceiptPickup,
  uploadReceiptOffice,
  uploadReceiptRental,
  getStayListing,
  updateListing,
  getServiceListing,
  updateService,
  getRentalListing,
  updateRental,
  getOfficeListing,
  updateOffice,
  Review,
  getReview,
  approveListing,
  verifyAccountPartner,
  MakePayout,
  UpdateActionStatus,
  PendingActions,
} = require("../controllers/authController");

router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.get("/", test);
router.post("/register", upload.single("gId"), registerUser);
router.post("/login", loginUser);
router.post("/resetpassword", resetPassword);
router.post("/verifyaccount", verifyAccount);
router.post("/verifyaccountpartner", verifyAccountPartner);
router.post("/loginpartner", loginPartner);
router.post("/loginadmin", loginAdmin);
router.get("/profile", getFullProfile);
router.get("/users", getUsers);
router.post("/logout", logoutUser);
router.post("/updateuserstatus", updateUserStatus);
router.put("/updateuser", updateUserDetails);
router.put("/updatebookingstatus", updatebookingstatus);
router.put("/updatepayoutsettings", updatePayoutSettings);
router.put("/updatepartnerdetails", updatePartnerDetails);
router.put("/updatepayment", updatePayment);
router.put("/update-action-status/:id", UpdateActionStatus);
router.get("/getlistings", getListings);
router.get("/pending-actions", PendingActions);
router.get("/getpickups", getPickups);
router.get("/activeusers", activeUsers);
router.get("/payoutdetails/:userId", payoutDetails);
router.get("/allusers", allUsers);
router.get("/revenue", revenue);
router.get("/bookingdata", bookingData);
router.get("/useranalytics", userAnalytics);
router.get("/userjoiningovertime", usersJoiningOverTime);
router.get("/bookingstatus", bookingStatus);
router.get("/bookingsovertime", bookingsOverTime);
router.get("/revenuebylisting", revenueByListing);
router.get("/getallbookings/:userId", getAllBookings);
router.get("/getallbookingsgeneral", getAllBookingsGeneral);
router.get("/getcooffices", getCooffices);
router.get("/getrentals", getRentals);
router.get("/getpayoutsettings", getPayoutSettings);
router.post("/subscribe", getNewsletter);
router.post("/complaints", userComplaint);
router.get("/preferences", getUserPreferences);
router.post("/updatepreferences", updateUserPreferences);
router.get("/listings/all/:ownerId", getAllListings);
router.get("/listings/general", getAllListingsGeneral);
router.get("/listings/inactive/:userId", getAllInactiveListings);
router.get("/listings/inactivegeneral", getAllInactiveListingsGeneral);
router.post("/likeproperty", likeProperty);
router.post("/updatestatus", updateStatus);
router.post("/submit-review", Review);
router.post("/makepayout", MakePayout);
router.post("/cancelbooking/:bookingId", cancelBooking);
router.post("/cancelofficespace/:bookingId", cancelOfficeSpace );
router.post("/cancelrental/:rentalId", cancelRental);
router.post("/cancelairportpickup/:bookingId", cancelService);
router.post("/verify_payment", verifyPaymentAndBook);
router.post("/verify_payment_cooffice", verifyPaymentAndBookCooffice);
router.post("/verify_payment_rental", verifyPaymentAndBookRental);
router.post("/verify_payment_service", reserveAndBookPickup);
router.get("/getlistingdata/:id", getListingData);
router.get("/getrentaldetails/:id", getRentalDetails);
router.get("/reviews/:userId/:bookingId/:listingId", getReview);
router.get("/getpickupdata/:id", getPickupData);
router.get("/activelistings/:userId", getallActiveListings);
router.get("/activelistingsgeneral", getallActiveListingsGeneral);
router.get("/allinactivelistings/:userId", getAllInactiveListings);
router.get("/earnings/:userId", getTotalEarnings);
router.get("/upcomingbookings/:userId", getUpcomingBookings);
router.get("/upcomingbookingsgeneral/", getUpcomingBookingsGeneral);
router.get("/endedbookings/:userId", getEndedBookings);
router.get("/endedbookingsgeneral", getEndedBookingsGeneral);
router.get("/getcoofficedata/:id", getCoOfficeData);
router.get("/userbookings/:userId", getUserBookings);
router.get("/getcurrentpickups/:userId", getCurrentPickups);
router.get("/getcurrentofficespaces/:userId", getCurrentOfficeSpaces);
router.get("/getcurrentbookings/:userId", getCurrentBookings);
router.get("/getcurrentrentals/:userId", getCurrentRentals);
router.get("/checkliked/:id", checkLiked);
router.get("/getlisting/:id", getStayListing);
router.get("/getservicelisting/:id", getServiceListing);
router.get("/getofficelisting/:id", getOfficeListing);
router.get("/getrentallisting/:id", getRentalListing);
router.get("/getpaymentmethod", getPaymentMethod);
router.post("/createpartner",  upload.single("gId"), createPartner);
router.post('/approveListing', approveListing);
router.post("/stayslisting", upload.array("images", 15), createStayListing);
router.put("/stayslisting/:id", upload.array("images", 15), updateListing);
router.post("/coofficelisting", upload.array("images", 15), createOfficeListing);
router.put("/coofficelisting/:id", upload.array("images", 15), updateOffice);
router.post("/airportpickuplisting", upload.array("images", 15), createService);
router.put("/airportpickuplisting/:id", upload.array("images", 15), updateService);
router.post("/carrentalslisting", upload.array("images", 15), createRental);
router.put("/carrentalslisting/:id", upload.array("images", 15), updateRental);
router.post("/uploadreceipt/:bookingId", upload.single("receipt"), uploadReceipt);
router.post("/uploadreceiptpickup/:bookingId", upload.single("receipt"), uploadReceiptPickup);
router.post("/uploadreceiptoffice/:bookingId", upload.single("receipt"), uploadReceiptOffice);
router.post("/uploadreceiptrental/:bookingId", upload.single("receipt"), uploadReceiptRental);
module.exports = router;
