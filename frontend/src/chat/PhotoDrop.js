import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function PhotoDrop({ file, setFile, chatEndRef }) {
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file.size > 5 * 1024 * 1024) { // 10MB 제한
      setError("File size exceeds 5MB 😰");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
      setError(null);
    };
    reader.readAsDataURL(file);
  }, [setFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
  });

  return (
    <div
      {...getRootProps({
        style: {
          padding: "20px",
          border: "3px dashed #cccccc",
          borderRadius: "10px",
          backgroundColor: "#22232c",
          color: "#f9f9f9",
          textAlign: "center",
          transition: "border 0.3s ease-in-out",
        },
      })}
    >
      <input {...getInputProps()} />
      {isDragActive ? <p>Drop It! 😎</p> : <p>Drag Photo 🌃</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {file && (
        <img
          src={file}
          alt="Uploaded"
          style={{ marginTop: "20px", maxWidth: "100%" }}
        />
      )}
    </div>
  );
}

export default PhotoDrop;
