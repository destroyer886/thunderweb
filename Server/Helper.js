function setError(err, res, status) {
 const statusCode = status || 500;

  return res.status(statusCode).json({ error: err || 'Server Error' })


}

function ok(data, res) {

  return res.json({ status: 'ok', data })

}



function checkAdmin(req,res,next){

  if(req.cookies['isLoggedin']){
    res.locals.name = req.cookies['username']; 
    next();
  }else{
    res.redirect('/login')
  }

}


module.exports = {checkAdmin,ok, setError}