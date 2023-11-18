const User = require("../models/user")
const {
    uploadSingleFile,
    uploadMultipleFiles
} = require('../services/fileService')
// ---------------------------------------------------------------

const getUsersAPI = async (req, res) => {
    
    let results = await User.find({})

    return res.status(200).json(
        {
            errorCode: 0,
            data: results
        }
    )
}

const postCreateUserAPI = async (req, res) => {

    // //let {email, name, city} = req.body
    let email = req.body.email;
    let name = req.body.name;
    let city = req.body.city;

    console.log(">>> email = ", email, '\nname = ', name, '\ncity = ', city);

    console.log("test", JSON.stringify(req.body));

    let user = await User.create({
        email: email,   
        name: name,
        city: city

    })

    return res.status(200).json(
        {
            errorCode: 0,
            data: user
        }
    )
}

const putUpdateUserAPI = async (req, res) => {
    let email = req.body.email
    let name = req.body.name
    let city = req.body.city
    let id = req.body.idEDIT

    let user = await User.updateOne({ _id: id }, { email: email, name: name, city: city });

    return res.status(200).json(
        {
            errorCode: 0,
            data: user
        }
    )  
}

const deleteHandleRemoveUserAPI = async (req, res) => {
    let id = req.body.idUserDelete

    console.log("id: ", id);

    let user = await User.deleteOne({
        _id: id
    })

    return res.status(200).json(
        {
            errorCode: 0,
            data: user
        } 
    )  
}

const postUploadSingleFileAPI = async (req, res) => {

    console.log("req.files: ", req.files);

    // kiem tra xem da co file hay chua
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let kq = await uploadSingleFile(req.files.image)
    console.log(">>> check kq: ", kq);

    return res.send("upload file thanh cong")
}

const postUploadMultipleFileAPI = async (req, res) => {
    // kiem tra xem da co file hay chua
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // console.log("req.files: ", req.files);
    // upload single => files is an object
    // upload multiple => file is an array
    if(Array.isArray(req.files.image)) {
        // upload multiple
        let result = await uploadMultipleFiles(req.files.image)
        return res.status(200).json({
            errCode: 0,
            data: result
        })
    }  else {
        // upload single
        return await postUploadSingleFileAPI(req, res)
    }
}

module.exports = {
    getUsersAPI,
    postCreateUserAPI,
    putUpdateUserAPI,
    deleteHandleRemoveUserAPI,
    postUploadSingleFileAPI,
    postUploadMultipleFileAPI,
    

}