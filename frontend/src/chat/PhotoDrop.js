import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

function PhotoDrop({ file, setFile }) {
  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

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
