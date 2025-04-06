import React, { useState , useEffect} from 'react';
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

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{editMode ? 'Edit Patient' : 'Add New Patient'}</DialogTitle>
      <DialogContent>
        <TextField label="First Name" name="firstName" fullWidth margin="dense" value={patient.firstName} onChange={handleChange} />
        <TextField label="Last Name" name="lastName" fullWidth margin="dense" value={patient.lastName} onChange={handleChange} />
        <TextField label="Phone" name="phone" fullWidth margin="dense" value={patient.phone} onChange={handleChange} />
        <TextField label="Age" name="age" fullWidth margin="dense" value={patient.age} onChange={handleChange} />
        <TextField label="Gender" name="gender" fullWidth margin="dense" value={patient.gender} onChange={handleChange} />
        <TextField label="Visit Date" name="visitDate" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={patient.visitDate} onChange={handleChange} />
        <TextField label="Next Visit" name="nextVisit" type="date" fullWidth margin="dense" InputLabelProps={{ shrink: true }} value={patient.nextVisit} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">{editMode ? 'Update' : 'Add'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientForm;
