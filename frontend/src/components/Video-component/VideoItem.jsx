import { useNavigate } from "react-router";

import PropTypes from "prop-types";
import { useContext } from "react";
import { VideoContext } from "../../Context/Context";

const VideoItem = ({ video }) => {
  const navigate = useNavigate();

  // Importing form VideoContext

  const {
    HandleEditDialogOpening,
    handleReuploadDialogOpen,
    handleFeedbackFormDialog,
  } = useContext(VideoContext);

  function ratingDecimalFixer(video) {
    const rating =
      video.feedback.reduce((sum, r) => sum + Number(r.rating), 0) /
      video.feedback.length;
    if (isNaN(rating.toFixed(1))) {
      return 0;
    }
    return rating.toFixed(1);
  }

  return (
    <div className="video-item">
      <video src={video.videoFile} controls width={300} height={250}></video>
      <section>
        <div className="video-info">
          <h4 className="video-title">{video.title}</h4>
          <p className="video-desc">{video.description}</p>
        </div>
        <div className="video-btns">
          <button
            className="edit-button btn"
            onClick={() => HandleEditDialogOpening(video._id)}
          >
            Edit
          </button>
          <button
            className="re-upload-button btn"
            onClick={() => handleReuploadDialogOpen(video._id)}
          >
            Re-Upload
          </button>
          <button
            className="btn feedback-btn"
            onClick={() => handleFeedbackFormDialog(video._id)}
          >
            Submit Feedback
          </button>
        </div>
      </section>
      <section className="review-ratings">
        <p>No. of Reviews: {video.feedback.length} </p>
        <p>Average Rating: {ratingDecimalFixer(video)} stars</p>
        <span
          className="more-btn"
          onClick={() => navigate("/videoInfo", { state: video })}
        >
          More....
        </span>
      </section>
    </div>
  );
};

VideoItem.propTypes = {
  video: PropTypes.object,
  HandleEditDialogOpening: PropTypes.func,
  handleReuploadDialogOpen: PropTypes.func,
  handleFeedbackFormDialog: PropTypes.func,
  ratingDecimalFixer: PropTypes.func,
};

export default VideoItem;
