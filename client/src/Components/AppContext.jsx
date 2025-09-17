import { createContext, useState, useEffect } from "react";
import 'react-toastify/dist/ReactToastify.css';
import {toast, ToastContainer} from 'react-toastify'
import { CircularProgress } from "@mui/material";





export const Context = createContext();
export const mobile = window.innerWidth < 768;




function AppContext({children}) {

    const [User, setUser] = useState(null);

    function toastcont(){
      return(
        <ToastContainer/>
      )
    }


    // const SERVER_URL = 'https://greenishfarmerserver.vercel.app';
    const SERVER_URL = 'http://localhost:3000'; // Change this to your local server URL for development 


    async function getUser(){
      console.log('getting user')
       await fetch(`${SERVER_URL}/current_user`, {
          method: 'GET',
          credentials: 'include', // This allows sending cookies with the request,
        })
          .then(response => {
            if (!response.ok){
              alert('Login Session Expired')
            }  
            return response.json()
          })
          .then(user=>{
            console.log(user)
            if(user.user){
              console.log(user.user)
              setUser(user.user)
            }
          })
          .catch(error => {
           console.error('Server Problem')
          });
      }

      


      async function getReq(path){

        

       try {
        const api =  await fetch(SERVER_URL + path, {
          method: 'GET',
          credentials: 'include' // This allows sending cookies with the request
        })

        if(!api.ok){
          const errmsg = await api.json();
          toast.error(errmsg.error);
          return errmsg
        }

        const json = api.json();
        return json;
       } catch (error) {
        toast.error('Server Problem')
       }
      }


      async function postReq(path, body){
       try {
        const api = await fetch(SERVER_URL + path,{
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        

        if(!api.ok){
          const errorMsg = await api.json();
          toast.error(errorMsg.error)
          return;
        }

        const data = await api.json();

       return data;
       } catch (error) {
        toast.error('Server Problem',{
          position: 'top-center'
        })
        
       }

      }


    useEffect(()=>{
        getUser();
    },[]);



    const addToCart = async (Data,qty,size,event) => {


      event.target.innerHTML = '<span class="spinner"></span>';

      event.target.disabled = true;

      const cart = {
          id: Data._id,
          heading: Data.heading,
          img: Data.img[0],
          price: Data.price[size],
          qty: qty,
          size: Data.options[size],
          userId: User?.email || null,
      }
      if (User) {

      
          const api = await postReq('/set-cart', cart)


         if(!api){
          event.target.innerHTML = '<i style="color:red;font-size:20px" class="ri-close-fill"></i>';
          event.target.disabled = false;

         }else{
          event.target.innerHTML = '<i style="color:lime;font-size:20px" class="ri-check-fill"></i>';
          event.target.disabled = false;
         }

        
      } else {
          const localcart = localStorage.getItem('cart')

          if (localcart) {
              const arr = JSON.parse(localcart);
              console.log(arr)

              if (arr.length > 0) {

                  let repeat = arr.map(rs => rs.id === cart.id ? true : false)
                  console.log(repeat)


                  if (repeat[0] === true) {
                      alert('This Product already in cart')
                      return;
                  }

              }

              arr.push(cart);
              localStorage.setItem('cart', JSON.stringify(arr))
              event.target.innerHTML = '<i style="color:lime;font-size:20px" class="ri-check-fill"></i>';
          } else {
              localStorage.setItem('cart', JSON.stringify([cart]))
              event.target.innerHTML = '<i style="color:lime;font-size:20px" class="ri-check-fill"></i>';
          }
      }


      setTimeout(()=>{
        event.target.innerHTML = "ADD TO CART"
      },2000)


  }

  const removeCartItem = async(e)=>{

    if(User){
      await getReq(`/delete-cart?id=${e.id}`);


    }else{

      const arr = JSON.parse(localcart);
             

              if (arr.length > 0) {


                  let updateArray = arr.filter(rs => rs.id !== e.id);


                  localStorage.cart = JSON.stringify(updateArray);
                


                 

              }

    }



  }


    const addToWishlist = (item)=>{

      const wishlist = localStorage.getItem('wishlist');

      if(wishlist){

          const arr = JSON.parse(wishlist);
          arr.push(item)
          localStorage.setItem('wishlist',JSON.stringify(arr))


      }else{

          localStorage.setItem('wishlist',JSON.stringify([item]))
          console.log('adding to wishlist')

      }


  }

    



  return (
    <Context.Provider value={{postReq,getUser, User, getReq, toastcont, addToWishlist, addToCart,removeCartItem}}>
     <ToastContainer pauseOnHover={false} position="top-center"/>
        {children}
    </Context.Provider>
  )
}

export default AppContext