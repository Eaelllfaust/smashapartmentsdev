import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import axios from "axios";
import { confirmAlert } from "react-confirm-alert"; 
import "react-confirm-alert/src/react-confirm-alert.css"; 
import { toast } from "react-toastify";
export default function ManageListings() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeListings, setActiveListings] = useState([]);
  const [inactiveListings, setInactiveListings] = useState([]);
  const [activeListingsNum, setActiveListingsNum] = useState(0);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/signin");
    } else if (user.interface !== "partner") {
      navigate("/");
    } else {
      const fetchActiveListingsNum = async () => {
        try {
          const response = await axios.get(`/activelistings/${user._id}`);
          setActiveListingsNum(response.data.totalActiveListings);
        } catch (error) {
          console.error("Error fetching active listings", error);
        }
      };
      fetchActiveListingsNum();

      const fetchListings = async () => {
        try {
          const activeResponse = await axios.get(`/listings/all/${user._id}`);
          const inactiveResponse = await axios.get(
            `/listings/inactive/${user._id}`
          );

          setActiveListings(activeResponse.data);
          setInactiveListings(inactiveResponse.data.totalInactiveListings);
        } catch (error) {
          console.error("Error fetching listings:", error);
        }
      };

      fetchListings();
    }
  }, [user, loading, navigate]);

  const handleStatusChange = async (listingType, listingId, event) => {
    const newStatus = event.target.value;
  
    confirmAlert({
      title: 'Confirm Status Change',
      message: `Are you sure you want to set this listing to ${newStatus}?`,
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              await axios.post('/updatestatus', {
                type: listingType,
                id: listingId,
                status: newStatus
              });
              toast.success('Status updated successfully');
  
            } catch (error) {
              console.error("Error updating status", error);
              toast.error('Failed to update status. Please try again.');
            }
          }
        },
        {
          label: 'No',
          onClick: () => {
          },
          className: "noButtonStyle",
        }
      ]
    });
  };
  
  return (
    <>
      <div className="shade_2">
        <h1>Our vendor</h1>
        <img src="/assets/linear_bg.png" className="shade_bg" alt="" />
        <div className="shade_item">
          <img src="/assets/bg (2).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (1).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (4).png" alt="" />
        </div>
        <div className="shade_item">
          <img src="/assets/bg (3).png" alt="" />
        </div>
      </div>
      <section className="holder">
        <div className="intro">
          <h2>Hello {user && <span>{user.first_name}</span>}</h2>
          <p>Manage your booking experience</p>
        </div>
        <div className="intro_box">
          <div className="ibox">
            <div className="i2">
              <h2>{activeListingsNum} active listings</h2>
              <img src="/assets/check.svg" alt="" />
            </div>
            <p>This is the number of active listings you have.</p>
          </div>
          <div className="ibox">
            <div className="i2">
              <h2>{inactiveListings} total inactive listings</h2>
              <img src="/assets/time.svg" alt="" />
            </div>
            <p>This is the number of inactive listings.</p>
          </div>
        </div>
        <div className="entry_1">
          <h2>Add to your listings</h2>
          <Link to="addlisting">
            <div className="new_btn_8">
              Add new <i className="bx bx-plus add_listing" />
            </div>
          </Link>
        </div>
        <br />
        <br />
        {activeListings.map((listing) => {
          if (listing.type === "stay") {
            return (
              <div className="row_item stay" key={listing._id}>
                <img
                  src={`https://smashapartments.com/uploads/${listing.images[0].media_name}`}
                  alt="Stay"
                />
                <div>{listing.property_name}</div>
                <div>{listing.city}</div>
                <div>{listing.type}</div>
                <div>NGN {listing.price_per_night.toLocaleString()}</div>
                <span
                  className={`select appr ${
                    listing.approved ? "approved" : ""
                  }`}
                  onClick={
                    !listing.approved
                      ? () => handleApprove(listing.type, listing._id)
                      : undefined
                  }
                >
                  {listing.approved ? "Approved" : "Awaiting approval"}
                </span>
                <select
                  className="select"
                  onChange={(event) =>
                    handleStatusChange(listing.type, listing._id, event)
                  }
                  defaultValue={listing.status}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                <Link to={`editlisting/editstays?id=${listing._id}`} className="select edit">Edit</Link>
              </div>
            );
          } else if (listing.type === "rental") {
            return (
              <div className="row_item rental" key={listing._id}>
                <img
                  src={`https://smashapartments.com/uploads/${listing.images[0].media_name}`}
                  alt="Rental"
                />
                <div>{listing.carNameModel}</div>
                <div>{listing.carType}</div>
                <div>{listing.type}</div>
                <div>NGN {listing.rentalPrice.toLocaleString()}</div>
                <span
                  className={`select appr ${
                    listing.approved ? "approved" : ""
                  }`}
                  onClick={
                    !listing.approved
                      ? () => handleApprove(listing.type, listing._id)
                      : undefined
                  }
                >
                  {listing.approved ? "Approved" : "Awaiting approval"}
                </span>
                <select
                  className="select"
                  onChange={(event) =>
                    handleStatusChange(listing.type, listing._id, event)
                  }
                  defaultValue={listing.status}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                <Link to={`editlisting/editrental?id=${listing._id}`} className="select edit">Edit</Link>
              </div>
            );
          } else if (listing.type === "office") {
            return (
              <div className="row_item office" key={listing._id}>
                <img
                  src={`https://smashapartments.com/uploads/${listing.images[0].media_name}`}
                  alt="Office"
                />
                <div>{listing.office_space_name}</div>
                <div>{listing.city}</div>
                <div>{listing.type}</div>
                <div>NGN {listing.price_per_day.toLocaleString()}</div>
                <span
                  className={`select appr ${
                    listing.approved ? "approved" : ""
                  }`}
                  onClick={
                    !listing.approved
                      ? () => handleApprove(listing.type, listing._id)
                      : undefined
                  }
                >
                  {listing.approved ? "Approved" : "Awaiting approval"}
                </span>
                <select
                  className="select"
                  onChange={(event) =>
                    handleStatusChange(listing.type, listing._id, event)
                  }
                  defaultValue={listing.status}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                <Link to={`editlisting/editoffice?id=${listing._id}`} className="select edit">Edit</Link>
              </div>
            );
          } else if (listing.type === "service") {
            return (
              <div className="row_item service" key={listing._id}>
                <img
                  src={`https://smashapartments.com/uploads/${listing.images[0].media_name}`}
                  alt="Service"
                />
                <div>{listing.serviceName}</div>
                <div>{listing.carMakeModel}</div>
                <div>{listing.type}</div>
                <div>NGN {listing.pickupPrice.toLocaleString()}</div>
                <span
                  className={`select appr ${
                    listing.approved ? "approved" : ""
                  }`}
                  onClick={
                    !listing.approved
                      ? () => handleApprove(listing.type, listing._id)
                      : undefined
                  }
                >
                  {listing.approved ? "Approved" : "Awaiting approval"}
                </span>
                <select
                  className="select"
                  onChange={(event) =>
                    handleStatusChange(listing.type, listing._id, event)
                  }
                  defaultValue={listing.status}
                >
                  <option value="active">active</option>
                  <option value="inactive">inactive</option>
                </select>
                <Link to={`editlisting/editservice?id=${listing._id}`} className="select edit">Edit</Link>
              </div>
            );
          } else {
            return null;
          }
        })}
      </section>
    </>
  );
}
