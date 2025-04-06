import React, { useState } from 'react';
import { Grid, TextField, Button, Divider, Typography } from '@mui/material';

const AddPatientForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    name: '',
    location: '',
    age: '',
    phone: '',
    address: '',
    prescription: '',
    dose: '',
    visitDate: '',
    nextVisit: '',
    physicianId: '',
    physicianName: '',
    physicianPhone: '',
    bill: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const generatePatientId = () => {
    const id = 'P' + Math.floor(Math.random() * 10000);
    setFormData((prev) => ({ ...prev, patientId: id }));
  };

  const handleSubmit = () => {
    if (onSubmit) {
      const row = [
        formData.patientId,
        formData.name,
        formData.age,
        formData.location,
        formData.phone,
        formData.address,
        formData.prescription,
        formData.dose,
        formData.visitDate,
        formData.nextVisit,
        formData.physicianId,
        formData.physicianName,
        formData.physicianPhone,
        formData.bill,
      ];
      onSubmit(row);
    }
  };

  return (
    <Grid container spacing={2} padding={3}>
      <Grid item xs={12}>
        <Typography variant="h5" fontWeight="bold">Add Patient</Typography>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField name="patientId" label="Patient ID" fullWidth value={formData.patientId} InputProps={{ readOnly: true }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button fullWidth variant="outlined" onClick={generatePatientId}>Auto Generate</Button>
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField name="name" label="Patient Name (First, Last)" fullWidth value={formData.name} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={2}>
        <TextField name="age" label="Age" fullWidth value={formData.age} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField name="location" label="Location" fullWidth value={formData.location} onChange={handleChange} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField name="phone" label="Phone" fullWidth value={formData.phone} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField name="address" label="Address" fullWidth value={formData.address} onChange={handleChange} />
      </Grid>

      <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

      <Grid item xs={12} sm={6}>
        <TextField name="prescription" label="Prescription" fullWidth value={formData.prescription} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField name="dose" label="Dose" fullWidth value={formData.dose} onChange={handleChange} />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField name="visitDate" label="Visit Date" type="date" fullWidth value={formData.visitDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField name="nextVisit" label="Next Visit" type="date" fullWidth value={formData.nextVisit} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </Grid>

      <Grid item xs={12}><Divider sx={{ my: 2 }} /></Grid>

      <Grid item xs={12} sm={4}>
        <TextField name="physicianId" label="Physician ID" fullWidth value={formData.physicianId} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField name="physicianName" label="Physician Name (First, Last)" fullWidth value={formData.physicianName} onChange={handleChange} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <TextField name="physicianPhone" label="Phone" fullWidth value={formData.physicianPhone} onChange={handleChange} />
      </Grid>

      <Grid item xs={12} sm={4}>
        <TextField name="bill" label="Bill" fullWidth value={formData.bill} onChange={handleChange} />
      </Grid>

      <Grid item xs={12}>
        <Button fullWidth variant="contained" onClick={handleSubmit}>Save Patient</Button>
      </Grid>
    </Grid>
  );
};

export default AddPatientForm;
