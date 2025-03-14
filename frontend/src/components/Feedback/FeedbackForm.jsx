import RatingComponent from "../RatingComponent";
import { toast } from "react-toastify";
import { useContext } from "react";
import { VideoContext } from "../../Context/Context";
import "./FeedbackForm.css";

const FeedbackForm = () => {
  // IMPORTING FROM VIDEO CONTEXT
  const { detailsUpdated, setDetailsUpdated, feedbackFormRef, currentVideoID } =
    useContext(VideoContext);

  async function handleFeedbackFromSubmission(event) {
    const form = event.target;

    const formData = new FormData(form);

    const feedbackFormData = {};

    for (const [name, value] of formData) {
      feedbackFormData[name] = value;
    }

    feedbackFormData._id = currentVideoID;

    event.target.reset();

    try {
      const response = await fetch("http://localhost:8080/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(feedbackFormData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        setDetailsUpdated(!detailsUpdated);
      }
    } catch (error) {
      console.error(error.message);
    }

    console.log(feedbackFormData);
  }

  return (
    <dialog ref={feedbackFormRef} className="feedback-form-dialog">
      <form
        method="dialog"
        className="feedback-form "
        onSubmit={handleFeedbackFromSubmission}
      >
        <p className="form-title">Submit Your Feedback</p>
        <div>
          <label htmlFor="fullname">Fullname: </label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            placeholder="Enter fullname"
            required
          />
        </div>

        <div>
          <label htmlFor="feedback-email">Email address: </label>
          <input
            type="email"
            name="email"
            id="feedback-email"
            placeholder="Enter email address"
            required
          />
        </div>

        <div>
          <label htmlFor="feedback">Enter Feedback: </label>
          <textarea
            name="feedback"
            id="feedback"
            placeholder="Enter your feedback"
            cols={30}
            rows={10}
            className="feedback-textarea"
            required
          ></textarea>
        </div>
        <div className="rating-div">
          <p>Submit your Rating:</p>
          <RatingComponent />
        </div>
        <div className="flex justify-center items-center">
          <input
            type="submit"
            value="Submit"
            id="submit-btn"
            className="btn submit-btn"
          />
          <button
            type="button"
            className="btn close-feedback-form-btn"
            onClick={() => feedbackFormRef.current.close()}
          >
            Close Form
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default FeedbackForm;
