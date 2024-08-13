"use client";

import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';




function textToHTML(text) {
  const lines = text.split('\n');
  let html = '';

  let inList = false;
  let inBlockquote = false;

  for (let line of lines) {
      if (line.startsWith('##')) {
          html += `<h2>${line.substring(2)}</h2>`;
      } else if (line.startsWith('#')) {
          html += `<h1>${line.substring(1)}</h1>`;
      } else if (line.startsWith('```')) {
          if (inBlockquote) {
              html += '</p>';
              inBlockquote = false;
          }
          if (line.startsWith('```javascript')) {
              html += '<pre><code class="language-javascript">';
          } else {
              html += '<pre><code>';
          }
      } else if (line.startsWith('```')) {
          html += '</code></pre>';
      } else if (line.startsWith('* ')) {
          if (!inList) {
              html += '<ul>';
              inList = true;
          }
          html += `<li>${line.substring(2)}</li>`;
      } else {
          if (inList) {
              html += '</ul>';
              inList = false;
          }
          if (!inBlockquote) {
              html += '<p>';
              inBlockquote = true;
          }
          html += `${line}<br>`;
      }
  }

  if (inList) {
      html += '</ul>';
  }
  if (inBlockquote) {
      html += '</blockquote>';
  }

  return html;
}

const TextEditor = ({ defaultText }) => {
  const [editorHtml, setEditorHtml] = useState('');
  defaultText = textToHTML(defaultText);
  useEffect(() => {
    if (defaultText) {
      setEditorHtml(defaultText);
    }
  }, [defaultText]);


  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script:  "sub" }, { script:  "super" }],
      ["blockquote", "code-block"],
      [{ list:  "ordered" }, { list:  "bullet" }],
      [{ indent:  "-1" }, { indent:  "+1" }, { align: [] }],
      ["link", "image", "video"],
      ["clean"],
  ],
  };
 

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorHtml(content);
  };

  return (
    <div>
      <div className=" w-full container mx-auto py-8 px-0 flex justify-center items-center">
        
        <div className="bg-white p-7 rounded-lg shadow-md">
          <ReactQuill 
            theme="snow"
            modules={modules}
            value={editorHtml}
            onChange={handleEditorChange}
          />
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
