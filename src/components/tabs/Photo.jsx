import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Gallery as PhotoGallery } from "react-grid-gallery";
import "./Photo.css";
import "./Photo.lightbox.css";
import PHOTO_DATA from "../../generated/photos.generated.json";

const REM = 16;
const DESKTOP_ROW_HEIGHT = 12.4 * REM;
const GALLERY_MARGIN = 4;

const getResponsiveRowHeight = () => {
  if (typeof window === "undefined") {
    return DESKTOP_ROW_HEIGHT;
  }

  if (window.innerWidth <= 430) {
    return 7.4 * REM;
  }

  if (window.innerWidth <= 768) {
    return 9.8 * REM;
  }

  return DESKTOP_ROW_HEIGHT;
};

const lockBodyScroll = () => {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const { body, documentElement } = document;
  const lockScrollY = window.scrollY;
  const scrollbarWidth = Math.max(0, window.innerWidth - documentElement.clientWidth);

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

  documentElement.style.overflow = "hidden";
  body.classList.add("photo-lightbox-open");
  body.style.overflow = "hidden";
  body.style.position = "fixed";
  body.style.top = `-${lockScrollY}px`;
  body.style.left = "0";
  body.style.right = "0";
  body.style.width = "100%";
  body.style.paddingRight = scrollbarWidth > 0 ? `${scrollbarWidth}px` : "";

  return () => {
    body.style.overflow = previousState.bodyOverflow;
    body.style.position = previousState.bodyPosition;
    body.style.top = previousState.bodyTop;
    body.style.left = previousState.bodyLeft;
    body.style.right = previousState.bodyRight;
    body.style.width = previousState.bodyWidth;
    body.style.paddingRight = previousState.bodyPaddingRight;
    documentElement.style.overflow = previousState.htmlOverflow;
    body.classList.remove("photo-lightbox-open");
    window.scrollTo({ top: lockScrollY, behavior: "auto" });
  };
};

function Photo() {
  const [rowHeight, setRowHeight] = useState(getResponsiveRowHeight);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [galleryWidth, setGalleryWidth] = useState(0);
  const galleryRef = useRef(null);
  const images = useMemo(() => {
    const baseUrl = import.meta.env.BASE_URL || "/";
    const withBase = (relativePath) =>
      `${baseUrl.replace(/\/+$/, "/")}${String(relativePath || "").replace(/^\/+/, "")}`;

    return (PHOTO_DATA?.items ?? []).map((item) => {
      const caption = item.caption || item.title || "Lab photo";
      const description = item.description || "";
      const thumbnailSrc = withBase(item.thumbnail);
      const fullSrc = withBase(item.full);

      return {
        id: item.id,
        thumbnailSrc,
        src: thumbnailSrc,
        fullSrc,
        width: Number(item.width) || 1200,
        height: Number(item.height) || 800,
        caption,
        description,
        alt: item.alt || caption,
        customOverlay: (
          <div className="photo-overlay" aria-hidden="true">
            <div className="photo-overlay__content">
              <p className="photo-overlay__title">{caption}</p>
              {description ? <p className="photo-overlay__description">{description}</p> : null}
            </div>
          </div>
        ),
      };
    });
  }, []);
  const isLightboxOpen = activeIndex >= 0 && activeIndex < images.length;
  const activeImage = useMemo(
    () => (isLightboxOpen ? images[activeIndex] : null),
    [activeIndex, images, isLightboxOpen],
  );
  const isPortraitImage = Boolean(
    activeImage && Number(activeImage.height) > Number(activeImage.width),
  );
  const lightboxRoot = typeof document !== "undefined" ? document.body : null;

  const renderGalleryThumbnail = useCallback(
    ({ imageProps, item }) => (
      <img
        {...imageProps}
        src={item.thumbnailSrc || item.src}
        alt={item.alt || item.caption || "Lab photo"}
        width={item.width}
        height={item.height}
        sizes="(max-width: 430px) 46vw, (max-width: 768px) 31vw, 16rem"
        loading="lazy"
        decoding="async"
      />
    ),
    [],
  );

  const closeLightbox = useCallback(() => {
    setActiveIndex(-1);
  }, []);

  const openLightbox = useCallback((index) => {
    if (!Number.isInteger(index) || index < 0 || index >= images.length) {
      return;
    }
    setActiveIndex(index);
  }, [images.length]);

  const showPrevious = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < 0) return prev;
      return (prev - 1 + images.length) % images.length;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev < 0) return prev;
      return (prev + 1) % images.length;
    });
  }, [images.length]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleResize = () => {
      setRowHeight(getResponsiveRowHeight());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const node = galleryRef.current;
    if (!node || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const handleResize = (entries) => {
      const nextWidth = Math.max(0, Math.floor(entries[0]?.contentRect?.width ?? 0));
      setGalleryWidth(nextWidth);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(node);
    setGalleryWidth(Math.max(0, Math.floor(node.getBoundingClientRect().width)));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const unlockScroll = lockBodyScroll();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      } else if (event.key === "ArrowLeft") {
        showPrevious();
      } else if (event.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      unlockScroll();
    };
  }, [closeLightbox, isLightboxOpen, showNext, showPrevious]);

  useEffect(() => {
    if (!isLightboxOpen || !images[activeIndex]) {
      return;
    }

    const totalCount = images.length;
    const preloadTargets = [
      images[(activeIndex + 1) % totalCount],
      images[(activeIndex - 1 + totalCount) % totalCount],
    ];

    preloadTargets.forEach((item) => {
      const targetSrc = item?.fullSrc || item?.src;
      if (!targetSrc) {
        return;
      }
      const preload = new Image();
      preload.src = targetSrc;
    });
  }, [activeIndex, images, isLightboxOpen]);

  const lightbox = isLightboxOpen && activeImage && lightboxRoot
    ? createPortal(
        <div
          className="photo-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded photo preview"
          onClick={closeLightbox}
        >
          <div className="photo-lightbox__panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="photo-lightbox__close"
              onClick={closeLightbox}
              aria-label="Close photo preview"
            >
              <span aria-hidden="true">×</span>
            </button>

            <div className={`photo-lightbox__stage ${isPortraitImage ? "is-portrait" : ""}`}>
              <div className="photo-lightbox__frame">
                <img
                  src={activeImage.fullSrc || activeImage.src}
                  alt={activeImage.alt || activeImage.caption || "Lab photo"}
                  loading="eager"
                  decoding="async"
                  draggable={false}
                />
              </div>
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
              <div className="photo-lightbox__controls" role="group" aria-label="Photo navigation">
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--prev"
                  onClick={showPrevious}
                  aria-label="Previous photo"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  className="photo-lightbox__nav photo-lightbox__nav--next"
                  onClick={showNext}
                  aria-label="Next photo"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>,
        lightboxRoot,
      )
    : null;

  return (
    <div data-reveal data-reveal-load-delay="60" className="photo-wrapper">
      <div data-reveal className="tab-header">
        <h1>Photo</h1>
      </div>

      <div data-reveal ref={galleryRef} className="photo-gallery">
        <PhotoGallery
          images={images}
          enableImageSelection={false}
          rowHeight={rowHeight}
          margin={GALLERY_MARGIN}
          defaultContainerWidth={galleryWidth || 1200}
          onClick={openLightbox}
          thumbnailImageComponent={renderGalleryThumbnail}
        />
      </div>

      {lightbox}
    </div>
  );
}

export default Photo;
