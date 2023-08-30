const router = require('express').Router()
const controller = require('../controllers')

const multer = require('multer');
const { diskStorage } = require('../utils/multer');

module.exports = (app) => {

    // item
    router.get('/item', controller.item.findAll)
    router.get('/item/add', controller.item.formAdd)
    router.post('/item', controller.item.create)
    router.get('/item/edit/:id', controller.item.formEdit)
        // router.get('/item/:id', controller.item.findOne)
    router.post('/item/:id', controller.item.update)
    router.get('/item/delete/:id', controller.item.destroy)

    router.get('/get_item', controller.item.getItem)
    router.post('/upload', multer({ storage: diskStorage }).single("file"), controller.item.uploadFile)

    // Login
    router.get('/login', controller.user.home)
    router.post('/login', controller.user.login)
    router.get('/logout', controller.user.logout)

    app.use('/', router)
}