import React, { useState, useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Link } from 'lucide-react';

const Toolbar = ({ onFormat, isEditMode }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef(null);

  useEffect(() => {
    const handleSelection = () => {
      if (!isEditMode) return;

      const selection = window.getSelection();
      if (selection.rangeCount > 0 && !selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY - 40,
          left: rect.left + (rect.width / 2) - (toolbarRef.current?.offsetWidth / 2 || 0),
        });
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, [isEditMode]);

  const handleFormat = (format) => {
    onFormat(format);
  };

  if (!visible || !isEditMode) return null;

  return (
    <div
      ref={toolbarRef}
      className="fixed bg-gray-800 rounded-md shadow-lg p-2 flex space-x-2 z-50"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button onClick={() => handleFormat('bold')} className="text-white hover:text-blue-500">
        <Bold size={16} />
      </button>
      <button onClick={() => handleFormat('italic')} className="text-white hover:text-blue-500">
        <Italic size={16} />
      </button>
      <button onClick={() => handleFormat('underline')} className="text-white hover:text-blue-500">
        <Underline size={16} />
      </button>
      <button onClick={() => handleFormat('link')} className="text-white hover:text-blue-500">
        <Link size={16} />
      </button>
    </div>
  );
};

export default Toolbar;