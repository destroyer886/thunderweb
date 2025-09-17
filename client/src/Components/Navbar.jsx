import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// import { useAuth0 } from '@auth0/auth0-react';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import { motion, AnimatePresence } from 'framer-motion';
// import Search from './Search';
import { FiSearch } from "react-icons/fi";

import { useContext } from 'react';
import { Context } from './AppContext';



function Navbar() {
  


 
  const [menuOpen, setMenuOpen] = useState(false);
  const { User, getReq } = useContext(Context);

 
  const now = new Date();
  const nav = useNavigate();



  // const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

  // let LoggedIn = false;
  // let userData = [];

  // if (isAuthenticated) {
  //   localStorage.setItem('user', JSON.stringify({ value: user, expiry: now.getTime() + 9999999 * 1000 }));
  // }

  // if (localStorage.getItem('user')) {
  //   LoggedIn = true;
  //   userData = JSON.parse(localStorage.getItem('user')).value;
  //   if (JSON.parse(localStorage.getItem('user')).expiry < now.getTime()) {
  //     localStorage.removeItem('user');
  //   }
  // }

  // const Logout = () => {
  //   localStorage.removeItem('user');
  //   logout();
  //   setMenuOpen(false);
  // };

  useEffect(() => {
    
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 99
    }}>
      <Nav id='nav'>
      <div className="Logo">
        <motion.div

        className='logo-box'

        style={{
          color: 'white',
        }}

        onClick={()=> nav('/')}
          initial={{ opacity: 0, y: -20,}}
          animate={{ opacity: 1, y: 0,}}
          transition={{ duration: 0.5 }}
        >
          <h1 id='logo'>Yourlogo</h1>
        </motion.div>
      </div>
      <div className="desktop-menu">
        <motion.div
          className="items"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, staggerChildren: 1 ,}}
        >
          <Lb to={'/'}>Home</Lb>
          <Lb to={'/pr/pr'}>About</Lb>
          <Lb to={'/shop'}>Shop</Lb>
          <Lb to={'/shop?date=new'}>New arrivals</Lb>
        </motion.div>
        <motion.div
          className="icons"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <i onClick={() => nav('/search')} class="ri-search-line"></i>
          <i onClick={() => nav('/cart')} className="ri-shopping-cart-line"></i>
        
          {User ? (
            <i onClick={() => setMenuOpen(true)} style={{ cursor: 'pointer' }} className="ri-user-line"></i>
          ) : (
            <LoginButton onClick={()=>nav('/login') }>Log in</LoginButton>
          )}
        </motion.div>
      </div>
      <div className="mobile-menu">
        
        <div className="menu-icon" >
          <i onClick={() => nav('/cart')} className="ri-shopping-cart-line"></i>
          <i onClick={() => nav('/search')} class="ri-search-line"></i>
          <i style={{cursor: 'pointer'}} onClick={() => setMenuOpen(!menuOpen)} className={`ri-menu-line ${menuOpen ? 'open' : ''}`}></i>
        </div>
      </div>
      <AnimatePresence>
        {menuOpen && (
          <Drawer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <CloseButton onClick={() => setMenuOpen(false)}>
              <i style={{color: 'black'}} className="ri-close-line"></i>
            </CloseButton>
            <DrawerContent>
              {User && (
                <UserInfo>
                  <div className="avatar">
                    <Avatar sx={{ bgcolor: deepPurple[500] }}>
                      {User && User.fname.split('')[0] + User.lname.split('')[0]}
                    </Avatar>
                    <div>
                      <h5>{User.fname + ' ' + User.lname}</h5>
                      <p>{User && User.email}</p>
                    </div>
                  </div>
                </UserInfo>
              )}
              {window.innerWidth < 768 && (
                <>
              <Lb to={'/'} onClick={() => setMenuOpen(false)}>Home</Lb>
              <Lb to={'/pr/pr'} onClick={() => setMenuOpen(false)}>About</Lb>
              <Lb to={'/shop'} onClick={() => setMenuOpen(false)}>Shop</Lb>
              <Lb to={'/new'} onClick={() => setMenuOpen(false)}>New arrivals</Lb>
              <Lb to={'/cart'} onClick={() => setMenuOpen(false)}>Cart</Lb>
              </>
              )}
              {User ? (
                <>
                  <DrawerButton onClick={() => { nav('/myorders'); setMenuOpen(false); }}>
                    <i className="ri-shopping-bag-fill"></i> Your Orders
                  </DrawerButton>
                  <DrawerButton onClick={() => { nav('/address'); setMenuOpen(false); }}>
                    <i className="ri-map-pin-2-fill"></i> Saved Addresses
                  </DrawerButton>
                  <DrawerButton onClick={() => { nav('/wishlist'); setMenuOpen(false); }}>
                    <i className="ri-heart-fill"></i> Wishlist
                  </DrawerButton>
                  <DrawerButton onClick={async()=> {
                    const res = await getReq('/logout');
                    if(res.status === 'ok'){
                      window.location.reload();
                    }
                  }}>
                    <i className="ri-logout-box-line"></i> Log out
                  </DrawerButton>
                </> 
              ) : (
                <LoginButton onClick={() => nav('/login')}>Log in</LoginButton>
              )}
            </DrawerContent>
          </Drawer>
        )}
      </AnimatePresence>



      </Nav>
      
    </header>

{/* {location.pathname === '/cart' || location.pathname === '/wishlist' || location.pathname === '/myorders' ? <div></div>
: <Search/>} */}
</>
   
  );
}

export default Navbar;

const Nav = styled.nav`
background-color: #ffffff;

.logo-box{
  display: flex;
  align-items: center;
}

#logo{
  /* width: 8rem; */
  font-family: 'Lobster two', sans-serif;
  font-size: 20px;


}

.menu-icon{
  display: flex;
  gap: 14px;

  i{
    font-size: 20px;
  }
}


i,svg{
  color: #1c1c1c;
}

.formControl{
  top: -7px;
}

i{
  cursor: pointer;
}
  
  z-index: 99;
  width: 100%;
  transition: all 1s ease;
  height: 7vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
 

  .Logo h2 {
    font-family: 'Lobster two', cursive;
  }

  .desktop-menu {
    display: flex;
    align-items: center;

    .items {
      display: flex;
      gap: 1rem;
    }

    .icons {
      display: flex;
      gap: 1rem;
      margin-left: 1rem;
    }
  }

  .mobile-menu {
    display: none;
  }

  @media (max-width: 768px) {
    .desktop-menu {
      display: none;
    }

    .mobile-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
  }
`;

const Lb = styled(NavLink)`
  position: relative;
  text-decoration: none;
  color: #1c1c1c;
  font-size: 14px;
  padding: 5px 10px;
  transition: all 0.3s ease;

  &.active {
    color: red;
  }

  &::after {
    content: '';
    width: 0%;
    height: 1.5px;
    background-color: #1c1c1c;
    position: absolute;
    bottom: -3px;
    left: 0;
    border-radius: 10px;
    transition: all 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const LoginButton = styled.button`
  background-color: transparent;
  border: none;
  color: red;
  cursor: pointer;
  font-size: 13px;
  padding: 5px 10px;
  transition: all 0.3s ease;

  &:hover {
    background-color: rgba(255, 0, 0, 0.1);
  }
`;

const Drawer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: #ffffff;
  box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const DrawerContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 50px;
`;

const UserInfo = styled.div`
  .avatar {
    display: flex;
    gap: 1rem;
    align-items: center;
    padding-bottom: 1rem;
    border-bottom: 1px solid black;
    
    h5 {
      margin: 0;
    }
    
    p {
      margin: 0;
      font-size: 12px;
    }
  }
`;

const DrawerButton = styled.button`
  background: none;
  border: none;
  color: #000000;
  cursor: pointer;
  font-size: 13px;
  padding: 5px 10px;
  text-align: left;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;

  i,svg{
    color: black;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  i {
    font-size: 16px;
  }
`;
