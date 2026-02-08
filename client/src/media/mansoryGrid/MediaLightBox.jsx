// components/MediaLightbox/MediaLightbox.jsx
import Lightbox from "yet-another-react-lightbox";
import Video from "yet-another-react-lightbox/plugins/video";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

export default function MediaLightbox({ open, index, close, media }) {
  return (
    <Lightbox
      open={open}
      close={close}
      index={index}
      slides={media.map((item) =>
        item.type === "image"
          ? { 
              src: item.url,
              alt: item.filename,
              width: item.width,
              height: item.height,
            }
          : {
              type: "video",
              sources: [
                {
                  src: item.url,
                  type: "video/mp4",
                },
              ],
              autoPlay: true,
            }
      )}
      plugins={[Video, Zoom]}
      carousel={{ finite: true }}
      animation={{ swipe: 300 }}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
    />
  );
}