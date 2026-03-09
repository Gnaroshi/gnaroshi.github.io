import P20230609 from "./20230609.jpg";
import P20230822_1 from "./20230822_1.jpg";
import P20230822_2 from "./20230822_2.jpg";
import P20231227_1 from "./20231227_1.jpg";
import P20231227_2 from "./20231227_2.jpg";
import P20240222 from "./20240222.jpg";
import P20240717 from "./20240717.jpg";
import P20240826_1 from "./20240826_1.jpg";
import P20240826_2 from "./20240826_2.jpg";
import P20240910 from "./20240910.jpeg";
import P20241127 from "./20241127.jpg";
import P20241128 from "./20241128.jpg";
import P20241211 from "./20241211.jpg";

const createPhotoItem = ({
  src,
  width,
  height,
  caption,
  description = "",
  alt = caption,
}) => ({
  src,
  width,
  height,
  caption,
  description,
  alt,
  customOverlay: (
    <div className="photo-overlay" aria-hidden="true">
      <div className="photo-overlay__content">
        <p className="photo-overlay__title">{caption}</p>
        {description ? <p className="photo-overlay__description">{description}</p> : null}
      </div>
    </div>
  ),
});

const photoImages = [
  createPhotoItem({
    src: P20241211,
    width: 721,
    height: 961,
    caption: "ACCV 2024",
    description: "Conference presentation",
  }),
  createPhotoItem({
    src: P20241128,
    width: 3000,
    height: 4000,
    caption: "BMVC 2024",
    description: "Lab poster session",
  }),
  createPhotoItem({
    src: P20241127,
    width: 4032,
    height: 3024,
    caption: "Winter 2024 Lab Gathering",
  }),
  createPhotoItem({
    src: P20240910,
    width: 1024,
    height: 768,
    caption: "AIAI 2024",
    description: "Invited talk",
  }),
  createPhotoItem({
    src: P20240826_2,
    width: 5752,
    height: 3835,
    caption: "August 2024 Graduation",
  }),
  createPhotoItem({
    src: P20240826_1,
    width: 4032,
    height: 3024,
    caption: "Summer 2024 Mentoring Program",
  }),
  createPhotoItem({
    src: P20240717,
    width: 1440,
    height: 543,
    caption: "Summer 2024 Team Event",
  }),
  createPhotoItem({
    src: P20240222,
    width: 4284,
    height: 5712,
    caption: "February 2024 Graduation",
  }),
  createPhotoItem({
    src: P20231227_2,
    width: 1400,
    height: 1050,
    caption: "2023 Year-end Gathering",
  }),
  createPhotoItem({
    src: P20231227_1,
    width: 1400,
    height: 1050,
    caption: "December Lab Seminar",
  }),
  createPhotoItem({
    src: P20230822_2,
    width: 2268,
    height: 4032,
    caption: "August 2023 Graduation",
  }),
  createPhotoItem({
    src: P20230822_1,
    width: 4032,
    height: 3024,
    caption: "August 2023 Graduation",
  }),
  createPhotoItem({
    src: P20230609,
    width: 4032,
    height: 3024,
    caption: "June Lab Dinner",
  }),
];

export default photoImages;
