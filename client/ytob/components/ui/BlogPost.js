"use client";
"use strict";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FilePenLine, Image } from 'lucide-react';
import Capture from './Capture';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/app/services/axiosInstance';
import { debounce } from 'lodash';
import TurndownService from 'turndown';
import { marked,Renderer } from 'marked';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const renderer = new Renderer();

function preserveMultipleNewlines(markdown) {
  return markdown.replace(/\n{2,}/g, (match) => {
    return '\n' + '&nbsp;'.repeat(match.length - 1) + '\n';
  });
}

marked.setOptions({
  breaks: true,
  gfm: true,
  renderer: renderer
});

const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

const BlogPost = ({ text, defVideoUrl }) => {
  const [isClick, setIsClick] = useState(false);
  const [showComponent, setShowComponent] = useState(false);
  const [imgPath, setImagePath] = useState("");
  const [htmlContent, setHtmlContent] = useState('');
  const [itemId, setItemId] = useState(null);
  const [itemType, setItemType] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [cursorPosition, setCursorPosition] = useState(null);

  const quillRef = useRef(null);
  const router = useRouter();

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'link'],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['image'],
    ]
  };

  const quillFormats = [
    'bold', 'italic', 'underline', 'link', 'header', 'image'
  ];

  useEffect(() => {
    
    const itemToEdit = JSON.parse(localStorage.getItem('itemToEdit'));
    if (itemToEdit) {
      const preservedContent = preserveMultipleNewlines(itemToEdit.content);
      setHtmlContent(marked(preservedContent));
      setItemId(itemToEdit._id);
      setItemType(itemToEdit.type);
    } else if (text) {
      const preservedContent = preserveMultipleNewlines(text);
      setHtmlContent(marked(preservedContent));
    }
  }, [text]);

  useEffect(() => {
    if (imgPath !== "") {
      insertImageAtCursor(imgPath);
    }
  }, [imgPath]);

  const saveChanges = async (updatedHtmlContent) => {
    if (!itemId || !itemType) {
      console.error('No item to update');
      return;
    }
  
    // Convert HTML to Markdown, preserving multiple newlines
    let markdownContent = turndownService.turndown(updatedHtmlContent);
    markdownContent = markdownContent.replace(/(&nbsp;)+/g, (match) => {
      return '\n'.repeat(match.length / 6 + 1);
    });
  
    try {
      const response = await axiosInstance.put(`/${itemType}/${itemId}`, {
        content: markdownContent
      });
  
      if (response.status === 200) {
        setSaveMessage('Changes saved successfully');
        const updatedItem = { _id: itemId, type: itemType, content: markdownContent };
        localStorage.setItem('itemToEdit', JSON.stringify(updatedItem));
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save changes');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch (error) {
      setSaveMessage('Error saving changes');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const debouncedSaveChanges = useCallback(
    debounce((html) => saveChanges(html), 1000),
    [saveChanges]
  );

  const handleQuillChange = (content, delta, source, editor) => {
    setHtmlContent(content);
    debouncedSaveChanges(content);
    // Update cursor position on each change
    const selection = editor.getSelection();
    if (selection) {
      setCursorPosition(selection.index);
    }
  };

  const handleEditClick = () => {
    setIsClick(!isClick);
  };

  const handleImageClick = () => {
    if (isClick) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();
      setCursorPosition(selection ? selection.index : null);
      setShowComponent(!showComponent);
    }
  };

  const insertImageAtCursor = (imagePath) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.focus();
      
      let insertionIndex;
      if (cursorPosition !== null) {
        insertionIndex = cursorPosition;
      } else {
        const currentSelection = editor.getSelection();
        insertionIndex = currentSelection ? currentSelection.index : editor.getLength() - 1;
      }
  
      editor.insertEmbed(insertionIndex, 'image', imagePath);
      editor.setSelection(insertionIndex + 1);
      
      setCursorPosition(null);
    }
  };

  const updateCursorPosition = () => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const selection = editor.getSelection();
      if (selection) {
        setCursorPosition(selection.index);
      }
    }
  };
  

  return (
    <div className="min-h-screen p-4 relative ">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="imageGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8E24AA" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
          <linearGradient id="editGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8E24AA" />
            <stop offset="100%" stopColor="#2196F3" />
          </linearGradient>
        </defs>
      </svg>

      <div className='flex justify-end m-8 cursor-pointer'>
        <Image 
          onClick={handleImageClick} 
          className="mr-4 w-6 h-6"
          style={{
            stroke: !isClick ? '#6B7280' : 'url(#imageGradient)',
            strokeWidth: 1.5
          }}
        />
        <FilePenLine 
          onClick={handleEditClick} 
          className="w-6 h-6"
          style={{
            stroke: isClick ? '#6B7280' : 'url(#editGradient)',
            strokeWidth: 1.5
          }}
        />
      </div>

      {showComponent && (
        <div className="w-full h-full flex justify-center items-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg mb-2">
            <Capture imgPath={imgPath} defVideoUrl={defVideoUrl} 
              setImagePath={(url) => {
                setImagePath(url);
              }} />
          </div>
        </div>
      )}
      
      <ReactQuill
        ref={quillRef}
        theme="bubble"
        value={htmlContent}
        onChange={handleQuillChange}
        onKeyUp={updateCursorPosition}
        onMouseUp={updateCursorPosition}
        readOnly={!isClick}
        modules={quillModules}
        formats={quillFormats}
        className=" bg-gray-900 text-white rounded-lg shadow-md"
        
      />
      
      
      {saveMessage && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded">
          {saveMessage}
        </div>
      )}
    </div>
  );
};

export default BlogPost;