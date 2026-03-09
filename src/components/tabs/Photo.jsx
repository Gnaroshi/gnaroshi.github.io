import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./Photo.css";
import { Gallery } from "react-grid-gallery";
import images from "../../assets/images/photo/photo_image_index";

const REM = 16;
const DESKTOP_ROW_HEIGHT = 14.5 * REM;
const LIGHTBOX_CLOSE_DURATION = 180;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const getResponsiveRowHeight = () => {
  if (typeof window === "undefined") {
    return DESKTOP_ROW_HEIGHT;
  }

  if (window.innerWidth <= 430) {
    return 8.5 * REM;
  }

  if (window.innerWidth <= 768) {
    return 11 * REM;
  }

  return DESKTOP_ROW_HEIGHT;
};

function Photo() {
  const [rowHeight, setRowHeight] = useState(getResponsiveRowHeight);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLightboxClosing, setIsLightboxClosing] = useState(false);
  const scrollLockRef = useRef(null);
  const isLightboxOpen = activeIndex >= 0;
  const activeImage = useMemo(
    () => (isLightboxOpen ? images[activeIndex] : null),
    [activeIndex, isLightboxOpen],
  );

  const closeLightbox = useCallback(() => {
    setActiveIndex(-1);
    setIsLightboxClosing(false);
  }, []);

  const requestCloseLightbox = useCallback(() => {
    if (activeIndex < 0) {
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (prefersReducedMotion) {
      closeLightbox();
      return;
    }

    setIsLightboxClosing(true);
  }, [activeIndex, closeLightbox]);

  const showPrevious = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < 0) return prev;
      return (prev - 1 + images.length) % images.length;
    });
  }, []);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < 0) return prev;
      return (prev + 1) % images.length;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setRowHeight(getResponsiveRowHeight());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const { body, documentElement } = document;
    const lockScrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    const previousState = {
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyLeft: body.style.left,
      bodyRight: body.style.right,
      bodyWidth: body.style.width,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverflow: documentElement.style.overflow,
    };
    scrollLockRef.current = { scrollY: lockScrollY, previousState };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        requestCloseLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrevious();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    };

    documentElement.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${lockScrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      const lockState = scrollLockRef.current;
      const restoreState = lockState?.previousState ?? previousState;
      const restoreY = lockState?.scrollY ?? lockScrollY;

      body.style.overflow = restoreState.bodyOverflow;
      body.style.position = restoreState.bodyPosition;
      body.style.top = restoreState.bodyTop;
      body.style.left = restoreState.bodyLeft;
      body.style.right = restoreState.bodyRight;
      body.style.width = restoreState.bodyWidth;
      body.style.paddingRight = restoreState.bodyPaddingRight;
      documentElement.style.overflow = restoreState.htmlOverflow;
      window.scrollTo({ top: restoreY, behavior: "auto" });
      scrollLockRef.current = null;
    };
  }, [isLightboxOpen, requestCloseLightbox, showNext, showPrevious]);

  useEffect(() => {
    if (isLightboxOpen) {
      setIsLightboxClosing(false);
    }
  }, [isLightboxOpen]);

  useEffect(() => {
    if (!isLightboxClosing) {
      return undefined;
    }

    const timerId = window.setTimeout(() => {
      closeLightbox();
    }, LIGHTBOX_CLOSE_DURATION);

    return () => window.clearTimeout(timerId);
  }, [closeLightbox, isLightboxClosing]);

  const handleImageClick = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  return (
    <div data-reveal data-reveal-load-delay="60" className="photo-wrapper">
      <div data-reveal className="tab-header">
        <h1>Photo</h1>
      </div>

      <div data-reveal className="photo-gallery">
        <Gallery
          images={images}
          enableImageSelection={false}
          rowHeight={rowHeight}
          margin={3}
          onClick={handleImageClick}
        />
      </div>

      {isLightboxOpen && activeImage ? (
        <div
          className={`photo-lightbox ${isLightboxClosing ? "is-closing" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo preview"
          onClick={requestCloseLightbox}
        >
          <div className="photo-lightbox__inner" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="photo-lightbox__close btn btn--icon btn--sm btn--secondary interactive-button"
              onClick={requestCloseLightbox}
              aria-label="Close photo preview"
            >
              ✕
            </button>

            <div className="photo-lightbox__viewer">
              <button
                type="button"
                className="photo-lightbox__nav photo-lightbox__nav--prev btn btn--icon btn--sm btn--secondary interactive-button"
                onClick={showPrevious}
                aria-label="Previous photo"
              >
                ←
              </button>
              <div className="photo-lightbox__media-frame">
                <img
                  src={activeImage.src}
                  alt={activeImage.alt || activeImage.caption || "Lab photo"}
                />
              </div>
              <button
                type="button"
                className="photo-lightbox__nav photo-lightbox__nav--next btn btn--icon btn--sm btn--secondary interactive-button"
                onClick={showNext}
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            <div className="photo-lightbox__meta">
              <p className="photo-lightbox__index">
                {activeIndex + 1} / {images.length}
              </p>
              <p className="photo-lightbox__caption">
                {activeImage.caption || "Lab photo"}
              </p>
              {activeImage.description ? (
                <p className="photo-lightbox__description">
                  {activeImage.description}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Photo;
