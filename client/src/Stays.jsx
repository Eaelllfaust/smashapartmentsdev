import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'; // Import React Toastify

export default function Stays() {
  const locationSearch = useLocation();
  const navigate = useNavigate();
  const [propertyType, setPropertyType] = useState("");
  const [listings, setListings] = useState([]);
  const [initialListings, setInitialListings] = useState([]);
  const [filters, setFilters] = useState({});
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false)
  const [offset, setOffset] = useState(0);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [adults, setAdults] = useState(0);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(0);
  const [showPopover1, setShowPopover1] = useState(false);
  const [showPopover2, setShowPopover2] = useState(false);
  const [startDate, endDate] = dateRange;

  const popoverRef1 = useRef(null);
  const popoverRef2 = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const [searchLocation, setSearchLocation] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchPeople, setSearchPeople] = useState("");
  const [searchRooms, setSearchRooms] = useState("");

  const params = new URLSearchParams(locationSearch.search);
  const locationParam = params.get("location");
  const date = params.get("date");
  const people = params.get("people");
  const rooms_get = params.get("rooms");

  const latitude = params.get("latitude");
  const longitude = params.get("longitude");
  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${value}&addressdetails=1&limit=5`
      );
      const results = await response.json();
      setSuggestions(results);
    } else {
      setSuggestions([]);
    }
  };
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
  };

  const handleIncrease = (setter, value) => {
    setter(value + 1);
  };

  const handleDecrease = (setter, value) => {
    if (value > 0) {
      setter(value - 1);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("location") || "");
    setDateRange([
      params.get("checkIn") ? new Date(params.get("checkIn")) : null,
      params.get("checkOut") ? new Date(params.get("checkOut")) : null
    ]);
    const totalPeople = Number(params.get("people") || 0);
    setAdults(Math.floor(totalPeople / 2));
    setChildren(totalPeople % 2);
    setRooms(Number(params.get("rooms") || 0));
    setPropertyType(params.get("propertyType") || "");

    fetchListings();
  }, [location.search]);
  const handleInputClick1 = () => {
    setShowPopover1(true);
    setShowPopover2(false);
  };

  const handleInputClick2 = () => {
    setShowPopover2(true);
    setShowPopover1(false);
  };
  useEffect(() => {
  
    const handleClickOutside = (event) => {
  
      if (popoverRef1.current && !popoverRef1.current.contains(event.target)) {
        setShowPopover1(false);
      }
      if (popoverRef2.current && !popoverRef2.current.contains(event.target)) {
        setShowPopover2(false);
      }
     
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ popoverRef1, popoverRef2]);


  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const fetchListingsWithFilters = async () => {
        try {
          const response = await axios.get("/getlistings", {
            params: { ...filters, limit: 5, offset: 0 }, 
          });
          setListings(response.data);
          setHasMore(response.data.length === 5);
        } catch (error) {
          console.error("Error fetching listings with filters:", error);
        }
      };

      fetchListingsWithFilters();
    } else {

      setListings(initialListings); 
      setOffset(0); 
    }
  }, [filters]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

   
  }, []);
  const handleFilterChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePriceChange = (e) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [e.target.name]: Number(e.target.value),
    }));
  };


  

 

  const handleSearch = () => {
    toast("Searching...")
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("location", query);
    if (startDate) queryParams.append("checkIn", startDate.toISOString());
    if (endDate) queryParams.append("checkOut", endDate.toISOString());
    if (adults > 0 || children > 0) queryParams.append("people", adults + children);
    if (rooms > 0) queryParams.append("rooms", rooms);
    if (propertyType) queryParams.append("propertyType", propertyType);

    navigate(`/stays?${queryParams.toString()}`);
  };

  const handleRatingChange = (e, rating) => {
    setFilters((prevFilters) => {
      const updatedRatings = e.target.checked
        ? [...(prevFilters.ratings || []), rating]  
        : prevFilters.ratings.filter((r) => r !== rating); 
      return { ...prevFilters, ratings: updatedRatings };
    });
  };
  
  const fetchListings = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      params.append("limit", "5");
      params.append("offset", "0");

      const response = await axios.get("/getlistings", { params });
      setListings(response.data);
      setHasMore(response.data.length === 5);
      toast.success("Fetched properties");
    } catch (error) {
      console.error("Error fetching listings:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };




 
  const handleLocationBasedLink = (path) => {
    const queryParams = new URLSearchParams();
    if (userLocation) {
      queryParams.append("latitude", userLocation.latitude);
      queryParams.append("longitude", userLocation.longitude);
    }
    navigate(`${path}?${queryParams.toString()}`);
  };

  const handleSearchSubmit = () => {
    const queryParams = new URLSearchParams();
    if (searchLocation) queryParams.append("location", searchLocation);
    if (searchDate) queryParams.append("date", searchDate);
    if (searchPeople) queryParams.append("people", searchPeople);
    if (searchRooms) queryParams.append("rooms", searchRooms);

    navigate(`/stays?${queryParams.toString()}`);
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      params.append("limit", "5");
      params.append("offset", listings.length.toString());

      const response = await axios.get("/getlistings", { params });
      setListings(prevListings => [...prevListings, ...response.data]);
      setHasMore(response.data.length === 5);
      toast.success("Fetched more properties");
    } catch (error) {
      console.error("Error fetching more listings:", error);
      toast.error("Failed to fetch more properties");
    } finally {
      setLoading(false);
    }
  };
  const getMatchPercentage = (matchScore) => {
    const totalCriteria = Object.keys(new URLSearchParams(location.search)).length;
    return Math.round((matchScore / totalCriteria) * 100);
  };
  return (
    <>
      <div className="shade_2 df">
        <h1>Search for stays</h1>
        <p>From budget hotels to luxury rooms and everything in between</p>
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
      <section className="majestic">
        <div className="col_1">
          {locationParam && (
            <>
              <div className="map_area">
                <img className="map_area" src="assets/map.png" alt="Map" />
                <div className="over_item">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      locationParam
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button b3"
                  >
                    Show on map
                  </a>
                </div>
              </div>
              <br />
              <br />
              <br />
            </>
          )}
          <div>
            <h2>Filter by</h2>
            <br />
            <p>
              NGN {filters.minPrice || 10000} - NGN {filters.maxPrice || 300000}+
            </p>
            <br />
            <form action="">
              <input
                className="slide"
                type="range"
                name="minPrice"
                value={filters.minPrice || 200}
                min="10000"
                max="300000"
                onChange={handlePriceChange}
              />
              <input
                className="slide"
                type="range"
                name="maxPrice"
                value={filters.maxPrice || 1000}
                min="10000"
                max="300000"
                onChange={handlePriceChange}
              />
            </form>
            <br />
            <form action="" className="ti">
              <label htmlFor="">Popular filters</label>
              <br />
              <br />
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="wifi"
                  checked={filters.wifi}
                  onChange={handleFilterChange}
                />
                <label htmlFor="wifi">Wifi</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="pool"
                  checked={filters.pool}
                  onChange={handleFilterChange}
                />
                <label htmlFor="pool">Pool</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="parking"
                  checked={filters.parking}
                  onChange={handleFilterChange}
                />
                <label htmlFor="parking">Parking</label>
              </div>
              <div className="flex_item">
                <input
                  className="check"
                  type="checkbox"
                  name="gym"
                  checked={filters.gym}
                  onChange={handleFilterChange}
                />
                <label htmlFor="gym">Gym</label>
              </div>
            </form>
            <br />
            <br />
            <form action="" className="ti">
  <label htmlFor="">Ratings</label>
  <br />
  <br />
  {[1, 2, 3, 4, 5].map((rating) => (
    <div className="flex_item" key={rating}>
      <input
        className="check"
        type="checkbox"
        name="ratings"
        value={rating}
        checked={filters.ratings?.includes(rating)}
        onChange={(e) => handleRatingChange(e, rating)}
      />
      <label htmlFor="ratings">{rating} star{rating > 1 ? 's' : ''}</label>
    </div>
  ))}
</form>

          </div>
        </div>
        <div className="col_2">
        <div className="sa_search_max max_max">
          <div className="search_item_max">
            <img src="/assets/bed-regular-84.png" alt="" />
            <input
              type="text"
              placeholder="Location"
              value={query}
              onChange={handleInputChange}
              className="location-input"
            />
            {suggestions.length > 0 && (
              <div className="popover">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.place_id}
                    className="popover-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion.display_name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="search_item_max">
            <img src="/assets/calendar-week-regular-84.png" alt="" />
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check in - Check out"
              onChange={(update) => {
                setDateRange(update);
              }}
              withPortal
            />
          </div>
          <div className="search_item_max" ref={popoverRef1}>
            <img src="/assets/user-regular-84.png" alt="" />
            <input
              type="text"
              placeholder={`Adults: ${adults} | Children: ${children} | Rooms: ${rooms}`}
              readOnly
              onClick={handleInputClick1}
            />

            {showPopover1 && (
              <div className="popover">
                <div className="popover-item new_pop">
                  Adults
                  <div className="value_decision">
                    <i className="bx bx-minus" onClick={() => handleDecrease(setAdults, adults)}></i>
                    <input type="number" value={adults} readOnly />
                    <i className="bx bx-plus" onClick={() => handleIncrease(setAdults, adults)}></i>
                  </div>
                </div>
                <div className="popover-item new_pop">
                  Children
                  <div className="value_decision">
                    <i className="bx bx-minus" onClick={() => handleDecrease(setChildren, children)}></i>
                    <input type="number" value={children} readOnly />
                    <i className="bx bx-plus" onClick={() => handleIncrease(setChildren, children)}></i>
                  </div>
                </div>
                <div className="popover-item new_pop">
                  Rooms
                  <div className="value_decision">
                    <i className="bx bx-minus" onClick={() => handleDecrease(setRooms, rooms)}></i>
                    <input type="number" value={rooms} readOnly />
                    <i className="bx bx-plus" onClick={() => handleIncrease(setRooms, rooms)}></i>
                  </div>
                </div>
              </div>
            )}
          </div>
          <select
          className="select"
          value={propertyType}
          onChange={(e) => setPropertyType(e.target.value)}
        >
          <option value="">Select property type</option>
          <option value="airbnb">Airbnb</option>
          <option value="hotel">Hotel</option>
          <option value="shortTermRental">Short term rental</option>
          <option value="villa">Villa</option>
          <option value="apartments">Apartments</option>
        </select>
          <div className="button b2" onClick={handleSearch}>Search</div>
        </div>
     
          <div className="listings_list">
            {listings.map((listing) => (
              <div className="list_node" key={listing._id}>
                
                <div className="list_1">
                  <img
                    src={`https://smashapartments.com/uploads/${listing.images[0]?.media_name}`}
                    alt={listing.property_name}
                  />
                </div>
                <div className="list_2">
                  <div className="l22">
                    <div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{listing.property_name}</h2>
                        <div className="star_holder">
                          {[...Array(5)].map((_, i) => (
                            <i key={i} className={`bx bx-star ${i < Math.floor(listing.averageRating || 0) ? 'bxs-star' : ''}`} />
                          ))}
                        </div>
                      </div>
                      <h3 className="small_1" style={{ marginTop: 10 }}>
                        {listing.city}, {listing.state_name}
                      </h3>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="n94">
                      <h3>
                        {listing.averageRating >= 4.5 ? "Excellent" : "Good"}
                      </h3>
                      <h3>
                        {listing.reviewCount
                          ? `${listing.reviewCount} reviews`
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
                      {listing.averageRating || "N/A"} <i className="bx bxs-star"></i>
                    </div>
                  </div>
                  </div>
                  <div className="l33">
                    <div className="o93">
                      <h3>{listing.property_type || "Not specified"}</h3>
                      <p>
                        {listing.description || "No description available."}
                      </p>
                    </div>
                    <div>
                      <div className="o33">
                        <div>
                          {listing.weekly_discount || "No discount"}% discounted
                        </div>
                        <div>Daily rate</div>
                      </div>
                      <div className="amount_main">
                        <h1>
                          NGN{" "}
                          {listing.price_per_night?.toLocaleString() || "0.00"}
                        </h1>
                      </div>
                      <div className="o33">
                        <div>Includes taxes</div>
                      </div>
                      <br />
                      <Link to={`staysdetails?id=${listing._id}`}>
                        <div className="button b3 b4 b2">See availability</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div className="view_more">
                <button onClick={loadMore}>View More</button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
