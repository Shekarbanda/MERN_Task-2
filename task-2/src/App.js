import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PostCard from './Components/PostCard';
import LoginPage from './Pages/LoginPage';
import { BrowserRouter, Route, RouterProvider, Routes, useNavigate } from 'react-router-dom';
import SignupPage from './Pages/SignupPage';
import { useEffect } from 'react';
import Home from './Pages/Home';
import { Toaster } from 'react-hot-toast';
import MyPosts from './Pages/MyPosts';
import ResetPass from './Components/ResetPass';

function App() {
 
  return (
    <div className="App">
      <BrowserRouter>
      <Toaster></Toaster>
            <Routes>
              <Route path='/login' element={<LoginPage/>}/>
              <Route path='/signup' element={<SignupPage/>}/>
              <Route path='/myposts' element={<MyPosts/>}/>
              <Route path='/' element={<Home/>}/>
              <Route path='/resetpassword/:token' element={<ResetPass/>}/>
            </Routes>
      </BrowserRouter>
    </div>
  );
}



export default App;
