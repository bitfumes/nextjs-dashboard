import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

export default function Avatar({ getImage, avatar, maxSize = 500 }) {
  const [upload, setUpload] = useState();
  const [image, setImage] = useState(avatar);

  const setUploadRef = e => {
    setUpload(e);
  };

  function uploadImage(e) {
    upload.click();
  }

  function readImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(reader.result);
      getImage(reader.result);
    };
  }

  function handleFile(e) {
    if (e.target.files.length) {
      const size = Math.round(e.target.files[0].size / 1024);
      if (size > maxSize) {
        alert(`Size is ${size}kb, it should be less than 250k.`);
        return;
      }
      readImage(e.target.files[0]);
    }
  }

  return (
    <div className="justify-center flex flex-wrap">
      <img
        className="rounded-full border border-gray-500 w-64 h-64"
        onClick={uploadImage}
        src={image}
        width={250}
        height={250}
      />
      <div className="w-full flex">
        <input
          type="file"
          onChange={handleFile}
          className="hidden"
          ref={setUploadRef}
        />
      </div>
    </div>
  );
}
