// components/ImageUpload.js
import { useState } from 'react';

const ImageUpload = ({ onImageChange }) => {
  const [imageUrl, setImageUrl] = useState('');

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setImageUrl(imageUrl);
    onImageChange(file);
  };

  return (
    <div className="mb-4">
      <label htmlFor="image" className="block text-sm font-medium text-gray-700">
        Image
      </label>
      <div className="mt-1 flex items-center">
        <input id="image" name="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        <label htmlFor="image" className="cursor-pointer bg-white rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          Choose File
        </label>
        <span className="ml-2">{imageUrl && <img src={imageUrl} alt="Uploaded" className="h-10" />}</span>
      </div>
    </div>
  );
};

export default ImageUpload;
