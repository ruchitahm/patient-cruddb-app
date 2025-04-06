import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField
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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [readOnlyView, setReadOnlyView] = useState(false);


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

  const handleAddPatient = () => {
    setEditData(null);
    setEditMode(false);
    setShowForm(true);
  };

  const handleEdit = (index) => {
    const row = sheetData[index];
    const [patientId, name, location, age, phone, address, prescription, dose, visitDate, nextVisit, physicianId, physicianName, physicianPhone, bill] = row;
    setEditData({
      patientId, name, location, age, phone, address,
      prescription, dose, visitDate, nextVisit,
      physicianId, physicianName, physicianPhone, bill, rowIndex: index
    });
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
      setSearchTerm('');
      setShowSearch(false);
    } else {
      await appendPatientData(selectedSheetId, data);
    }

    const updatedData = await getSheetData(selectedSheetId);
    setSheetData(updatedData);
    setEditMode(false);
    setEditData(null);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase().trim();
    setSearchTerm(value);
    setShowSearch(value.length > 0);
    if (value.length === 0 || sheetData.length === 0) {
      setSearchResults([]);
      return;
    }
  
    const results = sheetData
      .slice(1)
      .map((row, idx) => ({ row, originalIndex: idx + 1 })) // +1 because header is at index 0
      .filter(({ row }) =>
        row.some(cell => cell?.toString().toLowerCase().includes(value))
      );
  
    setSearchResults(results);
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
          {/* <Grid item xs={12}>
            <Button variant="contained" onClick={fetchSheets}>List Google Sheets</Button>
          </Grid> */}

          {sheets.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6">Select Available Google Sheets</Typography>
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
            <>
              <Grid item xs={12}>
                <TextField
                  label="Search Patients"
                  variant="outlined"
                  fullWidth
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </Grid>

              <Grid item xs={12}>
                <Button variant="contained" onClick={handleAddPatient}>Add New Patient</Button>
              </Grid>

              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                      {/* patientId, name, location, age, phone, address, prescription, dose, visitDate, nextVisit, physicianId, physicianName, physicianPhone, bill] */}
                        <TableCell>Patient ID</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Age</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Address</TableCell>
                        <TableCell>Prescription</TableCell>
                        <TableCell>Dose</TableCell>
                        <TableCell>Visit Date</TableCell>
                        <TableCell>Next Visit</TableCell>
                        <TableCell>Physician Id</TableCell>
                        <TableCell>Physician Name</TableCell>
                        <TableCell>Physician Phone</TableCell>
                        <TableCell>Bill</TableCell>
                        <TableCell>Actions</TableCell>

                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {(showSearch ? searchResults : sheetData.slice(1).map((row, idx) => ({ row, originalIndex: idx + 1 }))).map(({ row, originalIndex }, index) => (
  <TableRow key={index}>
    {row.map((cell, i) => (
      <TableCell key={i}>{cell}</TableCell>
    ))}
    <TableCell>
      <Button size="small" onClick={() => handleEdit(originalIndex)}>Edit</Button>
      <Button size="small" color="error" onClick={() => handleDelete(originalIndex)}>Delete</Button>
    </TableCell>
  </TableRow>
))}

                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </>
          )}
        </Grid>
      </Container>

      <PatientForm
        open={showForm}
        handleClose={() => setShowForm(false)}
        handleSubmit={handleFormSubmit}
        editData={editData}
        editMode={editMode}
      />
    </>
  );
}

export default App;
