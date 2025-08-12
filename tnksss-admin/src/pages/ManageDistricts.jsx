import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextField, Button, List, ListItem, Typography } from '@mui/material';

export default function ManageDistricts() {
  const [districts, setDistricts] = useState([]);
  const [newDistrict, setNewDistrict] = useState('');

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const res = await axios.get('/api/admin/districts');
      setDistricts(res.data);
    } catch (error) {
      alert('Failed to fetch districts');
    }
  };

  const addDistrict = async () => {
    if (!newDistrict.trim()) return alert('Please enter a district name');
    try {
      await axios.post('/api/admin/districts', { name: newDistrict });
      setNewDistrict('');
      fetchDistricts();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add district');
    }
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
