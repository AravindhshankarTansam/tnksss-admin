import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import pagesConfig from "../config/pagesConfig.jsx"; // optional if you want menuName selection

export default function ManageContent() {
  const [englishContent, setEnglishContent] = useState("");
  const [tamilContent, setTamilContent] = useState("");

  const saveContent = () => {
    console.log("Saved English Content:", englishContent);
    console.log("Saved Tamil Content:", tamilContent);
    alert("Content saved locally (frontend only)");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>English Content</h3>
      <ReactQuill
        theme="snow"
        value={englishContent}
        onChange={setEnglishContent}
        style={{ height: "200px", marginBottom: "20px" }}
      />

      <h3>Tamil Content</h3>
      <ReactQuill
        theme="snow"
        value={tamilContent}
        onChange={setTamilContent}
        style={{ height: "200px", marginBottom: "20px" }}
      />

      <button
        onClick={saveContent}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Save
      </button>
    </div>
  );
}
