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
    backgroundColor: '#f9f9f9',
    color: '#333333',
    textAlign: 'center',
    transition: 'border 0.3s ease-in-out'
  }})}>
    <input {...getInputProps()} />
    {
      isDragActive ?
      <p>사진을 놓으세요</p> :
      <p>사진을 끌어다 놓으세요</p>
    }
  </div>
  );
}

export default PhotoDrop;
