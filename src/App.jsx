import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './SignIn';
import DescopeTest from './DescopeTest';
import Admin from './Admin';


function App() {  
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/" element={<Admin/>} />
      <Route path="/descope-test" element={<DescopeTest />} />
      {/* <Route path="/descope-test" element={<DescopeTest />} /> */}
      <Route path="/admin" element={<SignIn />} />
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
