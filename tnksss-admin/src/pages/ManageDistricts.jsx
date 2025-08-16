import React, { useState, useEffect } from 'react';
import {
  TextField, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, Dialog,
  DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


const BASE_URL = "http://localhost:4000"; // Change if deployed

export default function ManageDistricts() {
  const [districts, setDistricts] = useState([]);
  const [newDistrict, setNewDistrict] = useState('');
  const [editDistrict, setEditDistrict] = useState(null); // modal data
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = () => {
    fetch(`${BASE_URL}/districts`)
      .then(res => res.json())
      .then(data => setDistricts(Array.isArray(data) ? data : []))
      .catch(err => {
        console.error("Error fetching districts:", err);
        setDistricts([]);
      });
  };

  const addDistrict = () => {
    if (!newDistrict.trim()) {
      alert('Please enter a district name');
      return;
    }
    fetch(`${BASE_URL}/districts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDistrict }),
    })
      .then(res => res.json())
      .then(data => {
        setDistricts([...districts, data]);
        setNewDistrict('');
      })
      .catch(err => console.error("Error adding district:", err));
  };

  const deleteDistrict = (id) => {
    fetch(`${BASE_URL}/districts/${id}`, { method: "DELETE" })
      .then(() => setDistricts(districts.filter((d) => d.id !== id)))
      .catch(err => console.error("Error deleting district:", err));
  };

  const openEditModal = (district) => {
    setEditDistrict(district);
    setEditName(district.name);
  };

  const saveEdit = () => {
    fetch(`${BASE_URL}/districts/${editDistrict.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    })
      .then(res => res.json())
      .then(updated => {
        setDistricts(districts.map(d => d.id === updated.id ? updated : d));
        setEditDistrict(null);
      })
      .catch(err => console.error("Error updating district:", err));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        District Master
      </Typography>

      <TextField
        label="New District"
        value={newDistrict}
        onChange={(e) => setNewDistrict(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ mr: 1 }}
      />
      <Button variant="contained" onClick={addDistrict}>
        Add
      </Button>

      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SL. No</TableCell>
              <TableCell>District</TableCell>
              <TableCell>District Code</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {districts.map((d, index) => (
              <TableRow key={d.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{d.name}</TableCell>
                <TableCell>{d.code}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      color="primary"
                      onClick={() => openEditModal(d)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      color="error"
                      onClick={() => deleteDistrict(d.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {districts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No districts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Modal */}
      <Dialog open={!!editDistrict} onClose={() => setEditDistrict(null)}>
        <DialogTitle>Edit District</DialogTitle>
        <DialogContent>
          <TextField
            label="District Code"
            value={editDistrict?.code || ""}
            variant="outlined"
            fullWidth
            margin="dense"
            InputProps={{
              readOnly: true,
              style: { backgroundColor: "#f5f5f5", color: "#666" }
            }}
          />
          <TextField
            label="District Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            variant="outlined"
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDistrict(null)}>Cancel</Button>
          <Button variant="contained" onClick={saveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
