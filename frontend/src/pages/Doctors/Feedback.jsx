import { useState } from "react";   
import avatar from "../../assets/images/avatar-icon.png"; // Fallback avatar
import { AiFillStar } from "react-icons/ai";
import FeedbackForm from "./FeedbackForm";

const Feedback = ({ reviews, totalRatings }) => {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  return (
    <div>
      <div className="mb-[50px]">
        <h4 className="text-[20px] leading-[30px] font-bold text-headingColor mb-[30px] ">
          All reviews ({totalRatings || 0})  {/* Safely render total ratings */}
        </h4>

        {/* Mapping over reviews */}
        {reviews?.map((review, index) => (
          <div key={index} className="flex justify-between gap-10 mb-[30px]">
            <div className="flex gap-3">
              {/* Display user photo or fallback avatar */}
              <figure className="w-10 h-10 rounded-full">
                <img 
                  className="w-full" 
                  src={review?.user?.photo || avatar}  // Fallback to avatar if no photo
                  alt={review?.user?.name || 'User'}   // Fallback alt text
                />
              </figure>
              <div>
                <h5 className="text-[16px] leading-6 text-primaryColor font-bold">
                  {review?.user?.name || "Anonymous"}  {/* Fallback to 'Anonymous' if no name */}
                </h5>
                <p className="text-[14px] leading-6 text-textColor">
                  {review?.reviewText || "No feedback provided"} {/* Fallback if no text */}
                </p>
              </div>
            </div>

            {/* Display rating as stars */}
            <div className="flex gap-1">
              {[...Array(review?.rating || 0)].map((_, index) => (  // Handle missing rating
                <AiFillStar key={index} color="#0067FF" />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback form toggle */}
      {!showFeedbackForm && (
        <div className="text-center">
          <button className="btn" onClick={() => setShowFeedbackForm(true)}>
            Give Feedback
          </button>
        </div>
      )}

      {showFeedbackForm && <FeedbackForm />}
    </div>
  );
};

export default Feedback;
