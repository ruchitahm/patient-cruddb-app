// googleDriveService.js
import { gapi } from 'gapi-script';

const CLIENT_ID = '225322870152-ugf2ri5olei5i6iprlpacl88ekji5hep.apps.googleusercontent.com';
const API_KEY = 'AIzaSyA646MBPIZ99sXj7UIDdlw8SNzhae_HACc';
const SCOPES = 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.readonly';

export const initGoogleAPI = () => {
    gapi.load('client:auth2', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        scope: SCOPES,
      });
  
      // Load Drive API after init
      await gapi.client.load('drive', 'v3');
      console.log('Drive API loaded');
    });
  };  

export const signIn = async () => {
  await gapi.auth2.getAuthInstance().signIn();
};

export const signOut = () => {
  gapi.auth2.getAuthInstance().signOut();
};

export const isSignedIn = () => {
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

export async function listGoogleSheets() {
    try {
      const response = await gapi.client.drive.files.list({
        q: "mimeType='application/vnd.google-apps.spreadsheet'",
        fields: "files(id, name)",
      });
      console.log("Drive API response:", response);
      return response.result.files;
    } catch (error) {
      console.error("Error fetching sheets:", error);
      return [];
    }
  }

  export const getSheetData = async (fileId) => {
    try {
      const response = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId: fileId,
      });
  
      const sheets = response.result.sheets;
      if (!sheets || sheets.length === 0) {
        throw new Error("No sheets found in spreadsheet.");
      }
  
      const sheetName = sheets[0].properties.title;
      const range = `${sheetName}`;
  
      const result = await gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: fileId,
        range,
      });
  
      return result.result.values;
    } catch (error) {
      console.error("Error reading sheet data:", error);
      return [];
    }
  };
  
  export async function loadSheetsAPI() {
    return new Promise((resolve, reject) => {
      gapi.client.load('sheets', 'v4', () => {
        console.log('Sheets API loaded');
        resolve();
      });
    });
  }
  
//   export const appendPatientData = async (spreadsheetId, data) => {
//     const values = [
//     //   [data.firstName, data.lastName, data.phone, data.age, data.gender, data.visitDate, data.nextVisit]
//     [data.patientId,
//         data.name,
//         data.location,
//         data.age,
//         data.phone,
//         data.address,
//         data.prescription,
//         data.dose,
//         data.visitDate,
//         data.nextVisit,
//         data.physicianId,
//         data.physicianName,
//         data.physicianPhone,
//         data.bill]
//     ];
  
//     try {
//       await gapi.client.sheets.spreadsheets.values.append({
//         spreadsheetId,
//         range: 'Sheet1',
//         valueInputOption: 'USER_ENTERED',
//         resource: { values },
//       });
//       console.log('Patient added successfully');
//     } catch (error) {
//       console.error('Error appending patient:', error);
//     }
//   };
  
  export const appendPatientData = async (sheetId, data) => {
    const values = [[
      data.patientId, data.name, data.location, data.age, data.phone,
      data.address, data.prescription, data.dose, data.visitDate,
      data.nextVisit, data.physicianId, data.physicianName, data.physicianPhone, data.bill
    ]];
  
    const body = { values };
  
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Sheet1', // ✅ Use sheet name only — no cell reference
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      resource: body
    });
  };

  
  export const updatePatientData = async (spreadsheetId, rowIndex, data) => {
    const values = [[      
      data.patientId,
      data.name,
      data.location,
      data.age,
      data.phone,
      data.address,
      data.prescription,
      data.dose,
      data.visitDate,
      data.nextVisit,
      data.physicianId,
      data.physicianName,
      data.physicianPhone,
      data.bill
    ]];
  
    const range = `Sheet1!A${rowIndex + 1}:N${rowIndex + 1}`;
  
    try {
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        resource: { values },
      });
      console.log('Patient updated');
    } catch (error) {
      console.error('Update error:', error);
    }
  };
  
  export const deletePatientData = async (spreadsheetId, rowIndex) => {
    try {
      await gapi.client.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0, // Sheet1 is usually sheetId 0. Confirm if needed.
                  dimension: 'ROWS',
                  startIndex: rowIndex,
                  endIndex: rowIndex + 1,
                },
              },
            },
          ],
        },
      });
      console.log('Row deleted');
    } catch (error) {
      console.error('Delete error:', error);
    }
  };
  
  