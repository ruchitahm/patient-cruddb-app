import React, { useState , useEffect} from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Grid } from '@mui/material';

const initialPatient = {
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
};

const PatientForm = ({ open, handleClose, handleSubmit, editData, editMode }) => {
  const [patient, setPatient] = useState(editData || initialPatient);

  useEffect(() => {
    if (editMode && editData) {
      setPatient(editData);
    } else {
      setPatient(initialPatient);
    }
  }, [editData, editMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const onSubmit = () => {
    handleSubmit(patient);
    setPatient(initialPatient);
    handleClose();
  };

  const generatePatientId = () => {
    const id = 'P' + Math.floor(Math.random() * 10000);
    setPatient((prev) => ({ ...prev, patientId: id }));
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
      {/* <Button fullWidth variant="outlined" onClick={generatePatientId}>Auto Generate</Button>
      <TextField label="PatientId" name="patientId" fullWidth margin="dense" value={patient.patientId} onChange={handleChange}  /> */}
      <Grid container spacing={1}>
  <Grid item xs={8}>
    <TextField label="PatientId" name="patientId" fullWidth margin="dense" value={patient.patientId} onChange={handleChange} />
  </Grid>
  <Grid item xs={4}>
    <Button fullWidth variant="outlined" onClick={generatePatientId} sx={{ mt: 1.5 }}>
      Auto Generate
    </Button>
  </Grid>
</Grid>

        <TextField label="Patient Name(First, Last Name)" name="name" fullWidth margin="dense" value={patient.name} onChange={handleChange} />
        <TextField label="Location" name="location" fullWidth margin="dense" value={patient.location} onChange={handleChange} />
        <TextField label="Age" name="age" fullWidth margin="dense" value={patient.age} onChange={handleChange} />
        <TextField label="Phone" name="phone" fullWidth margin="dense" value={patient.phone} onChange={handleChange} />
        <TextField label="Address" name="address" fullWidth margin="dense" value={patient.address} onChange={handleChange} />
        <hr></hr>
        <TextField label="Prescription" name="prescription" fullWidth margin="dense" value={patient.prescription} onChange={handleChange} />
        <TextField label="Dose" name="dose" fullWidth margin="dense" value={patient.dose} onChange={handleChange} />
        <TextField label="Visit Date" name="visitDate" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={patient.visitDate} onChange={handleChange} />
        <TextField label="Next Visit" name="nextVisit" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={patient.nextVisit} onChange={handleChange} />
        <hr></hr>
        <TextField label="PhysicianId" name="physicianId" fullWidth margin="dense" value={patient.physicianId} onChange={handleChange} />
        <TextField label="PhysicianName" name="physicianName" fullWidth margin="dense" value={patient.physicianName} onChange={handleChange} />
        <TextField label="PhysicianPhone" name="physicianPhone" fullWidth margin="dense" value={patient.physicianPhone} onChange={handleChange} />
        <TextField label="Bill" name="bill" fullWidth margin="dense" value={patient.bill} onChange={handleChange} />

      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">{editMode ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientForm;
