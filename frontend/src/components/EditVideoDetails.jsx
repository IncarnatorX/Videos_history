import { toast } from "react-toastify";
import { useContext, useRef } from "react";
import { VideoContext } from "../Context/VideoContext";
import "./EditVideoDetails.css";
import PropTypes from "prop-types";

const EditVideoDetails = ({ currentVideoID, editDialogRef }) => {
  const titleRef = useRef(null);
  const descRef = useRef(null);

  const { setDetailsUpdated, detailsUpdated } = useContext(VideoContext);

  const uploadTitleAndDesc = async (e) => {
    const formData = new FormData(e.target);
    const editedDetails = {};
    for (const [name, value] of formData) {
      editedDetails[name] = value;
    }
    editedDetails._id = currentVideoID;

    try {
      const response = await fetch("http://localhost:8080/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedDetails),
      });

      const data = await response.json();
      toast.success(data.message);
      titleRef.current.value = "";
      descRef.current.value = "";
      setDetailsUpdated(!detailsUpdated);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <dialog ref={editDialogRef}>
      <form method="dialog" onSubmit={uploadTitleAndDesc}>
        <div className="input-field">
          <input type="text" id="title" name="title" size={30} ref={titleRef} />
          <label htmlFor="title">Enter Title: </label>
        </div>
        <div className="input-field">
          <textarea
            type="text"
            id="description"
            name="description"
            size={30}
            ref={descRef}
            cols={35}
            rows={5}
          ></textarea>
        </div>
        <button className="btn save-btn" type="submit">
          Save Changes
        </button>
      </form>
      <button
        className="btn close-btn"
        onClick={() => editDialogRef.current.close()}
      >
        Close
      </button>
    </dialog>
  );
};

EditVideoDetails.propTypes = {
  currentVideoID: PropTypes.string,
  editDialogRef: PropTypes.object,
};

export default EditVideoDetails;
