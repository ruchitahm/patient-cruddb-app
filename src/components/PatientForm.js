// components/PatientForm.js
import React, { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

const initialPatient = {
  firstName: '',
  lastName: '',
  phone: '',
  age: '',
  gender: '',
  visitDate: '',
  nextVisit: '',
};

const PatientForm = ({ open, handleClose, handleSubmit }) => {
  const [patient, setPatient] = useState(initialPatient);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const onSubmit = () => {
    handleSubmit(patient);
    setPatient(initialPatient);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add New Patient</DialogTitle>
      <DialogContent>
        <TextField label="First Name" name="firstName" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Last Name" name="lastName" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Phone" name="phone" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Age" name="age" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Gender" name="gender" fullWidth margin="dense" onChange={handleChange} />
        <TextField label="Visit Date" name="visitDate" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} onChange={handleChange} />
        <TextField label="Next Visit" name="nextVisit" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientForm;
