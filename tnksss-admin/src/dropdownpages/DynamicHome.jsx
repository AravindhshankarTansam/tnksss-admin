import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, Switch,
  FormControlLabel, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  Modal, IconButton, TablePagination, Collapse
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EditIcon from '@mui/icons-material/Edit';


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
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  // Collapse toggle for table view
  const [showTable, setShowTable] = useState(false);

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

  // Fetch data on mount
  useEffect(() => {
    fetch(`${API_BASE}/slider/admin?all=true`)
      .then(res => res.json())
      .then(data => {
        console.log("Fetched slider data (raw):", data);
        setRows(data);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

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

    images.forEach((file) => {
      if (file instanceof File) {
        formData.append("images", file);
      }
    });
    formData.append("oldImages", JSON.stringify(images.filter(img => typeof img === "string")));

    try {
      let url, method;
      if (isEditMode) {
        url = `${API_BASE}/slider/admin/${editId}`;
        method = "PUT";
      } else {
        url = `${API_BASE}/slider/admin`;
        method = "POST";
      }
      const res = await fetch(url, { method, body: formData });
      if (!res.ok) throw new Error("Failed to save");
      const returned = await res.json();
      if (isEditMode) {
        setRows(prev => prev.map(row =>
          row.id === editId
            ? { ...row, ...returned, images: returned.images }
            : row
        ));
      } else {
        setRows(prev => [
          ...prev,
          {
            id: returned.id,
            images: returned.images,
            titleEn,
            titleTa,
            date,
            descEn,
            descTa,
            publish
          }
        ]);
      }

      setOpen(false);
      setIsEditMode(false);
      setEditId(null);
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

  const toggleStatus = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/slider/admin/${id}/toggle`, {
        method: "PATCH",
      });
      const updated = await res.json();
      setRows((prev) =>
        prev.map((row) =>
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

  const handleEdit = (row) => {
    setIsEditMode(true);
    setEditId(row.id);
    setTitleEn(row.titleEn);
    setTitleTa(row.titleTa);
    setDate(row.date);
    setImages(row.images.map(img => typeof img === "string" ? img : URL.createObjectURL(img)));
    setDescEn(row.descEn);
    setDescTa(row.descTa);
    setPublish(row.publish);
    setOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

// Notification states
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifTextEn, setNotifTextEn] = useState("");
  const [notifTextTa, setNotifTextTa] = useState("");
  const [notifRows, setNotifRows] = useState([]);
  const [notifEditMode, setNotifEditMode] = useState(false);
  const [notifEditId, setNotifEditId] = useState(null);
  const [notifPublish, setNotifPublish] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/slider/admin/notification?all=true`)
      .then(res => res.json())
      .then(data => setNotifRows(data))
      .catch(err => console.error("Notification fetch error:", err));
  }, []);

  const handleNotifSubmit = async () => {
    if (!notifTextEn && !notifTextTa) return alert("Please enter notification text");
    const body = {
      textEn: notifTextEn,
      textTa: notifTextTa,
      publish: notifPublish ? 1 : 0,
    };
    let url = `${API_BASE}/slider/admin/notification`;
    let method = "POST";
    if (notifEditMode) {
      url = `${API_BASE}/slider/admin/notification/${notifEditId}`;
      method = "PUT";
    }
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const ret = await res.json();

      if (notifEditMode) {
        setNotifRows(rows =>
          rows.map(row =>
            row.id === notifEditId ? { ...row, ...ret } : row
          )
        );
      } else {
        setNotifRows(rows => [...rows, ret]);
      }

      setNotifEditMode(false);
      setNotifEditId(null);
      setNotifTextEn("");
      setNotifTextTa("");
      setNotifPublish(true);
      setNotifOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditNotif = (row) => {
    setNotifEditMode(true);
    setNotifEditId(row.id);
    setNotifTextEn(row.textEn);
    setNotifTextTa(row.textTa);
    setNotifPublish(row.publish);
    setNotifOpen(true);
  };

  const toggleNotifPublish = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/slider/admin/notification/${id}/toggle`, { method: "PATCH" });
      const ret = await res.json();
      setNotifRows(rows =>
        rows.map(row => row.id === id ? { ...row, publish: ret.publish } : row)
      );
    } catch (err) {
      console.error("Notification toggle error:", err);
    }
  };


  return (
    <Box p={3}>
      {/* Add button and View Table toggle */}
      <Typography variant="h5" component="h1" gutterBottom>
        Adding Home page Content
      </Typography>
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
        <Button
          variant="contained"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={() => setShowTable(v => !v)}
        >
          {showTable ? "Hide Table" : "View Table"}
        </Button>
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

      {/* Table inside Collapse for dropdown effect */}
      <Collapse in={showTable} timeout="auto" unmountOnExit>
        <TableContainer component={Paper} sx={{ overflowX: "auto", mt: 2 }}>
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
              {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                    <Box display="flex" alignItems="center" gap={1}>
                      <Switch
                        checked={row.publish}
                        onChange={() => toggleStatus(row.id)}
                        color="primary"
                      />
                      <Box
                        sx={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          backgroundColor: row.publish ? "green" : "red",
                          boxShadow: row.publish
                            ? "0 0 6px rgba(0, 255, 0, 0.7)"
                            : "0 0 6px rgba(255, 0, 0, 0.7)"
                        }}
                      />
                      <IconButton
                        color="secondary"
                        onClick={() => handleEdit(row)}
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={rows.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </TableContainer>
      </Collapse>

<Typography variant="h6" gutterBottom mt={5}>
        Live Notifications
</Typography>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setNotifOpen(true)}
          sx={{ mb: 2 }}
        >
          Add Live Notification
        </Button>
      </Box>
      {/* Modal for notification */}
      <Modal open={notifOpen} onClose={() => setNotifOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", width: 400,
          bgcolor: "background.paper", p: 3, borderRadius: 2,
          boxShadow: 24,
        }}>
          <Typography variant="h6" gutterBottom>
            {notifEditMode ? "Edit" : "Add"} Live Notification
          </Typography>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Notification (English)</Typography>
          <ReactQuill theme="snow" value={notifTextEn} onChange={setNotifTextEn} />
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Notification (தமிழ்)</Typography>
          <ReactQuill theme="snow" value={notifTextTa} onChange={setNotifTextTa} />
          <FormControlLabel
            control={<Switch checked={notifPublish} onChange={() => setNotifPublish(prev => !prev)} />}
            label="Publish"
            sx={{ my: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleNotifSubmit} sx={{ mr: 2 }}>
            {notifEditMode ? "Update" : "Add"}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => setNotifOpen(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
      {/* Notifications table */}
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Notification (English)</TableCell>
              <TableCell>Notification (Tamil)</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifRows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: row.textEn }} />
                </TableCell>
                <TableCell>
                  <div dangerouslySetInnerHTML={{ __html: row.textTa }} />
                </TableCell>
                <TableCell>
                  <Switch
                    checked={row.publish}
                    onChange={() => toggleNotifPublish(row.id)}
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleEditNotif(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
