import P20230609 from "./20230609.jpg";
import P20230609Thumb from "./thumbs/20230609.jpg";
import P20230822_1 from "./20230822_1.jpg";
import P20230822_1Thumb from "./thumbs/20230822_1.jpg";
import P20230822_2 from "./20230822_2.jpg";
import P20230822_2Thumb from "./thumbs/20230822_2.jpg";
import P20231227_1 from "./20231227_1.jpg";
import P20231227_1Thumb from "./thumbs/20231227_1.jpg";
import P20231227_2 from "./20231227_2.jpg";
import P20231227_2Thumb from "./thumbs/20231227_2.jpg";
import P20240222 from "./20240222.jpg";
import P20240222Thumb from "./thumbs/20240222.jpg";
import P20240717 from "./20240717.jpg";
import P20240717Thumb from "./thumbs/20240717.jpg";
import P20240826_1 from "./20240826_1.jpg";
import P20240826_1Thumb from "./thumbs/20240826_1.jpg";
import P20240826_2 from "./20240826_2.jpg";
import P20240826_2Thumb from "./thumbs/20240826_2.jpg";
import P20240910 from "./20240910.jpeg";
import P20240910Thumb from "./thumbs/20240910.jpg";
import P20241127 from "./20241127.jpg";
import P20241127Thumb from "./thumbs/20241127.jpg";
import P20241128 from "./20241128.jpg";
import P20241128Thumb from "./thumbs/20241128.jpg";
import P20241211 from "./20241211.jpg";
import P20241211Thumb from "./thumbs/20241211.jpg";

const createPhotoItem = ({
  thumbnailSrc,
  fullSrc,
  width,
  height,
  caption,
  description = "",
  alt = caption,
}) => ({
  thumbnailSrc,
  src: thumbnailSrc,
  fullSrc,
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
    thumbnailSrc: P20241211Thumb,
    fullSrc: P20241211,
    width: 721,
    height: 961,
    caption: "ACCV 2024",
    description: "Conference presentation",
  }),
  createPhotoItem({
    thumbnailSrc: P20241128Thumb,
    fullSrc: P20241128,
    width: 3000,
    height: 4000,
    caption: "BMVC 2024",
    description: "Lab poster session",
  }),
  createPhotoItem({
    thumbnailSrc: P20241127Thumb,
    fullSrc: P20241127,
    width: 4032,
    height: 3024,
    caption: "Winter 2024 Lab Gathering",
  }),
  createPhotoItem({
    thumbnailSrc: P20240910Thumb,
    fullSrc: P20240910,
    width: 1024,
    height: 768,
    caption: "AIAI 2024",
    description: "Invited talk",
  }),
  createPhotoItem({
    thumbnailSrc: P20240826_2Thumb,
    fullSrc: P20240826_2,
    width: 5752,
    height: 3835,
    caption: "August 2024 Graduation",
  }),
  createPhotoItem({
    thumbnailSrc: P20240826_1Thumb,
    fullSrc: P20240826_1,
    width: 4032,
    height: 3024,
    caption: "Summer 2024 Mentoring Program",
  }),
  createPhotoItem({
    thumbnailSrc: P20240717Thumb,
    fullSrc: P20240717,
    width: 1440,
    height: 543,
    caption: "Summer 2024 Team Event",
  }),
  createPhotoItem({
    thumbnailSrc: P20240222Thumb,
    fullSrc: P20240222,
    width: 4284,
    height: 5712,
    caption: "February 2024 Graduation",
  }),
  createPhotoItem({
    thumbnailSrc: P20231227_2Thumb,
    fullSrc: P20231227_2,
    width: 1400,
    height: 1050,
    caption: "2023 Year-end Gathering",
  }),
  createPhotoItem({
    thumbnailSrc: P20231227_1Thumb,
    fullSrc: P20231227_1,
    width: 1400,
    height: 1050,
    caption: "December Lab Seminar",
  }),
  createPhotoItem({
    thumbnailSrc: P20230822_2Thumb,
    fullSrc: P20230822_2,
    width: 2268,
    height: 4032,
    caption: "August 2023 Graduation",
  }),
  createPhotoItem({
    thumbnailSrc: P20230822_1Thumb,
    fullSrc: P20230822_1,
    width: 4032,
    height: 3024,
    caption: "August 2023 Graduation",
  }),
  createPhotoItem({
    thumbnailSrc: P20230609Thumb,
    fullSrc: P20230609,
    width: 4032,
    height: 3024,
    caption: "June Lab Dinner",
  }),
];

export default photoImages;
