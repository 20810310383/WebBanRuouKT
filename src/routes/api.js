const express = require('express');

const {
    getUsersAPI,
    postCreateUserAPI,
    putUpdateUserAPI,
    deleteHandleRemoveUserAPI,
    postUploadSingleFileAPI,
    postUploadMultipleFileAPI,

} = require('../controllers/apiController');
const routerAPI = express.Router();

// -----------------------------------------------

// lay tat ca nguoi dung -- hien thi
routerAPI.get('/users', getUsersAPI);

// create
routerAPI.post('/users', postCreateUserAPI);

// update 
routerAPI.put('/users', putUpdateUserAPI);

// delete
routerAPI.delete('/users', deleteHandleRemoveUserAPI);

// file
// upload 1 file
routerAPI.post('/file', postUploadSingleFileAPI);

// upload nhieu file
routerAPI.post('/files', postUploadMultipleFileAPI);

module.exports = routerAPI;