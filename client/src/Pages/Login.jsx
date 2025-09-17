import React,{useContext, useState, useRef} from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Context } from '../Components/AppContext';

import { FaEye } from "react-icons/fa";
import { toast } from 'react-toastify';
import { mobile } from '../Components/AppContext';

function Login(){
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [forgetpasswd , setforgetpasswd] = useState(false);

  const {postReq} = useContext(Context);
  const passwd = useRef(null);

  const handleLogin = async(e)=> {

    e.preventDefault();



   if(forgetpasswd){

    const res = await postReq('/forget-passwd', {email,pass});

    if(res.status === 'ok'){
     toast.success('Link sended successfully');
     }

   }else{
    const query = new URLSearchParams(window.location.search);
    
    const res = await postReq('/login', {email,pass});

    if(res.status === 'ok'){
     window.location.href =  decodeURIComponent(query.get('redirectUrl')) || '/';
    }
   }

    
  };

  const passVisibility = ()=>{
    if(passwd.current.type === 'text'){
      passwd.current.type = 'password';

    }else{

      passwd.current.type = 'text';

    }
  }

  const openGoogleAuthPopup = ()=> {
    const width = 700;
    const height = 800;
    const left = (window.innerWidth / 2) - (width / 2);
    const top = (window.innerHeight / 2) - (height / 2);
    
    const popup = window.open('http://localhost:3000/auth/google', 'Google Auth', `width=${width},height=${height},top=${top},left=${left}`);
    
    // Check if popup was blocked
    if (!popup) {
      alert('Please allow popups for this website');
    }
    
    // Optional: Listen for the popup to close
    const timer = setInterval(() => {
      if (popup.closed) {
        clearInterval(timer);
        // Optionally refresh user data or perform any actions needed after login
        getUserDetails();
      }
    }, 500);
  };

  return (
    <>
    <Div>
      <img src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=740&t=st=1717251520~exp=1717252120~hmac=4954010040bd5c0b1c6c367f7128d124425fec45c84ebe53993461f0d6f89d17" alt="" />
      <form onSubmit={handleLogin} className="login-form">
      <h2>Welcome, User</h2>
      {forgetpasswd ? 

      <>
      <p>Email:</p>
        <div className="relative">
        <input placeholder='Email' type="email" onChange={(e)=> setemail(e.target.value)} required />
        <i class="ri-user-line">
        </i>
        </div>

        <A type='submit'>Send Link</A>


      </>

      
      
      : <>
        <p>Email:</p>
        <div className="relative">
        <input placeholder='Email' type="email" onChange={(e)=> setemail(e.target.value)} required />
        <i class="ri-user-line">
          
        </i>
        </div>
        <p>Password:</p>
        <div className="relative">
        <input ref={passwd} placeholder='Password' type="password" onChange={(e)=> setpass(e.target.value)} required />
        <i class="ri-key-line">
          
        </i>
        <FaEye onClick={passVisibility} style={{position: 'absolute', right: '12px', cursor: 'pointer'}}/>
        </div>



        <A type='submit'>Log In</A>
 
        <Link onClick={()=> setforgetpasswd(!forgetpasswd)} style={{fontSize: 13}}>Forget password</Link>
        <Link to={'/Sign-up'} style={{fontSize: 13, marginTop: '-10px'}}>Create User</Link>
      </>
       
      
    }
      </form>

    </Div>
</> 
  )
}


const Div = styled.div`
background-color: #ffffff;
height: 93dvh;
width: 100%;
display: flex;
align-items: center;
justify-content: ${mobile ? 'center' : 'space-evenly'};
padding-right: ${mobile ? '0em' : '4rem'};
flex-direction: ${mobile ? 'column-reverse' : 'row'};


input{
  width: 16rem;
  height: 2rem;
  background-color: #ffffff;
  /* outline: none; */
  /* border: none; */
  border: 1px solid black;
  padding: 0 1.4rem;
  border-radius: 10px;
  
  
  
}

.relative{
  position: relative;
  align-items:center;
  display: flex;
  width: 16rem;
  height: 2rem;
 



  i{
  position: absolute;
  margin-left: 4px;
  
  


}
}

.login-form{
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
 gap: 0.6rem;
}


img{
 width: ${mobile ? '95%' : '40%'};
 
}
`


const A = styled.button`
background-color: #0a8292;
  padding: 0.5rem;
  border-radius: 0.7rem;
  color: white;
  display: inline-block;
  margin: 10px 0;

  &:hover{
    background-color: #18474d;
    color: white;
  }

`

export default Login

