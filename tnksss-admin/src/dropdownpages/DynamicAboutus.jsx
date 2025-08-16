import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Switch,
  FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Modal, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function DynamicAboutus() {
  const [open, setOpen] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descTa, setDescTa] = useState("");
  const [publish, setPublish] = useState(false);
  const [rows, setRows] = useState([]);

  const API_BASE = "http://localhost:4000"; // change if needed

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"]
    ]
  };
  const quillFormats = [
    "header", "bold", "italic", "underline", "strike",
    "align", "list", "bullet", "color", "background",
    "link", "image"
  ];

  // Fetch About data on mount
  useEffect(() => {
    fetch(`${API_BASE}/aboutus`)
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async () => {
    if (!titleEn) {
      alert("Please enter English title");
      return;
    }

    const payload = {
      titleEn,
      titleTa,
      descEn,
      descTa,
      publish
    };

    try {
      const res = await fetch(`${API_BASE}/aboutus`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");

      const newEntry = await res.json();
      setRows(prev => [...prev, newEntry]);

      // Reset modal fields
      setTitleEn("");
      setTitleTa("");
      setDescEn("");
      setDescTa("");
      setPublish(false);
      setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/aboutus/${id}/toggle`, { method: "PATCH" });
      const updated = await res.json();
      setRows(prev =>
        prev.map(row => row.id === id ? { ...row, publish: updated.publish } : row)
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Adding About us
      </Typography>
      {/* Add Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add About Us
        </Button>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: "80%",
          maxHeight: "90vh", overflowY: "auto", bgcolor: "background.paper",
          p: 3, borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6">Add About Us Content</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>

          {/* Titles */}
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Title (English)" fullWidth value={titleEn} onChange={e => setTitleEn(e.target.value)} />
            <TextField label="Title (Tamil)" fullWidth value={titleTa} onChange={e => setTitleTa(e.target.value)} />
          </Box>

          {/* Descriptions */}
          <Box display="flex" gap={2} mb={3}>
            <Box flex={1}>
              <Typography> Description (English) </Typography>
              <ReactQuill value={descEn} onChange={setDescEn} modules={quillModules} formats={quillFormats} />
            </Box>
            <Box flex={1}>
              <Typography> Description (தமிழ்) </Typography>
              <ReactQuill value={descTa} onChange={setDescTa} modules={quillModules} formats={quillFormats} />
            </Box>
          </Box>

          {/* Publish + Save */}
          <Box display="flex" alignItems="center" gap={3}>
            <FormControlLabel
              control={<Switch checked={publish} onChange={() => setPublish(!publish)} />}
              label="Publish to Public"
            />
            <Button variant="contained" onClick={handleSubmit}>Save Entry</Button>
          </Box>
        </Box>
      </Modal>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title (English)</TableCell>
              <TableCell>Title (Tamil)</TableCell>
              <TableCell>Description (English)</TableCell>
              <TableCell>Description (Tamil)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.titleEn}</TableCell>
                <TableCell>{row.titleTa}</TableCell>
                <TableCell><div dangerouslySetInnerHTML={{ __html: row.descEn }} /></TableCell>
                <TableCell><div dangerouslySetInnerHTML={{ __html: row.descTa }} /></TableCell>
                <TableCell>
                  <Switch checked={row.publish} onChange={() => toggleStatus(row.id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
