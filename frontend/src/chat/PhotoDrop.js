import React, { useCallback } from 'react';
import {useDropzone} from 'react-dropzone';

function PhotoDrop() {
const onDrop = useCallback(acceptedFiles => {
  
}, [])
const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
  <div {...getRootProps({ style: {
    padding: '20px',
    border: '3px dashed #cccccc',
    borderRadius: '10px',
    backgroundColor: '#22232c',
    color: '#f9f9f9',
    textAlign: 'center',
    transition: 'border 0.3s ease-in-out'
  }})}>
    <input {...getInputProps()} />
    {
      isDragActive ?
      <p>Drop It! 😎</p> :
      <p>Drag Photo 🌃</p>
    }
  </div>
  );
}

export default PhotoDrop;
