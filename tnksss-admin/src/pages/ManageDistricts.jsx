import React, { useState } from 'react';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';

export default function ManageDistricts() {
  const [districts, setDistricts] = useState([
    { id: 1, name: "Chennai" },
    { id: 2, name: "Madurai" }
  ]);
  const [newDistrict, setNewDistrict] = useState('');

  const addDistrict = () => {
    if (!newDistrict.trim()) {
      alert('Please enter a district name');
      return;
    }
    // Generate a fake ID and add to state
    const newId = districts.length > 0 ? districts[districts.length - 1].id + 1 : 1;
    const newDistrictObj = { id: newId, name: newDistrict.trim() };
    setDistricts([...districts, newDistrictObj]);
    setNewDistrict('');
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

      <List>
        {districts.map((d) => (
          <ListItem key={d.id}>{d.name}</ListItem>
        ))}
      </List>
    </div>
  );
}
