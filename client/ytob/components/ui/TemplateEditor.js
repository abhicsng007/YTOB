// pages/templateEditor.js
import { useState } from 'react';
import ImageUpload from './ImageUpload';
import TextInput from './TextInput';
import Draggable from 'react-draggable';

const TemplateEditor = () => {
  const defaultImageUrl = '/default-image.jpg';
  const defaultText = 'Default text';

  const [uploadedImage, setUploadedImage] = useState(null);
  const [text, setText] = useState(defaultText);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const handleImageChange = (image) => {
    setUploadedImage(image);
  };

  const handleTextChange = (newText) => {
    setText(newText);
  };

  const handleTextDrag = (e, ui) => {
    setTextPosition({ x: textPosition.x + ui.deltaX, y: textPosition.y + ui.deltaY });
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-4 border border-gray-300 rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Template Editor</h1>
      <div className="mb-6">
        <ImageUpload onImageChange={handleImageChange} />
        <TextInput initialText={text} onTextChange={handleTextChange} />
      </div>
      <div className="mb-6 relative">
        <h2 className="text-lg font-semibold mb-2">Preview</h2>
        <div className="border border-gray-300 rounded-md p-4 relative">
          {uploadedImage && (
            <img src={URL.createObjectURL(uploadedImage)} alt="Preview" className="w-full h-auto rounded-md mb-2" />
          )}
          {text && (
            <Draggable position={textPosition} onDrag={handleTextDrag}>
              <p
                className="absolute text-sm font-medium text-white bg-black bg-opacity-50 p-2 rounded-md cursor-move"
                style={{ top: textPosition.y, left: textPosition.x }}
              >
                {text}
              </p>
            </Draggable>
          )}
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;
