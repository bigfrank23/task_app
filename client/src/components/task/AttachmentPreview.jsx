const AttachmentPreview = ({ files }) => (
  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
    {files.map((file, i) => (
      file.type.startsWith("image") ? (
        <img
          key={i}
          src={URL.createObjectURL(file)}
          alt=""
          width={80}
          style={{ borderRadius: "8px" }}
        />
      ) : (
        <video
          key={i}
          src={URL.createObjectURL(file)}
          width={120}
          controls
        />
      )
    ))}
  </div>
);

export default AttachmentPreview;
