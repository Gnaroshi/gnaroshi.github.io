import "./Photo.css";
import { Gallery } from "react-grid-gallery";
import images from "../../assets/images/photo/photo_image_index.jsx";

function Photo() {
  return (
    <div className="photo-wrapper">
      <div className="content-header">
        <h1>Photo</h1>
      </div>

      <div className="photo-gallery">
        <Gallery images={images} />
      </div>
    </div>
  );
}

export default Photo;
