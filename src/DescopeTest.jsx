import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from './Header';
import { Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { authenticateUserSession, getTenantsDetails } from './api';
import axios from 'axios';

const DescopeTest = () => {

    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('sessionJwt'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshJwt'));
    const [code, setCode] = useState("");
    const [tenantId,setTenantId] = useState(localStorage.getItem('__v__'));
    const [hospitals, setHospitals] = useState([]);

    const [searchParams] = useSearchParams();

    const icode = searchParams.get('code');

    const navigate = useNavigate();

    // Store token and refresh token in localStorage
    const storeTokens = (sessionJwt, refreshJwt) => {
        localStorage.setItem('sessionJwt', sessionJwt);
        localStorage.setItem('refreshJwt', refreshJwt);
        setToken(sessionJwt);
        setRefreshToken(refreshJwt);
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

    const refreshSessionToken = async (refreshJwt) => {
        try {
            const response = await axios.post('https://proj-qsight.techo.camp/api/auth/session/refresh', {
                refreshToken: refreshJwt,
            });
            const { sessionJwt, refreshJwt: newRefreshJwt } = response.data;
            storeTokens(sessionJwt, newRefreshJwt);
            return sessionJwt;
        } catch (error) {
            console.error('Error refreshing session token', error);
            onLogout(); // Log the user out if the refresh token fails
        }
    };



    const fetchUserDetails = async () => {
            setIsLoading(true);
            try {
                console.log(hospitals);
                console.log(token);
                console.log(tenantId);
                if(icode && !token){
                    const data = await authenticateUserSession(icode);
                    setUserDetails(data.user);
                    console.log('session data fetched');
                    
                    const tenantid = data?.user?.userTenants[0]?.tenantId; 
                    setTenantId(tenantId); 
                    localStorage.setItem('__v__', data?.user?.userTenants[0]?.tenantId);              
                    const tenantData = tenantid && await getTenantsDetails(tenantid, data?.sessionJwt);
                    console.log('tenant data fetched');
    
                    setHospitals(tenantData);
                    storeTokens(data.sessionJwt, data.refreshJwt);
                }
                else if(hospitals?.length === 0 && token && tenantId){
                          

                    const tenantData = tenantId && await getTenantsDetails(tenantId, token);
                    console.log('tenant data fetched');
    
                    setHospitals(tenantData);
                }
                
            } catch (error) {
                console.error('Exchange error:', error);
            } finally {
                setIsLoading(false);
            }
        
    }; // Added `code` dependency

    

    // const fetchUserDetails = useMemo(() => async (token) => {
    //     if (!userDetails && token) {
    //         setIsLoading(true);
    //         try {
    //             const data = await authenticateUserSession(token);
    //             console.log('data', data)
    //             setUserDetails(data.user);
    //             const tenantid = data?.user?.userTenants[0]?.tenantId;
    //             const tenantData = tenantid && await getTenantsDetails(tenantid, token);
    //             setHospitals(tenantData);
    //             storeTokens(data.sessionJwt, data.refreshJwt);
    //         } catch (error) {
    //             if (error.response?.status === 401 && refreshToken) {
    //                 // Token expired, attempt to refresh it
    //                 const newToken = await refreshSessionToken(refreshToken);
    //                 if (newToken) {
    //                     fetchUserDetails(newToken); // Retry fetching user details with the new token
    //                 }
    //             } else {
    //                 console.error('Error fetching user details', error);
    //             }
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     }
    // }, [userDetails, refreshToken]); // Re-run the memo only if userDetails or refreshToken changes

    // useEffect(() => {
    //     const icode = searchParams.get('code');
    //     if (icode) {
    //         setCode(icode);
    //     }
    // }, [searchParams]);

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
                        Welcome !! you have successfully logged into your account!
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

                        {
                            hospitals?.length === 0 ? 


                            <div className='mt-4'>
                           

                                    <div className="border border-gray-200 rounded-lg p-6 text-center shadow-lg bg-white grid grid-cols-2 gap-6 justify-between items-center mb-8">
                                    <Typography className="text-md text-blue-600 mt-2">
                        No Tenant Information found for the logged in user.
                    </Typography>
                                    </div>
                        </div>

                            :

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
                        }
                        
                    </>
                )}

            </div>



            {/* <pre>{JSON.stringify(userDetails, null, 2)}</pre> */}
        </div>
    )
}

export default DescopeTest



