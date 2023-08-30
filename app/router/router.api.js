const router = require('express').Router()
const api = require('../api')

module.exports = (app) =>{

    // User
    router.get('/province', api.location.getProvince)
    router.get('/city', api.location.getCity)
    router.get('/district', api.location.getDistrict)
    router.get('/subdistrict', api.location.getSubdistrict)
    
    router.get('/district-export', api.location.exportDistrict)
    router.get('/sicepat-mapping', api.location.mappingDistrictSicepat)
    router.get('/rajaongkir-mapping', api.location.mappingDistrictRajaongkir)

    router.post('/search', api.location.searchByLatLong)

    app.use('/api', router)
}