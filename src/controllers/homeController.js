const connection = require('../config/database');
const {
    
} = require("../services/CRUDService")

const User = require("../models/user")
// ---------------------------------------------------------------

const getHomepage = async (req, res) => {
    
    let results = await User.find({})

    return res.render("home.ejs", {listUsers: results})
}

const getCreatePage = (req, res) => {
    res.render("create.ejs")
}


const postCreateUser = async (req, res) => {

    // //let {email, name, city} = req.body
    let email = req.body.email;
    let name = req.body.name;
    let city = req.body.city;

    console.log(">>> email = ", email, '\nname = ', name, '\ncity = ', city);

    console.log("test", JSON.stringify(req.body));

    await User.create({
        email: email,   
        name: name,
        city: city

    })

    // await User.create({
    //     email,
    //     name,
    //     city
    // })
    res.redirect("/")  
    //res.send(" them thanh cong");
    
}

const getUpdatePage = async (req, res) => {
    const userId = req.query.idUser

    let user = await User.findById(userId).exec();
    //let user = await getUserId(userId)
 
    res.render("edit.ejs", {userEdit: user})    // x <- y
}

const postUpdateUser = async (req, res) => {
    let email = req.body.email
    let name = req.body.name
    let city = req.body.city
    let id = req.body.idEDIT

    console.log(">>> email = ", email, '\nname = ', name, '\ncity = ', city, "\nid: ", id);
    //await updateUserById(name, email, city, userId)
    await User.updateOne({ _id: id }, { email: email, name: name, city: city });

    //res.send("update thành công")
    res.redirect("/")  
}

const postDeleteUser = async (req, res) => {
    const userId = req.query.idDelete

    //let user = await getUserId(userId)
    let user = await User.findById(userId).exec();

    res.render("delete.ejs", {userEdit: user})
}

const postHandleRemoveUser = async (req, res) => {
    let id = req.body.idUserDelete

    console.log("id: ", id);

    //await deleteUserById(id)
    await User.deleteOne({
        _id: id
    })

    //res.send("xóa ok")
    res.redirect("/")  
}

module.exports = {
    getHomepage, 
    postCreateUser,
    getCreatePage,
    getUpdatePage,
    postUpdateUser,
    postDeleteUser,
    postHandleRemoveUser,
    
}