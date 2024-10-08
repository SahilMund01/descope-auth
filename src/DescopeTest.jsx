import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { Hospital } from 'lucide-react';
import { authenticateUserSession, getTenantsDetails } from './api';

const DescopeTest = () => {

    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('sessionJwt'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshJwt'));
    const [hospitals, setHospitals] = useState([
        {
            "tenantId": "T2mnVC9sInlAaLEejsYJqs6xNGdH",
            "hospitalName": "test migration 2",
            "adminName": "adarsh",
            "adminEmailId": "adarsh.gaur@techolution.com"
        }
    ]);

    const [searchParams] = useSearchParams();
    const code = searchParams.get('code');
    const navigate = useNavigate();

    // Store token and refresh token in localStorage
    const storeTokens = (sessionJwt, refreshJwt) => {
        localStorage.setItem('sessionJwt', sessionJwt);
        localStorage.setItem('refreshJwt', refreshJwt);
    };

    const [anchorEl, setAnchorEl] = useState(null);


    const onLogout = async () => {
        try {
            localStorage.clear();
            setUserDetails(null);
            navigate('/')

        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    const handleChange = (event) => {
        //   setAuth(event.target.checked);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
        console.log(event.currentTarget);
    };

    const handleClose = (val) => {
        if (val === 'logout') {
            onLogout()

        }
        setAnchorEl(null);
    };


    // Set the token when the component mounts
    useEffect(() => {
        if (code) {
            setToken(code);
        }
    }, [code]);


    const fetchUserDetails = useMemo(() => async (token) => {
        if (!userDetails) {
            setIsLoading(true);
            try {
                const data = await authenticateUserSession(token);
                setUserDetails(data.user);
                const tenantid = data?.user?.userTenants[0]?.tenantId;                
                const tenenatData = tenantid && await getTenantsDetails(tenantid);
                setHospitals(tenenatData);
                storeTokens(data.sessionJwt, data.refreshJwt);
            } catch (error) {
                console.error('Exchange error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    }, [userDetails]); // Re-run the memo only if userDetails changes
    
    useEffect(() => {
        fetchUserDetails(token);
    }, [token]);



    // Render user details
    const renderUserDetails = () => {
        if (!userDetails) return <CircularProgress style={{ margin: 'auto' }} />;
        console.log(userDetails)

        const { name, email } = userDetails;
        const tenant = userDetails?.userTenants[0] || [];

        return (
            <Card style={{ marginTop: '20px', padding: '10px' }}>
                <CardContent>
                    <Typography variant="h5" className='pb-4'>User Details</Typography>
                    <Typography variant="body1"><strong>Name:</strong> {name.split('@')[0].replace('.', ' ') ?? name}</Typography>
                    <Typography variant="body1"><strong>Email: </strong>{email || name || 'N/A'}</Typography>
                    <Typography variant="body1"><strong>Tenant ID:</strong> {tenant.tenantId}</Typography>
                    <Typography variant="body1"><strong>Tenant Name:</strong> {tenant.tenantName}</Typography>
                </CardContent>
            </Card>
        );
    };

    return (
        <div>
            <Header handleClose={handleClose} handleMenu={handleMenu} anchorEl={anchorEl} />

            <div className='w-[90%] m-auto mt-6'>
                <div className="bg-blue-100 border border-blue-300 rounded-md p-4 my-4">
                    <Typography className="text-lg font-bold text-blue-700">
                        Welcome <strong>{userDetails?.name}</strong>, you have successfully logged into your account!
                    </Typography>
                    <Typography className="text-md text-blue-600 mt-2">
                        {/* Please find the below list of hospitals handled by you. */}
                    </Typography>
                </div>

                {isLoading || !hospitals ? (
                    <CircularProgress />
                ) : (
                    <>
                        {/* {renderUserDetails()} */}
                        <div className='mt-4'>
                            {
                                hospitals?.map((hospital, index) => (

                                    <div className="border border-gray-200 rounded-lg p-6 text-center shadow-lg bg-white grid grid-cols-2 gap-6 justify-between items-center mb-8" key={index}>
                                        <h3 className="text-xl font-semibold text-gray-800">{hospital?.hospitalName}</h3>
                                        <div className="flex justify-between gap-6 items-start flex-col">
                                            <div className="min-w-[200px] text-left">
                                                <strong className="font-medium text-gray-700">Admin Name:</strong>
                                                <span className="text-gray-600 ml-2">{hospital?.adminName}</span>
                                            </div>
                                            <div className="min-w-[200px] text-left">
                                                <strong className="font-medium text-gray-700">Tenant ID:</strong>
                                                <span className="text-gray-600 ml-2">{hospital?.tenantId}</span>
                                            </div>
                                            <div className="min-w-[200px] text-left">
                                                <strong className="font-medium text-gray-700">Admin Email ID:</strong>
                                                <span className="text-gray-600 ml-2">{hospital?.adminEmailId}</span>
                                            </div>
                                        </div>
                                    </div>


                                ))
                            }
                        </div>
                    </>
                )}

            </div>



            {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
        </div>
    )
}

export default DescopeTest



