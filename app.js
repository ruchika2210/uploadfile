const express=require('express')
const multer=require('multer')
const ejs=require('ejs')
const path=require('path')

//set storage engine
const storage=multer.diskStorage({
    destination:'./public/uploads/',
    filename:function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//init upload
const upload=multer({
    storage:storage,
    limits:{fileSize:1000000},
    fileFilter:function(req,file,cb){
      checkFileType(file,cb)  
    }

}).single('myImage')

//check file
function checkFileType(file,cb){
    //allowed file extensions
    const filetypes=/jpeg|jpeg|png|gif|jpg/
    //check the extension
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    //check the mime 
    const mimetype=filetypes.test(file.mimetype)
    if(mimetype && extname)
    {
        return cb(null,true)
    }
    else{
        cb('Error:Images only')
    }
}

//Init app
const app=express()

//set up ejs
app.set('view engine','ejs')

//public Folder
app.use(express.static('./public'))

app.get('/',(req,res) =>{
    res.render('index')
})

app.post('/upload',(req,res) =>{
    upload(req,res,(err)=>{
        if(err){
            res.render('index',{
                msg:err
            })
        }

    else{
        if(req.file==undefined){
            res.render('index',{
                msg:'Error:no file selected'
            })
        }
        else{
            res.render('index',{
                msg:'File Uploaded',
                file:`uploads/${req.file.filename}`
            })
        }
    }
    })
})


const Port=3000
app.listen(Port,() =>{
    console.log(`Server started on port ${Port}`)
})