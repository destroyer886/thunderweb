import './App.css'
import Home from './Pages/Home'
import { Routes , Route, useLocation } from 'react-router-dom'
import Login from './Pages/Login'
import SignUp from './Pages/SignUp'
import Navbar from './Components/Navbar'



export const getcookie = (name)=>{
  const allcookie = document.cookie.split(';');
   
  for (let i = 0; i < allcookie.length; i++) {
    const cookie = allcookie[i].trim(); // Remove leading/trailing spaces
    const split = cookie.split('=');
    
    if (split[0] === name) {
      return decodeURIComponent(split[1]); // Decode the cookie value
    }
  }
  return null;
}





export const setcookie = (name,value, days)=>{
  let date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    let expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}


const urlParams = new URLSearchParams(window.location.search);

const code = urlParams.get('code');

if(code){
  setcookie('token',code,3);
}


function App() {


  return ( 
    <>
    <Navbar/>
    
    <Routes>
    <Route path='/' Component={Home}/>
    <Route path='/login' Component={Login}/>
    <Route path='/sign-up' Component={SignUp}/>
    </Routes>
    
    </>
  
    
  )
}

export default App
