import React, { useState, useContext, useRef } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Context, mobile } from '../Components/AppContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";




function SignUp() {
  const [fname, setfname] = useState('');
  const [lname, setlname] = useState('');
  const [email, setemail] = useState('');
  const [pass, setpass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [otp, setotp] = useState('');
  const [otpsend, setotpsend] = useState(false);

  const [errors, setErrors] = useState({}); // State to track errors

  const { postReq } = useContext(Context);
  const nav = useNavigate();
  const btnref = useRef(null)

  

  const createUser = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Field validation
    let validationErrors = {};
    if (!fname) validationErrors.fname = 'First name is required';
    if (!lname) validationErrors.lname = 'Last name is required';
    if (!email) validationErrors.email = 'Email is required';
    if (!pass) validationErrors.pass = 'Password is required';
    if (!confirmPass) validationErrors.confirmPass = 'Confirm password is required';
    if (pass !== confirmPass) validationErrors.confirmPass = 'Passwords do not match';
    if (!otp && otpsend) validationErrors.otp = 'Otp is required';

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Set validation errors
      return; // Stop submission if there are validation errors
    }

    const data = {
      fname,
      lname,
      email,
      pass,
      otp
    };

    const response = await postReq(otpsend ? '/verify-otp' :'/sign-up', data);

    if (response) {
      if (response.status === 'ok') {
       if(otpsend){
        toast.success('User Created Successfully');
        setTimeout(()=>{

          nav('/login')

        },2000)
       }else{
        setotpsend(true)
        toast.success('Otp sended successfully');
       }
      } else {
        toast.error(response.error);
      }
    }
  };

  return (
    <Div>
      <img
        src="https://img.freepik.com/free-vector/sign-concept-illustration_114360-125.jpg?w=740&t=st=1717254474~exp=1717255074~hmac=c230d3386cf94171d03677e40deeabd5ba360ff820e24468273ee0e6bcc42b59"
        alt=""
      />
      <form className="login-form" onSubmit={createUser}>

        <h2>Create Account</h2>
        
        {otpsend ?
        <>
        <p>Enter Otp:</p>
        <div className={`relative ${errors.confirmPass ? 'error' : ''}`}>
        <input
          placeholder="Enter Otp"
          type="text"
          onChange={(e) => setotp(e.target.value)}
          value={otp}
          required
        />
        <i className="ri-key-fill"></i>
      </div>

      
      {errors.otp && <ErrorMsg>{errors.otp}</ErrorMsg>}

      <A ref={btnref} type="submit">Verify</A>


        </> :(
               <>
               <p>First Name:</p>
               <div className={`relative ${errors.fname ? 'error' : ''}`}>
                 <input
                   placeholder="First Name"
                   type="text"
                   onChange={(e) => setfname(e.target.value)}
                   value={fname}
                 />
                 <i className="ri-user-line"></i>
               </div>
               {errors.fname && <ErrorMsg>{errors.fname}</ErrorMsg>}
       
               <p>Last Name:</p>
               <div className={`relative ${errors.lname ? 'error' : ''}`}>
                 <input
                   placeholder="Last Name"
                   type="text"
                   onChange={(e) => setlname(e.target.value)}
                   value={lname}
                 />
                 <i className="ri-id-card-line"></i>
               </div>
               {errors.lname && <ErrorMsg>{errors.lname}</ErrorMsg>}
       
               <p>Email:</p>
               <div className={`relative ${errors.email ? 'error' : ''}`}>
                 <input
                   placeholder="Email"
                   type="email"
                   onChange={(e) => setemail(e.target.value)}
                   value={email}
                 />
                 <i className="ri-mail-line"></i>
               </div>
               {errors.email && <ErrorMsg>{errors.email}</ErrorMsg>}
       
               <p>Password:</p>
               <div className={`relative ${errors.pass ? 'error' : ''}`}>
                 <input
                   placeholder="Password"
                   type="password"
                   onChange={(e) => setpass(e.target.value)}
                   value={pass}
                 />
                 <i className="ri-key-line"></i>
               </div>
               {errors.pass && <ErrorMsg>{errors.pass}</ErrorMsg>}
       
               <p>Confirm Password:</p>
               <div className={`relative ${errors.confirmPass ? 'error' : ''}`}>
                 <input
                   placeholder="Confirm Password"
                   type="password"
                   onChange={(e) => setConfirmPass(e.target.value)}
                   value={confirmPass}
                 />
                 <i className="ri-key-fill"></i>
               </div>
               {errors.confirmPass && <ErrorMsg>{errors.confirmPass}</ErrorMsg>}
               <A ref={btnref} type="submit">Sign up</A>
       
             
               <Link to={'/Login'} style={{ fontSize: 13 }}>
                 <i className="ri-arrow-left-line"></i>Login
               </Link>
               </>
        )}
   
      </form>

    </Div>
  );
}

const Div = styled.div`
background-color: #ffffff;
height: 93dvh;
width: 100%;
display: flex;
align-items: center;
justify-content: ${mobile ? 'start' : 'space-evenly'};
padding-right: ${mobile ? '0em' : '4rem'};
padding-top: ${mobile ? '3pc': '0'};
flex-direction: ${mobile ? 'column-reverse' : 'row'};


input{
  width: ${mobile ? '17rem' : '16rem'};
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
  width: ${mobile ? '17rem' : '16rem'};
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
 width: ${mobile ? '0%' : '40%'};
 
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

const ErrorMsg = styled.div`
  color: red;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Google_Btn = styled.div`
  
  display: flex;
  justify-content: start;
  padding: 0 12px;
  gap: 8px;
  height: 6vh;
  width: 250px;
  border-radius: 4px;
  border: 1.5px solid black;
  cursor: pointer;
  align-items: center;
`

export default SignUp;
