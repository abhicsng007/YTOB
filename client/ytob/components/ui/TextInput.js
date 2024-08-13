// components/TextInput.js
const TextInput = ({ initialText, onTextChange }) => {
    const handleTextChange = (event) => {
      const newText = event.target.value;
      onTextChange(newText);
    };
  
    return (
      <div className="mb-4">
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">
          Text
        </label>
        <input
          id="text"
          name="text"
          type="text"
          value={initialText}
          onChange={handleTextChange}
          className="mt-1 border border-gray-300 rounded-md px-4 py-2 w-full text-sm text-gray-700"
        />
      </div>
    );
  };
  
  export default TextInput;
  