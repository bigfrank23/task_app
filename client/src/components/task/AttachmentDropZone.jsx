import { useDropzone } from "react-dropzone";

const AttachmentDropzone = ({ files, setFiles }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [], "video/*": [] },
    onDrop: (acceptedFiles) =>
      setFiles((prev) => [...prev, ...acceptedFiles]),
  });

  return (
    <div {...getRootProps()} style={{
      border: "2px dashed #cbd5f5",
      padding: "20px",
      borderRadius: "12px",
      cursor: "pointer"
    }}>
      <input {...getInputProps()} />
      <p>Drag & drop images/videos here or click to select</p>
    </div>
  );
};

export default AttachmentDropzone;
