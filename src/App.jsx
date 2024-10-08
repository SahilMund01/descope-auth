import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import DescopeTest from './DescopeTest';


const getInitialTheme = () => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

function App() {  
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<SignIn/>} />
      <Route path="/descope-test" element={<DescopeTest />} />
      {/* <Route
        path="/users/:id"
        render={({ match }) => (
          <User id={match.params.id} />
        )}
      /> */}
    </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
