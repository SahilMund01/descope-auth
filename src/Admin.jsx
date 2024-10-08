import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Typography, Button, Dialog, DialogTitle, TextField, DialogActions, IconButton, DialogContent, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useEffect, useState } from 'react'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { fetchAndProcessAdminData } from './api';

const Admin = ({ data, email , onSetUser, isAdmin}) => {

  // const BASE_URL = "https://9848-139-167-129-22.ngrok-free.app";
  const BASE_URL = "https://dns-ssl.online";

  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const adminData = await fetchAndProcessAdminData();
    setHospitals(adminData);
  };

  const handleOpen = (hospital = null, isNew = false) => {
    setSelectedHospital(hospital || {});
    setInitialValues(hospital || {});
    setIsNew(isNew);
    setOpen(true);
    setEditMode(isNew);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedHospital(null);
    setInitialValues(null);
    setEditMode(false);
    setIsNew(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const createHospitals = async (selectedHospital) => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/tenant/create`, {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        }),
        body: JSON.stringify(selectedHospital),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      setSnackbarMessage('Hospital onboarded successfully!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      
      // Update the hospitals state immediately
      setHospitals(prevHospitals => [...prevHospitals, { ...selectedHospital, srNo: prevHospitals.length + 1 }]);
      
      handleClose();
    } catch (error) {
      console.log(error);
      setSnackbarMessage('An error occurred while saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedHospital(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const requiredFields = ['hospitalName', 'hospitalDesc', 'adminName', 'adminEmail'];
    if (!isNew) requiredFields.push('tenantId');
    return requiredFields.every(field => selectedHospital[field]);
  };

  const handleSave = async () => {
    if (!validateFields()) {
      setSnackbarMessage('Please fill out all fields before saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    try {
      if (isNew) {
        await createHospitals(selectedHospital);
      } else {
        // Handle updating existing hospital here
        setHospitals(prevHospitals => 
          prevHospitals.map(hospital =>
            hospital.hospitalName === initialValues.hospitalName ? selectedHospital : hospital
          )
        );
        setSnackbarMessage('Hospital updated successfully!');
        setSnackbarSeverity('success');
      }

      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('An error occurred while saving.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('error', error);
    } finally {
      setLoading(false);
      handleClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDiscard = () => {
    setSelectedHospital(initialValues);
    setEditMode(false);
    setOpen(false);
  };



  return (
    <div className='w-[90%] m-auto mt-6'>
      <div className="bg-blue-100 border border-blue-300 rounded-md p-4 my-4">
        <Typography className="text-lg font-bold text-blue-700">
          Welcome <strong>{email}</strong>, you have successfully logged into your admin account!
        </Typography>
        <Typography className="text-md text-blue-600 mt-2">
          Please find the below list of hospitals handled by you.
        </Typography>
      </div>


      <div className='flex justify-between items-center'>
        <Typography
          variant="h5"
          component="h1"
          className="font-medium text-[23px] bg-gradient-to-r from-[#002856] to-[#385390] py-4 bg-clip-text text-transparent font-roboto"
        >
          Hospitals ({hospitals?.length})
        </Typography>



        <Button sx={{ background: '' }} variant="contained" onClick={() => handleOpen(null, true)}>Add New</Button>

      </div>


      <TableContainer component={Paper} elevation={3}>
        <Table aria-label="simple table" >
          <TableHead>
            <TableRow>
              <TableCell><strong>S.N</strong></TableCell>
              <TableCell align="center" > <strong>Hospital Name</strong></TableCell>
              <TableCell align="center" > <strong>Hospital Desc</strong></TableCell>
              <TableCell align="center"><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Action</strong></TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {hospitals?.map((row) => (
              <TableRow
                key={row.srNo}
              >
                <TableCell component="th">{row.srNo}</TableCell>

                <TableCell component="th" align="center" scope="row">
                  {row.hospitalName}
                </TableCell>
                <TableCell component="th" align="center" scope="row">
                  {row.hospitalDesc}
                </TableCell>
                <TableCell component="th" align="center" scope="row">
                  <Chip label={row.status || "Onboard Complete"} color="success" variant="outlined" />

                </TableCell>
                <TableCell component="th" align="right" scope="row" width={"200px"}>
                  <div className='d-flex justify-between items-center gap-4 '>
                    <RemoveRedEyeIcon className='mr-2 text-neutral-600 cursor-pointer hover:text-blue-600'
                      onClick={() => handleOpen(row)} />
                  </div>

                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={open}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
        disableEscapeKeyDown
      >
        <DialogTitle id="dialog-title">
          <Typography variant="h6">{isNew ? 'Add New Hospital' : 'Hospital Details'}</Typography>
          {!isNew && (
            // <IconButton
            //   edge="end"
            //   color="inherit"
            //   onClick={handleEdit}
            //   aria-label="edit"
            //   style={{ position: 'absolute', right: 70, top: 8 }}
            // >
            //   <EditIcon />
            // </IconButton>
            <></>
          )}
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
            style={{ position: 'absolute', right: 20, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <TextField
            label="hospital Name"
            name="hospitalName"
            value={selectedHospital?.hospitalName || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Hospital Description"
            name="hospitalDesc"
            value={selectedHospital?.hospitalDesc || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            multiline
            minRows={2}
            margin="normal"
          />
          {/* <TextField
            label="Address"
            name="address"
            value={selectedHospital?.address || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          /> */}
          <TextField
            label="Admin Name"
            name="adminName"
            value={selectedHospital?.adminName || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Admin Email"
            name="adminEmail"
            value={selectedHospital?.adminEmail || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />
          {!isNew && <TextField
            label="Tenant ID"
            name="tenantId"
            value={selectedHospital?.tenantId || ''}
            onChange={handleChange}
            disabled={!editMode}
            fullWidth
            margin="normal"
          />}
        </DialogContent>
        <DialogActions sx={{ marginRight: '15px', marginBottom: '20px' }}>
          {editMode && (
            <>
              <Button onClick={handleDiscard} variant='outlined' color="secondary">
                Discard
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                disabled={loading} // Disable button while loading
                startIcon={loading ? <CircularProgress size={24} /> : null} // Show loader when loading
              >
                {loading ? 'Saving' : 'Save'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose}>
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default Admin