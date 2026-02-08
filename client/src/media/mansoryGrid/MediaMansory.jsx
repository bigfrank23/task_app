// components/MediaMasonry/MediaMasonry.jsx
import Masonry from "react-masonry-css";
import OptimizedImage from "../../components/optimizedImage/OptimizedImage";
import "./mediaMasonry.css";

const breakpointColumns = {
  default: 4,
  1400: 3,
  900: 2,
  600: 1
};

export default function MediaMasonry({ media, onOpen }) {
  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="masonry-grid"
      columnClassName="masonry-column"
    >
      {media.map((item, index) => (
        <div
          key={item._id || index}
          className="masonry-item"
          onClick={() => onOpen(index)}
        >
          {item.type === "image" ? (
            <OptimizedImage
              src={item.url}
              alt={item.filename}
              width={item.width}
              height={item.height}
              blurhash={item.blurhash}
              className="masonry-image"
            />
          ) : (
            <video
              src={item.url}
              muted
              preload="metadata"
              className="masonry-video"
            />
          )}
        </div>
      ))}
    </Masonry>
  );
}