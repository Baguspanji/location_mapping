

const sarumanProvince = require("../models").saruman_province;
const sarumanCity = require("../models").saruman_city;
const sarumanDistrict = require("../models").saruman_district;
const subdistrict = require("../models").saruman_subdistrict;

const sicepatLocation = require("../models").sicepat_location;
const ninjaLocation = require("../models").ninja_location;

const geoProvince = require("../models").geo_province;
const geoCity = require("../models").geo_city;
const geoDistrict = require("../models").geo_district;
const geoSubdistrict = require("../models").geo_subdistrict;

const ninjaCityTranslate = require("../models").ninja_city_translate;
const ninjaPricing = require("../models").ninja_pricing;

const excelJS = require('exceljs');
const readExcel = require('read-excel-file/node');
const readXLSX = require('xlsx');

const axios = require('axios');
const moment = require('moment');
const { sequelize } = require("../models");
const e = require("cors");
const { Op, or } = require("sequelize");

exports.getProvince = async (req, res) => {
    const data = await geoProvince.findAll()

    res.json({
        message: 'Success',
        data
    })
};

exports.getCity = async (req, res) => {
    const data = await geoCity.findAll()

    res.json({
        message: 'Success',
        data
    })
};

exports.getDistrict = async (req, res) => {
    const data = await geoDistrict.findAll()

    res.json({
        message: 'Success',
        data
    })
};

exports.getSubdistrict = async (req, res) => {
    const data = await geoSubdistrict.findAll()

    // for (let i = 0; i < data.length; i++) {
    //     const d = data[i];

    //     var name = d.name.toLowerCase()
    //     var names = name.split(' ')
    //     var newName = ''
    //     for (let j = 0; j < names.length; j++) {
    //         const name = names[j];
    //         newName += name.charAt(0).toUpperCase() + name.slice(1)
    //         if (j < names.length - 1) {
    //             newName += ' '
    //         }
    //     }

    //     await geoSubdistrict.update({
    //         name: newName
    //     }, {
    //         where: {
    //             id: d.id
    //         }
    //     })
    // }

    res.json({
        message: 'Success',
        data
    })
};

exports.searchByLatLong = async (req, res) => {
    let { lat, lng, id } = req.body

    lat = parseFloat(lat)
    lng = parseFloat(lng)

    // const data = await shipperSubdistrict.findOne({
    //     where: {
    //         // id: id
    //         latitude: lat,
    //         longitude: lng
    //     },
    //     include: [
    //         {
    //             model: shipperDistrict,
    //             include: [
    //                 {
    //                     model: shipperCity,
    //                     include: [
    //                         {
    //                             model: shipperProvince
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // })

    const data = await sequelize.query(`
        SELECT
            v.id,
            v.name,
            v.latitude,
            v.longitude,
            d.id AS district_id,
            d.name AS district_name,
            c.id AS city_id,
            c.name AS city_name,
            p.id AS province_id,
            p.name AS province_name,
            ST_DISTANCE(POINT(${lng}, ${lat}), POINT(v.longitude, v.latitude)) AS distance
        FROM
            shipper_subdistricts v
        JOIN
            shipper_districts d ON d.id = v.district_id
        JOIN
            shipper_cities c ON c.id = d.city_id
        JOIN
            shipper_provinces p ON p.id = c.province_id
        ORDER BY
            distance
        LIMIT 1;
    `, { type: sequelize.QueryTypes.SELECT })

    res.json({
        data
    })
};

exports.exportDistrict = async (req, res) => {
    const data = await geoDistrict.findAll()

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('District Sisepat');

    worksheet.columns = [
        { header: 'district_id', key: 'id', width: 10 },
        { header: 'ninja_id', key: 'ninja_id', width: 10 },
    ];

    dataExport = data.map((item) => {
        return {
            id: item.id,
            ninja_id: item.ninja_id
        }
    })

    worksheet.addRows(dataExport);

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "kec saruman old.xlsx"
    );

    try {
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        return res.json({
            message: 'Failed',
            error
        })
    }
}

exports.mappingDistrictSicepat = async (req, res) => {
    const sicepat_location = await sicepatLocation.findAll()

    const t = await sequelize.transaction();

    try {
        var data = []
        for (let i = 0; i < sicepat_location.length; i++) {
            const sicepat = sicepat_location[i];

            const saruman_district = await sarumanDistrict.findAll({
                where: {
                    name: sicepat.district_name,
                    sicepat_id: null
                }
            })

            if (saruman_district.length > 0 && saruman_district.length <= 1) {
                var district = saruman_district[0]
                await sarumanDistrict.update({
                    sicepat_id: sicepat.id
                }, {
                    where: {
                        id: district.id
                    },
                    transaction: t
                })

                await sicepatLocation.update({
                    has_mapping: true
                }, {
                    where: {
                        id: sicepat.id
                    },
                    transaction: t
                })
            }
        }
        t.commit();

        res.json({
            message: 'Success',
            data
        })
    } catch (error) {
        await t.rollback();
        console.log(error)

        res.json({
            message: 'Failed',
            error
        })
    }
}

exports.mappingDistrictNinja = async (req, res) => {
    const ninja_location = await ninjaLocation.findAll()

    const t = await sequelize.transaction();
    try {
        var data = []
        for (let i = 0; i < ninja_location.length; i++) {
            const ninja = ninja_location[i];

            const geo_district = await geoDistrict.findAll({
                where: {
                    name: ninja.district_name,
                    // ninja_id: null
                }
            })

            if (geo_district.length > 0 && geo_district.length <= 1) {
                var district = geo_district[0]
                await geoDistrict.update({
                    ninja_id: ninja.id
                }, {
                    where: {
                        id: district.id
                    },
                    transaction: t
                })

                await ninjaLocation.update({
                    has_mapping: true
                }, {
                    where: {
                        id: ninja.id
                    },
                    transaction: t
                })
            }
        }
        t.commit();

        res.json({
            message: 'Success',
            data
        })
    } catch (error) {
        await t.rollback();
        console.log(error)

        res.json({
            message: 'Failed',
            error
        })
    }
}

exports.mappingDistrictRajaongkir = async (req, res) => {
    const saruman_district = await sarumanDistrict.findAll()

    const t = await sequelize.transaction();
    try {
        var data = []
        for (let i = 0; i < saruman_district.length; i++) {
            const saruman = saruman_district[i];

            const geo_district = await geoDistrict.findAll({
                where: {
                    name: saruman.name,
                    rajaongkir_id: null
                }
            })

            if (geo_district.length > 0 && geo_district.length <= 1) {
                var district = geo_district[0]
                await geoDistrict.update({
                    rajaongkir_id: saruman.id,
                    sicepat_id: saruman.sicepat_id
                }, {
                    where: {
                        id: district.id
                    },
                    transaction: t
                })

                await sarumanDistrict.update({
                    has_mapping: true
                }, {
                    where: {
                        id: saruman.id
                    },
                    transaction: t
                })

                data.push({
                    'saruman_id': saruman.id,
                    'sicepat_id': saruman.sicepat_id,
                    'saruman_name': saruman.name,
                    'geo_id': district.id,
                    'geo_name': district.name
                })
                // break
            }
        }

        await t.commit();
        res.json({
            message: 'Success',
            data
        })
    } catch (error) {
        await t.rollback();
        console.log(error)

        res.json({
            message: 'Failed',
            error
        })
    }
}

exports.getNinjaPricing = async (req, res) => {
    const path = 'app/public/new_ninja_pricing.xlsx';
    var excelPrices = await readExcel(path)
    var originPricess = excelPrices[0]

    var dataPricing = []
    try {
        for (let d = 1; d < excelPrices.length; d++) {
            const destinations = excelPrices[d];
            for (let o = 1; o < originPricess.length; o++) {
                dataPricing.push({
                    origin: originPricess[o],
                    destination: destinations[0],
                    price: destinations[o],
                    estimate: null,
                    type: 'Standard'
                })

                console.log({ origin: originPricess[o], destination: destinations[0], 'type': 'price' });
            }
        }
    } catch ({ name, message }) {
        res.json({
            message: 'Failed Pricing',
            error: { name, message }
        })
    }

    // estimate
    const pathEstimate = 'app/public/new_ninja_estimate.xlsx';
    var excelEstimates = await readExcel(pathEstimate)
    var originsEstimates = excelEstimates[0]

    try {
        for (let d = 1; d < excelEstimates.length; d++) {
            const destinations = excelEstimates[d];
            for (let o = 1; o < originsEstimates.length; o++) {
                let price = dataPricing.find((item) => item.origin == originsEstimates[o] && item.destination == destinations[0])
                let keyPrice = dataPricing.findIndex((item) => item.origin == originsEstimates[o] && item.destination == destinations[0])

                if (price) {
                    var estimate = null
                    if ((String)(destinations[d]).includes('-')) {
                        estimate = destinations[d]
                    } else {
                        estimate = moment(destinations[d], 'DD/MM/YYYY').format('MM-DD')
                        estimate = estimate.replace('0', "")
                        estimate = estimate.replace('-0', "-")
                    }

                    dataPricing[keyPrice].estimate = estimate
                    console.log({ origin: price.origin, destination: price.destination, 'type': 'estimate' });
                }
            }
        }
    } catch ({ name, message }) {
        res.json({
            message: 'Failed Estimate',
            error: { name, message }
        })
    }

    try {
        for (let i = 0; i < dataPricing.length; i++) {
            const price = dataPricing[i];

            // const data = await ninjaPricing.findOne({
            //     where: {
            //         origin: price.origin,
            //         destination: price.destination,
            //         type: price.type
            //     }
            // })

            // if (data) {
            //     await ninjaPricing.update({
            //         price: price.price,
            //         estimate: price.estimate
            //     }, {
            //         where: {
            //             id: data.id
            //         }
            //     })
            // } else {
            await ninjaPricing.create({
                origin: price.origin,
                destination: price.destination,
                price: price.price,
                estimate: price.estimate,
                type: price.type
            })
            // }

            console.log({ origin: price.origin, destination: price.destination, 'type': 'create' });
        }

        res.json({
            message: 'Success',
            length: dataPricing.length,
            // data: dataPricing
        })
    } catch ({ name, message }) {
        res.json({
            message: 'Failed',
            error: { name, message }
        })
    }
}

exports.getNinjaPricingSameday = async (req, res) => {
    const cities = await ninjaCityTranslate.findAll()
    const path = 'app/public/ninja_pricing_sameday.xlsx';

    var excels = await readExcel(path)
    var destinations = excels[0]

    var data = []
    var error = []
    const t = await sequelize.transaction();
    try {
        for (let o = 1; o < excels.length; o++) {
            const origin = excels[o]
            for (let d = 1; d < destinations.length; d++) {
                const destination = cities.find((item) => item.city_name == destinations[d])

                // const price = await ninjaPricing.findOne({
                //     where: {
                //         origin: origin[0],
                //         destination: destination.tier_code_1
                //     }
                // })

                // if (price) {
                //     await ninjaPricing.update({
                //         price: origin[d]
                //     }, {
                //         where: {
                //             id: price.id
                //         },
                //         transaction: t
                //     })
                // } else {
                //     await ninjaPricing.create({
                //         origin: origin[0],
                //         destination: destination.tier_code_1,
                //         price: origin[d],
                //         estimate: '0',
                //         type: 'Sameday'
                //     }, {
                //         transaction: t
                //     })
                // }

                if (destination != undefined && data.find((item) => item.origin == origin[0] && item.destination == destination.tier_code_1) == undefined && origin[d] != null) {
                    data.push({
                        origin: origin[0],
                        destination: destination.tier_code_1,
                        price: origin[d],
                        estimate: '0',
                        type: 'Sameday',
                        weight_gain: 3000
                    })
                } else if (origin[d] != null) {
                    error.push({
                        origin: origin[0],
                        destination: destinations[d],
                        price: origin[d],
                        estimate: '0',
                        type: 'Sameday'
                    })
                }
            }
        }

        await t.commit();

        res.json({
            message: 'Success',
            data,
            error
        })
    } catch (error) {
        res.json({
            message: 'Failed',
            error
        })
    }
}

exports.getNinjaPricingCargo = async (req, res) => {
    const cities = await ninjaCityTranslate.findAll()
    const path = 'app/public/ninja_pricing_cargo.xlsx';

    var excels = await readExcel(path)
    var destinations = excels[0]

    var data = []
    var error = []
    const t = await sequelize.transaction();
    try {
        for (let o = 1; o < excels.length; o++) {
            const origin = excels[o];
            for (let d = 1; d < destinations.length; d++) {
                const destination = cities.find((item) => item.city_name == destinations[d])

                const price = await ninjaPricing.findOne({
                    where: {
                        origin: origin[0],
                        destination: destination.tier_code_1,
                        type: 'Cargo'
                    }
                })

                if (price) {
                    await ninjaPricing.update({
                        price: origin[d]
                    }, {
                        where: {
                            id: price.id
                        },
                        transaction: t
                    })
                } else {
                    await ninjaPricing.create({
                        origin: origin[0],
                        destination: destination.tier_code_1,
                        price: origin[d],
                        type: 'Cargo'
                    }, {
                        transaction: t
                    })
                }

                data.push({
                    origin: origin[0],
                    destination: destination.tier_code_1,
                    price: origin[d],
                    type: 'Cargo'
                })
            }
        }

        await t.commit();

        res.json({
            message: 'Success',
            data,
            error
        })
    } catch (error) {
        res.json({
            message: 'Failed',
            error
        })
    }
}

exports.getNinjaDisable = async (req, res) => {
    const path = 'app/public/disable_location_ninja.xlsx';

    var excels = await readExcel(path)
    var destinations = excels[0]

    var data = []
    var error = []
    var duplicate = []
    const t = await sequelize.transaction();
    // try {
    for (let o = 1; o < excels.length; o++) {
        // for (let o = 1; o < 5; o++) {
        const origin = excels[o];
        const price = await ninjaLocation.findOne({
            where: {
                tier_code_2: {
                    [Op.like]: origin[1] + '%'
                },
                city_name: {
                    [Op.eq]: origin[4]
                },
                district_name: {
                    [Op.eq]: origin[5]
                },
                // deleted_at:{
                //     [Op.eq] :  null
                // },
            }
        })

        if (price) {
            // await ninjaLocation.update({
            //     deleted_at: new Date()
            // }, {
            //     where: {
            //         id: price.id
            //     },
            //     transaction: t
            // })

            if (data.find((item) => item.id == price.id)) {
                duplicate.push(price)
            } else {
                data.push(price)
            }
        } else {
            error.push({
                city_name: origin[4],
                district_name: origin[5]
            })
        }
    }

    await t.commit();

    res.json({
        message: 'Success',
        data,
        duplicate,
        error,
        total: data.length
    })
    // } catch (error) {
    //     res.json({
    //         message: 'Failed',
    //         error
    //     })
    // }
}

exports.getPostalCode = async (req, res) => {
    const subdistrict = await geoSubdistrict.findAll({
        limit: 10
    })

    const t = await sequelize.transaction();

    try {
        for (let i = 0; i < subdistrict.length; i++) {
            const subdistrict = array[i];
            const getPostalCode = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${subdistrict.lat},${subdistrict.long}&key=AIzaSyBv_N2X7t6PtB6ot-1gcQhbyF96Kawzk9s`)

            var postalCode = ''
        }
    } catch (error) {

    }
}