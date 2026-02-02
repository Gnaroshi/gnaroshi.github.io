import "./Photo.css";
import { Gallery } from "react-grid-gallery";
import images from "../../assets/images/photo/photo_image_index";

const REM = 16;

function Photo() {
  return (
    <div className="photo-wrapper">
      <div className="tab-header">
        <h1>Photo</h1>
      </div>

      <div className="photo-gallery">
        <Gallery
          images={images}
          enableImageSelection={false}
          rowHeight={20 * REM}
          margin={0.25 * REM}
        />
      </div>
    </div>
  );
}

export default Photo;
