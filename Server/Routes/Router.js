const express = require('express');
const { connectToDb } = require('../db');

const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const JWT_SECRET = 'ihvbwnfyrwgbcryn@@$^chcb';
const {ok, setError, checkAdmin } = require('../Helper')



const router = express.Router();
const collections = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.google.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "yourmail",
    pass: "your app pass",
  },
  tls: {
    rejectUnauthorized: false // Set this to false to trust self-signed certificates
  }
});

const otpStore = {};


const getCollections = async () => {
  try {
    const { Users } = await connectToDb();

    // Assign collections to the global collections object
    collections.Users = Users;
    

    // Log success
    console.log('Collections loaded successfully:', Object.keys(collections));



    return collections; // Return collections for further use
  } catch (error) {
    console.error('Error loading collections:', error);
    throw new Error('Could not load collections'); // Re-throw error to handle it upstream if needed
  }
};

getCollections();


router.get('/current_user', async (req, res) => {


  try {

    const token = req.cookies['token'];
    console.log(req.cookies)
    console.log(token)
    const tokenverify = jwt.verify(token, JWT_SECRET);
    console.log(tokenverify)


    if (tokenverify) {
      const user = await collections.Users.findOne({ email: tokenverify.email });
      res.json({ status: 'ok', user: user })
    }

  } catch (error) {
    const token = req.cookies['token'];
    res.json({ status: 'errorr', token:token })

  }


});



router.post('/sign-up', async (req, res) => {

  const { fname, lname, email, pass } = req.body;



  try {

    let otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = { otp: otp, time: new Date().getTime() * (10 * 60000) };

    const olduser = await collections.Users.findOne({ email: email });

    if (olduser) {
      res.json({ status: 'error', error: 'This email already has an account.' })
      return;
    }

    async function main() {
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Greenish Farmer" <greenishfarmer@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Verification Code of Fungame", // Subject line
        html: `
              <div style="font-family: Arial, sans-serif; padding: 25px; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 12px; background-color: #f7f8fa;">
  <h2 style="color: #007bff; text-align: center; margin-bottom: 10px;">🔒 Verify Your Account</h2>
  
  <p style="font-size: 16px; color: #444; text-align: center; margin-bottom: 20px;">
    Use the code below to complete your signup. This code is valid for the next <strong>10 minutes</strong>.
  </p>

  <div style="text-align: center; margin: 20px 0;">
    <span style="
      display: inline-block;
      padding: 15px 30px;
      font-size: 26px;
      font-weight: bold;
      color: #fff;
      background-color: #28a745;
      border-radius: 8px;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
    ">
      ${otp}
    </span>
  </div>

  <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
    If you did not request this, please ignore this email or contact our support team.
  </p>
  
  <hr style="border: 0; border-top: 1px solid #ddd; margin: 30px 0;">
  
  <p style="font-size: 13px; color: #aaa; text-align: center;">
    © ${new Date().getFullYear()} MaxFuel Fitness. All rights reserved.
  </p>
</div>

          `, // plain text body
        // html: "<b>Nop?</b>", // html body
        // attachments:[{
        //     filename: 'aa.pdf',
        //     path: path.join(__dirname,'aa.pdf'),
        //     contentType: 'application/pdf'
        // }]
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
    }

    main().catch(console.error);




    res.json({ status: 'ok' })
  } catch (error) {
    res.json({ status: 'error', error: 'Some error occured' })

  };

});


router.post('/verify-otp', async (req, res) => {

  const { fname, lname, email, pass, otp } = req.body;


  if (otp == otpStore[email].otp && otpStore[email].time > new Date().getTime()) {




    await collections.Users.insertOne({
      fname,
      lname,
      email,
      pass,
      profile: null
    });

    delete otpStore[email];

    res.json({ status: "ok" })
  } else {
    res.json({ status: 'error', error: 'wrong otp' })
  }
});


router.post('/login', async (req, res) => {
  const { email, pass } = req.body;


  try {

    const user = await collections.Users.findOne({ email: email });

    if (user) {


      if (user.pass == pass) {

        const token = jwt.sign({ email: email }, JWT_SECRET, { expiresIn: '6d' })

        res.cookie('token', token, {
          httpOnly: true,
          secure: false,  // Set to true in production with HTTPS
          maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
        });

        res.json({ status: 'ok' })

      } else {
        res.status(401).json({ status: 'error', error: 'Password is incorrect' })
      }

    } else {
      res.status(401).json({ status: 'error', error: 'Email not found' })
    }



  } catch (error) {
    res.status(401).json({ status: 'error', error: 'Some error occured' })
  }
})


router.get('/logout', (req, res) => {
  try {
    res.clearCookie('token', { path: '/' });

    res.json({ status: 'ok' })
  } catch (error) {

    res.status(500).json({ status: 'error', error: 'Cookie Error' })

  }
});



router.post('/forget-passwd', async (req, res) => {
  const { email } = req.body;

  try {


    const user = await collections.Users.findOne({ email: email });


    if (user) {
      const resetSecret = JWT_SECRET + user.pass;
      const newtoken = jwt.sign({ email: email }, resetSecret, { expiresIn: '7m' })
      res.json({ status: 'ok', newtoken: newtoken })
      const resetLink = `https://greenishfarmerserver.vercel.app/reset-pw/${newtoken}/${email}`

      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Greenish Farmer" <greenishfarmer@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Password Reset Request - Greenish Farmer", // Subject line
          html: `
              <!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset</title>
              </head>
              <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); overflow: hidden;">
                  <!-- Header -->
                  <div style="background-color: #007bff; padding: 20px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Greenish Farmer</h1>
                  </div>
          
                  <!-- Body Content -->
                  <div style="padding: 30px; color: #333;">
                    <h2 style="color: #333; font-size: 20px;">Reset Your Password</h2>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Hi there,
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      It looks like you requested a password reset. No worries! Click the button below to reset your password.
                    </p>
          
                    <!-- Reset Button -->
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${resetLink}" style="
                        display: inline-block; 
                        padding: 15px 25px; 
                        background-color: #28a745; 
                        color: #ffffff; 
                        text-decoration: none; 
                        border-radius: 5px; 
                        font-size: 16px;
                        font-weight: bold;">
                        Reset Password
                      </a>
                    </div>
          
                    <!-- Alternative Link -->
                    <p style="font-size: 14px; color: #666;">
                      Or copy and paste this link into your browser:
                    </p>
                    <p style="font-size: 14px; word-break: break-all; color: #007bff;">
                      <a href="${resetLink}" style="color: #007bff; text-decoration: underline;">
                        ${resetLink}
                      </a>
                    </p>
                    
                    <p style="font-size: 16px; line-height: 1.6;">
                      If you didn't request this, you can safely ignore this email.
                    </p>
                    <p style="font-size: 16px; line-height: 1.6;">
                      Thanks,<br>Greenish Farmer Team
                    </p>
                  </div>
          
                  <!-- Footer -->
                  <div style="background-color: #f1f1f1; text-align: center; padding: 15px; border-top: 1px solid #e0e0e0;">
                    <p style="font-size: 12px; color: #888;">
                      If you have any issues, please contact us at <a href="mailto:support@greenishfarmer.com" style="color: #007bff; text-decoration: none;">support@greenishfarmer.com</a>
                    </p>
                    <p style="font-size: 12px; color: #888;">
                      © ${new Date().getFullYear()} Greenish Farmer. All rights reserved.
                    </p>
                  </div>
                </div>
              </body>
              </html>
              `,
        });

        console.log("Message sent: %s", info.messageId);
      }


      main().catch(console.error);

    } else {
      res.json({ status: 'error', error: 'email not found' })
    }
  } catch (error) {

    console.error(error)
    res.json({ status: 'error', error: error.name })

  }
})


router.get('/reset-pw/:token/:email', async (req, res) => {

  const { token, email } = req.params;
  // res.send(`ok token : ${token}, email: ${email}`);

  try {


    const user = await collections.Users.findOne({ email: email });
    if (user) {
      const secret = JWT_SECRET + user.pass;

      const verify = jwt.verify(token, secret)

      if (verify) {
        res.render('reset', { email: email, token: token })
      } else {
        res.send('error')
      }
    }

  } catch (error) {
    console.error(error)

    if (error.name == 'TokenExpiredError') {
      res.send('Link is Expired')
      return
    }


    res.json({ status: 'error', errorname: error.name })
  }
})


router.post('/reset-pwd/:token/:email', async (req, res) => {

  const { token, email } = req.params;
  const { newpass } = req.body;
  console.log('oks')
  // res.send(`ok token : ${token}, email: ${email}`);

  try {


    const user = await collections.Users.findOne({ email: email });
    if (user) {

      const secret = JWT_SECRET + user.pass;

      const verify = jwt.verify(token, secret)

      if (verify) {

        console.log(verify)

        await collections.Users.updateOne({ _id: user._id }, {
          $set: { pass: newpass }

        })

        res.send('password Successfully Changed')
      } else {
        res.send('error')
      }
    } else {
      res.send('error')
    }

  } catch (error) {
    console.error(error)

    if (error.name == 'TokenExpiredError' || error.name == 'JsonWebTokenError') {
      res.send('Link is Expired')
      return
    }


    res.json({ status: 'error', errorname: error.name })
  }



})







router.get('/login', (req,res)=>{
  res.render('Login')
})

router.post('/admin-login', async(req,res)=>{


  try {
    const {username, password} = req.body;
    const usernameCheck =  await collections.Users.findOne({username: username});
    if(usernameCheck){
      if(password === usernameCheck.password){

        res.cookie('isLoggedin', true, {
          httpOnly: true,
          secure: false,  // Set to true in production with HTTPS
        });
        res.cookie('username', usernameCheck.username, {
          httpOnly: true,
          secure: false,  // Set to true in production with HTTPS
        });
        res.cookie('pass', password, {
          httpOnly: true,
          secure: false,  // Set to true in production with HTTPS
        });

        res.redirect('/admin');

      }else{
        res.send("incorrect Password")
      }
    }else{

      res.send("Username not found")

    }
  } catch (error) {
    res.send('Some Error Occured') 
    console.log(error)
  }
})

router.get('/admin', checkAdmin, (req,res)=>{
  res.render('admin')
})


router.get('/admin/manage-users', checkAdmin, async(req,res)=>{
  const {query, page = 1} = req.query;
  try {

    const data = await collections.Users.find({userRole : {$exists : false},$or: [
      { fname: new RegExp(query, 'i') },
      { email: new RegExp(query, 'i') }
    ]}).skip((page - 1) * 40).limit(40).sort({_id : -1}).toArray();
    console.log(data)
    res.render('Users', { data })

  } catch (error) {

    res.send('there is some error in server');

  }
})


router.get('/admin/delete-user',checkAdmin, async(req,res)=>{
  const {id} = req.query;


  try {
    await collections.Users.deleteOne({_id : new ObjectId(id)})
    res.send('ok')
  } catch (error) {
    res.send('some error occured')
  }
})



router.get('/admin/settings', checkAdmin, (req,res)=>{

  const username = req.cookies['username']
  const pass = req.cookies['pass'].slice(3)

  res.render('Settings',{username,pass})

})

router.get('/admin/settings/change-up', checkAdmin, (req,res)=>{
  const username = req.cookies['username']
  const pass = req.cookies['pass']

  res.render('user-change',{username,pass})

})


router.post('/admin/user-pass-change',checkAdmin, async(req,res)=>{
  const {user, pass , pin} = req.body;


  try {
    const admin = await collections.Users.findOne({username : req.cookies['username'], userRole: 'admin'});
    console.log(admin.pin, pin)
    if(pin == admin.pin) {

      await collections.Users.updateOne({username : admin.username, userRole: 'admin'},{
        $set:{
          username : user,
          password : pass
        }
      })
      res.clearCookie('isLoggedin');

      

      res.redirect('/admin/settings')


     }else{
      res.send('pin is wrong')

      
     }


  } catch (error) {
    res.send('some error occured')

    console.error(error)
    
  }



})

router.get('/admin/settings/change-pin', checkAdmin, (req,res)=>{
 
  res.render('pin-change')

})


router.post('/admin/user-pin-change',checkAdmin, async(req,res)=>{
  const { old, newpin } = req.body;


  try {
    const admin = await collections.Users.findOne({username : req.cookies['username'], userRole: 'admin'});
    if(old === admin.pin){

      await collections.Users.updateOne({username : admin.username, userRole: 'admin'},{
        $set:{
          pin: newpin
        }
      })
      res.redirect('/admin/settings')
     }else{
      res.send('pin is wrong')
      
     }


  } catch (error) {
    res.send('some error occured')

    console.error(error)
    
  }



})

module.exports = router;
