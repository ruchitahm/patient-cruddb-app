import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TableHead,
} from '@mui/material';
import {
  initGoogleAPI,
  signIn,
  signOut,
  isSignedIn,
  listGoogleSheets,
  getSheetData,
  loadSheetsAPI,
  appendPatientData,
  deletePatientData,
  updatePatientData
} from './services/googleDriveService';
import PatientForm from './components/PatientForm';

function App() {
  const [sheets, setSheets] = useState([]);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [sheetData, setSheetData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    initGoogleAPI();
  }, []);

  const handleLogin = async () => {
    await signIn();
    if (isSignedIn()) {
      console.log("User signed in!");
      fetchSheets();
    }
  };

  const handleLogout = () => {
    signOut();
    setSheets([]);
    setSelectedSheetId(null);
    setSheetData([]);
    console.log("User signed out!");
  };

  const fetchSheets = async () => {
    try {
      const result = await listGoogleSheets();
      setSheets(result);
    } catch (error) {
      console.error('Error fetching sheets:', error);
    }
  };

  const handleSheetSelect = async (id) => {
    await loadSheetsAPI();
    setSelectedSheetId(id);
    const data = await getSheetData(id);
    setSheetData(data);
  };

  const handleAddPatient = async (patientData) => {
    await appendPatientData(selectedSheetId, patientData);
    const updatedData = await getSheetData(selectedSheetId);
    setSheetData(updatedData);
  };

  const handleEdit = (index) => {
    const row = sheetData[index];
    const [firstName, lastName, phone, age, gender, visitDate, nextVisit] = row;
    setEditData({ firstName, lastName, phone, age, gender, visitDate, nextVisit, rowIndex: index });
    setEditMode(true);
    setShowForm(true);
  };
  
  const handleDelete = async (index) => {
    await deletePatientData(selectedSheetId, index);
    const updatedData = await getSheetData(selectedSheetId);
    setSheetData(updatedData);
  };
  
  const handleFormSubmit = async (data) => {
    if (editMode && data.rowIndex != null) {
      await updatePatientData(selectedSheetId, data.rowIndex, data);
    } else {
      await appendPatientData(selectedSheetId, data);
    }
  
    const updatedData = await getSheetData(selectedSheetId);
    setSheetData(updatedData);
    setEditMode(false);
    setEditData(null);
  };

  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Patient Database App
          </Typography>
          <Button color="inherit" onClick={handleLogin}>Sign in</Button>
          <Button color="inherit" onClick={handleLogout}>Sign out</Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Button variant="contained" onClick={fetchSheets}>
              List Google Sheets
            </Button>
          </Grid>

          {sheets.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Available Sheets</Typography>
              <Grid container spacing={1}>
                {sheets.map((sheet) => (
                  <Grid item key={sheet.id}>
                    <Button variant="outlined" onClick={() => handleSheetSelect(sheet.id)}>
                      {sheet.name}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {selectedSheetId && (
            <Grid item xs={12}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Patients List</Typography>
                <Button variant="contained" onClick={() => setShowForm(true)}>Add Patient</Button>
              </Grid>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  {sheetData.length > 0 && (
                    <>
                     <TableHead>
  <TableRow>
    {sheetData[0].map((header, idx) => (
      <TableCell key={idx}>{header}</TableCell>
    ))}
    <TableCell>Actions</TableCell>
  </TableRow>
</TableHead>

<TableBody>
  {sheetData.slice(1).map((row, i) => {
    const actualIndex = i + 1; // offset for header
    const rowKey = row.join('-') + actualIndex; // make key more unique

    return (
      <TableRow key={rowKey}>
        {row.map((cell, j) => (
          <TableCell key={j}>{cell}</TableCell>
        ))}
        <TableCell>
          <Button onClick={() => handleEdit(actualIndex)} size="small">Edit</Button>
          <Button onClick={() => handleDelete(actualIndex)} size="small" color="error">Delete</Button>
        </TableCell>
      </TableRow>
    );
  })}
</TableBody>


                    </>
                  )}
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </Container>

      <PatientForm
  open={showForm}
  handleClose={() => {
    setShowForm(false);
    setEditData(null);
    setEditMode(false);
  }}
  handleSubmit={handleFormSubmit}
  editMode={editMode}
  editData={editData}
/>

    </>
  );
}

export default App;
