import axios from "axios";

const API_BASE_URL = "https://dev.qsight.health/api";
// const API_BASE_URL = "https://proj-qsight.techo.camp/api";

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
  },
};

export async function handleSSOLogin(data) {
  const {email, tenant, redirectUrl} = data;
  try {
    const requestData = {
      "stepup": true,
      "customClaims": {
        "additionalProp1": "string",
        "additionalProp2": "string",
        "additionalProp3": "string"
      },
      "mfa": true,
      "ssoAppId": "string",
      "templateOptions": {},
      "locale": "string",
      "pkceChallenge": "string"
    };
    

    let apiUrl;
    if(email && tenant){
        apiUrl = `${API_BASE_URL}/auth/sso?tenantId=${tenant}&email=${email}&redirectUrl=${redirectUrl}`;
      }else if(email){
        apiUrl = `${API_BASE_URL}/auth/sso?email=${email}&redirectUrl=${redirectUrl}`;
      }else if(tenant){
        apiUrl = `${API_BASE_URL}/auth/sso?tenantId=${tenant}&redirectUrl=${redirectUrl}`;
      }

    console.log(apiUrl)
    const response = await axios.post(apiUrl, 
      requestData, axiosConfig);
    
    console.log('resp', response);
    if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.data;

  } catch (error) {
    console.error('SSO Login Error:', error);
    return error;

    // Handle login errors gracefully (e.g., display error message to user)
  }
}

export async function authenticateUserSession(token) {

  try {
    
    const response = await axios.post(
      `${API_BASE_URL}/auth/sso/exchange`, { code : token} , axiosConfig)
    
    console.log('response', response);

    if (response.status !== 200) {
      throw new Error(`Exchange failed (${response.status})`);
    }

    return response.data;
    
  } catch (error) {
    console.error('authenticateUserSession Error..',error);
    return error;
  }
  
}


export async function getTenantsDetails(tenantId) {
  try {

    const config = {
      headers: {
        // "Authorization": `Bearer ${token}`,
        'Accept': '*/*',
        'ngrok-skip-browser-warning': true, // TODO: remove this in case ngrok api is not used
      },
    };
    
    const response = await axios.get(`${API_BASE_URL}/data?tenantId=${tenantId}`, config);
    // const response = await axios.get(`${API_BASE_URL}/data?tenantId=${tenantId}`);
    console.log(' getTenantsDetails response', response);

    if (response.status !== 200) {
      throw new Error(`Exchange failed (${response.status})`);
    }

    return response.data;
    
  } catch (error) {
    console.error('getTenantsDetails Error..',error);
    
    return error?.response?.status === 500 && [];
  }
  
}


