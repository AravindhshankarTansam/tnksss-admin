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

export default function DynamicContact() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [messageEn, setMessageEn] = useState("");
  const [messageTa, setMessageTa] = useState("");
  const [publish, setPublish] = useState(false);
  const [rows, setRows] = useState([]);

  const API_BASE = "http://localhost:4000";

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

  // Fetch contact entries
  useEffect(() => {
    fetch(`${API_BASE}/contact`)
      .then(res => res.json())
      .then(data => setRows(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async () => {
    if (!email || !phone) {
      alert("Please fill required fields");
      return;
    }

    const payload = { email, phone, messageEn, messageTa, publish };

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to save");
      const newEntry = await res.json();
      setRows(prev => [...prev, newEntry]);

      // Reset
      setEmail(""); setPhone(""); setMessageEn(""); setMessageTa(""); setPublish(false); setOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/contact/${id}/toggle`, { method: "PATCH" });
      const updated = await res.json();
      setRows(prev => prev.map(r => r.id === id ? { ...r, publish: updated.publish } : r));
    } catch (err) { console.error(err); }
  };

  return (
    <Box p={3}>
      {/* Add Button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Add Contact Entry
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
            <Typography variant="h6">Add Contact Entry</Typography>
            <IconButton onClick={() => setOpen(false)}><CloseIcon /></IconButton>
          </Box>

          {/* Email + Phone */}
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Email" fullWidth value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="Phone" fullWidth value={phone} onChange={e => setPhone(e.target.value)} />
          </Box>

          {/* Messages */}
          <Box display="flex" gap={2} mb={3}>
            <Box flex={1}>
              <Typography>Message (English)</Typography>
              <ReactQuill value={messageEn} onChange={setMessageEn} modules={quillModules} formats={quillFormats} />
            </Box>
            <Box flex={1}>
              <Typography>Message (தமிழ்)</Typography>
              <ReactQuill value={messageTa} onChange={setMessageTa} modules={quillModules} formats={quillFormats} />
            </Box>
          </Box>

          {/* Publish + Save */}
          <Box display="flex" alignItems="center" gap={3}>
            <FormControlLabel control={<Switch checked={publish} onChange={() => setPublish(!publish)} />} label="Publish to Public" />
            <Button variant="contained" onClick={handleSubmit}>Save Entry</Button>
          </Box>
        </Box>
      </Modal>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Message (English)</TableCell>
              <TableCell>Message (Tamil)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map(row => (
              <TableRow key={row.id}>
                <TableCell>{row.email}</TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell><div dangerouslySetInnerHTML={{ __html: row.messageEn }} /></TableCell>
                <TableCell><div dangerouslySetInnerHTML={{ __html: row.messageTa }} /></TableCell>
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
