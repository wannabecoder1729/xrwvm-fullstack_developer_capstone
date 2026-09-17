import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png";
import neutral_icon from "../assets/neutral.png";
import negative_icon from "../assets/negative.png";
import review_icon from "../assets/reviewbutton.png";
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const getDealer = async () => {
    try {
      const res = await fetch(`/djangoapp/dealer/${id}`);
      const data = await res.json();

      if (Array.isArray(data) && data.length > 0) {
        setDealer(data[0]);
      }
    } catch (error) {
      console.error("Error fetching dealer:", error);
    }
  };

  const getReviews = async () => {
    try {
      const res = await fetch(`/djangoapp/review/dealer/${id}`);
      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const sentiIcon = (sentiment) => {
    if (sentiment === "positive") {
      return positive_icon;
    }

    if (sentiment === "negative") {
      return negative_icon;
    }

    return neutral_icon;
  };

  useEffect(() => {
    getDealer();
    getReviews();
  }, [id]);

  const isLoggedIn = sessionStorage.getItem("username") !== null;

  return (
    <div style={{ margin: "20px" }}>
      <Header />

      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}

          {isLoggedIn && (
            <a href={`/postreview/${id}`}>
              <img
                src={review_icon}
                style={{
                  width: "10%",
                  marginLeft: "10px",
                  marginTop: "10px"
                }}
                alt="Post Review"
              />
            </a>
          )}
        </h1>

        <h4 style={{ color: "grey" }}>
          {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
        </h4>
      </div>

      <div className="reviews_panel">
        {loading ? (
          <div>Loading Reviews....</div>
        ) : reviews.length === 0 ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review, index) => (
            <div
              className="review_panel"
              key={review._id || index}
            >
              <img
                src={sentiIcon(review.sentiment)}
                className="emotion_icon"
                alt="Sentiment"
              />

              <div className="review">
                {review.review}
              </div>

              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
