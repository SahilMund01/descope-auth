import { useState } from 'react';
import './App.css';
import logo from './assets/hospital-logo.avif'
import { Check } from 'lucide-react';
import { handleSSOLogin } from './api';


function SignIn() {
  
  const [formData, setFormData] = useState({
    email: '',
    redirectUrl: '',
    tenantId : ''
  });
  const [errors, setErrors] = useState({
    email: '',
    redirectUrl: '',
    tenantId : ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: '', redirectUrl: '' , tenantId : ''};

    // if (!formData.email) {
    //   newErrors.email = 'Email is required';
    //   isValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   newErrors.email = 'Please enter a valid email';
    //   isValid = false;
    // }

    if(!formData.email && !formData.tenantId){
      newErrors.email = "Please enter either tenantId or email to continue"
    }

    if (formData.redirectUrl && !isValidUrl(formData.redirectUrl)) {
      newErrors.redirectUrl = 'Please enter a valid URL';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (error) {
      console.error("error", error)
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const redirectUrl = formData.redirectUrl || 'http://localhost:5000/descope-test';
      const encodedRedirectUrl = encodeURIComponent(redirectUrl);
      const email = encodeURIComponent(formData.email); // Using email as tenant ID
      const tenant = formData.tenantId; // Using email as tenant ID
      

      const data = await handleSSOLogin({
        email, tenant, redirectUrl : encodedRedirectUrl
      })

      console.log(data);
     
      if (data.url) {
        setIsSuccess(true);
        window.open(data.url, '_blank');
      } else {
        throw new Error('No redirect URL received');
      }
      console.log('API Response:', data);
      // Handle successful response here (e.g., redirect user)

    } catch (error) {
      console.error('Error during API call:', error);
      setErrors(prev => ({
        ...prev,
        api: 'Failed to authenticate. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };



  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-blue-50 to-white">
        <div className="w-full max-w-md text-center space-y-8">
          <div className="animate-bounce-slow">
            <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-green-500" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 animate-fade-in">
              Successfully Redirected!
            </h2>
            <p className="text-lg text-gray-600 animate-fade-in-delayed">
              You have been redirected to Okta Sign-in
            </p>
          </div>

         
        </div>
      </div>
    );
  }

  return (
    <div>
       <div className="grid justify-center items-center grid-cols-2">
       <div className="flex justify-center bg-[#3852] h-screen items-center">
         <img src={logo} alt="App Logo" className="w-3/2 mix-blend-multiply" />
       </div>
       {/* <Descope
         flowId="sign-in"
         theme={getInitialTheme()}
         onSuccess={(e) => {
           setLoginResp(e?.detail.user?.userTenants);
           console.log(e?.detail);
           console.log(e?.detail?.user?.email);
           localStorage.setItem('user-data', JSON.stringify({
            role: "admin",
            email : e?.detail?.user?.name
           }))
           setUser((prev) => {
            return {
              ...prev,
              role: "admin",
              email : e?.detail?.user?.name
            }
           })
           const roleNames = e?.detail.user?.userTenants[0].roleNames;
           setIsAdmin(roleNames.length == 0 ? false : true)
           fetchData();
         }}
         onError={(err) => {
           console.log('Error!', err);
         }}
       /> */}

    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full p-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-8">Welcome!</h1>
        </div>

        <div className="text-center mb-6">
          <p className="text-gray-600">
            By signing in, I agree to the Company&apos;s &nbsp;
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Statement
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service.
            </a>
          </p>
          <br/>
          <p className="text-gray-600">
          To proceed with login, please provide email, tenant ID, or both            
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              disabled={isLoading}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                isLoading ? 'bg-gray-100' : ''
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="tenantId"
              value={formData.tenantId}
              onChange={handleChange}
              placeholder="Tenant Id"
              disabled={isLoading}
              className={`w-full px-4 py-3 border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                isLoading ? 'bg-gray-100' : ''
              }`}
            />
            {errors.tenantId && (
              <p className="mt-1 text-sm text-red-500">{errors.tenantId}</p>
            )}
          </div>

          <div>
            <input
              type="url"
              name="redirectUrl"
              value={formData.redirectUrl}
              onChange={handleChange}
              placeholder="Redirect URL*"
              disabled={isLoading}
              required
              className={`w-full px-4 py-3 border ${
                errors.redirectUrl ? 'border-red-500' : 'border-gray-300'
              } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                isLoading ? 'bg-gray-100' : ''
              }`}
            />
            {errors.redirectUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.redirectUrl}</p>
            )}
          </div>

          {errors.api && (
            <div className="text-center text-red-500 text-sm">
              {errors.api}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
     </div>
    
    
    </div>
  );
}

export default SignIn;
