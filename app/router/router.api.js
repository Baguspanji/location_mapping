const router = require('express').Router()
const api = require('../api')

module.exports = (app) =>{

    // User
    router.get('/province', api.location.getProvince)
    router.get('/city', api.location.getCity)
    router.get('/district', api.location.getDistrict)
    router.get('/subdistrict', api.location.getSubdistrict)
    
    router.get('/district-export', api.location.exportDistrict)
    router.get('/rajaongkir-mapping', api.location.mappingDistrictRajaongkir)
    // router.get('/sicepat-mapping', api.location.mappingDistrictSicepat)
    router.get('/ninja-mapping', api.location.mappingDistrictNinja)

    router.post('/search', api.location.searchByLatLong)

    router.get('/ninja-pricing', api.location.getNinjaPricing)
    // router.get('/ninja-pricing-sameday', api.location.getNinjaPricingSameday)
    router.get('/ninja-pricing-cargo', api.location.getNinjaPricingCargo)
    router.get('/ninja-disable', api.location.getNinjaDisable)

    router.get('/postal-code', api.location.getPostalCode)

    router.get('/create-absence', api.axios.createAbsence)

    app.use('/api', router)
}