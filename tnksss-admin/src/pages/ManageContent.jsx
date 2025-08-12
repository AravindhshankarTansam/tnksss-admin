import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function ManageContent() {
  const [menuName, setMenuName] = useState('home');
  const [englishContent, setEnglishContent] = useState('');
  const [tamilContent, setTamilContent] = useState('');

  useEffect(() => {
    fetchContent();
  }, [menuName]);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`/api/menu/${menuName}`);
      setEnglishContent(res.data.english_content || '');
      setTamilContent(res.data.tamil_content || '');
    } catch {
      setEnglishContent('');
      setTamilContent('');
    }
  };

  const saveContent = async () => {
    try {
      await axios.post('/api/admin/menu', {
        menu_name: menuName,
        english_content: englishContent,
        tamil_content: tamilContent,
      });
      alert('Content saved');
    } catch {
      alert('Failed to save content');
    }
  };

  return (
    <div>
      <select value={menuName} onChange={(e) => setMenuName(e.target.value)}>
        <option value="home">Home</option>
        <option value="about">About</option>
        <option value="gallery">Gallery</option>
        <option value="contact">Contact</option>
      </select>

      <h3>English Content</h3>
      <ReactQuill theme="snow" value={englishContent} onChange={setEnglishContent} />

      <h3>Tamil Content</h3>
      <ReactQuill theme="snow" value={tamilContent} onChange={setTamilContent} />

      <button onClick={saveContent}>Save</button>
    </div>
  );
}
