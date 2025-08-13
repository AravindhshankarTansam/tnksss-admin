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
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function DynamicHome() {
  const [open, setOpen] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleTa, setTitleTa] = useState("");
  const [date, setDate] = useState("");
  const [images, setImages] = useState([]);
  const [descEn, setDescEn] = useState("");
  const [descTa, setDescTa] = useState("");
  const [publish, setPublish] = useState(false);
  const [rows, setRows] = useState([]);

  const API_BASE = "http://localhost:4000";

  // Quill config
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

// ✅ Fetch data on mount
    useEffect(() => {
    fetch(`${API_BASE}/slider`)
        .then(res => res.json())
        .then(data => {
        console.log("Fetched slider data (raw):", data); // 🔹 log raw data
        setRows(data);
        })
        .catch(err => console.error("Fetch error:", err));
    }, []);


  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  // ✅ Save entry to backend
const handleSubmit = async () => {
  if (!titleEn || !date) {
    alert("Please fill required fields");
    return;
  }

  const formData = new FormData();
  formData.append("titleEn", titleEn);
  formData.append("titleTa", titleTa);
  formData.append("date", date);
  formData.append("descEn", descEn);
  formData.append("descTa", descTa);
  formData.append("publish", publish ? 1 : 0);

  // Append all image files
  images.forEach((file) => {
    formData.append("images", file);
  });

  try {
    const res = await fetch(`${API_BASE}/slider`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Failed to save");

    const newEntry = await res.json();
    console.log("New entry returned from backend (raw):", newEntry);
    // After receiving newEntry from backend
    setRows((prev) => [
    ...prev,
    {
        id: newEntry.id,
        images: newEntry.images.map(img => `${API_BASE}/${img}`), // make full URL
        titleEn,
        titleTa,
        date,
        descEn,
        descTa,
        publish
    }
    ]);

    setOpen(false);

    // Reset fields
    setTitleEn("");
    setTitleTa("");
    setDate("");
    setImages([]);
    setDescEn("");
    setDescTa("");
    setPublish(false);
  } catch (err) {
    console.error(err);
  }
};


  // ✅ Toggle publish in backend
  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/slider/${id}/toggle`, {
        method: "PATCH"
      });
      const updated = await res.json();
      setRows(prev =>
        prev.map(row =>
          row.id === id ? { ...row, publish: updated.publish } : row
        )
      );
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const sliderSettings = {
    dots: true, infinite: true, speed: 400,
    slidesToShow: 1, slidesToScroll: 1
  };

  return (
    <Box p={3}>
      {/* Add button */}
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton
          color="primary"
          onClick={() => setOpen(true)}
          sx={{
            display: "flex", alignItems: "center", gap: 1, fontWeight: "light",
            "&:hover": { backgroundColor: "rgba(25, 118, 210, 0.05)" }
          }}
        >
          <AddIcon fontSize="large" />
          <Typography variant="body1" fontWeight="light">
            Add Slider Image
          </Typography>
        </IconButton>
      </Box>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: "90%",
          maxHeight: "90vh", overflowY: "auto", bgcolor: "background.paper",
          p: 3, borderRadius: 2
        }}>
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography variant="h6" fontWeight="bold">
              Add Home Page Content
            </Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Title + Date */}
          <Box display="flex" gap={2} mb={2}>
            <TextField label="Title (English)" fullWidth value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            <TextField label="Title (Tamil)" fullWidth value={titleTa} onChange={(e) => setTitleTa(e.target.value)} />
            <TextField label="Date" type="date" fullWidth InputLabelProps={{ shrink: true }} value={date} onChange={(e) => setDate(e.target.value)} />
          </Box>

          {/* Image Upload */}
          <Button variant="outlined" component="label" sx={{ mb: 2 }}>
            Upload Images
            <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
          </Button>

          {/* Preview */}
            {images.length > 0 && (
            <Slider {...sliderSettings}>
            {images.map((img, idx) => {
                const src = typeof img === "string" ? img : URL.createObjectURL(img);
                return (
                <Box key={idx} display="flex" justifyContent="center">
                    <img src={src} alt={`Slide ${idx}`} style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }} />
                </Box>
                );
            })}
            </Slider>
            )}


          {/* Descriptions */}
          <Box display="flex" gap={2} mb={3}>
            <Box flex={1}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Description (English)</Typography>
              <ReactQuill theme="snow" value={descEn} onChange={setDescEn} modules={quillModules} formats={quillFormats} />
            </Box>
            <Box flex={1}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Description (தமிழ்)</Typography>
              <ReactQuill theme="snow" value={descTa} onChange={setDescTa} modules={quillModules} formats={quillFormats} />
            </Box>
          </Box>

          {/* Publish + Save */}
          <Box display="flex" alignItems="center" gap={5} mt={2}>
            <FormControlLabel control={<Switch checked={publish} onChange={() => setPublish(!publish)} />} label="Publish to Public" />
            <Button variant="contained" onClick={handleSubmit}>Save Entry</Button>
          </Box>
        </Box>
      </Modal>

      {/* Table */}
      <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell>Title (English)</TableCell>
              <TableCell>Title (Tamil)</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Images</TableCell>
              <TableCell>Description (English)</TableCell>
              <TableCell>Description (Tamil)</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.titleEn}</TableCell>
                <TableCell>{row.titleTa}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                {row.images?.length > 0 && (
                    <Slider {...sliderSettings}>
                    {row.images.map((img, idx) => (
                        <Box key={idx} display="flex" justifyContent="center">
                        <img src={img} alt={row.titleEn} style={{ width: "80px", borderRadius: "4px" }} />
                        </Box>
                    ))}
                    </Slider>
                )}
                </TableCell>
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
