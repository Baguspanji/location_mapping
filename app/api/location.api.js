

const sarumanProvince = require("../models").saruman_province;
const sarumanCity = require("../models").saruman_city;
const sarumanDistrict = require("../models").saruman_district;
const subdistrict = require("../models").saruman_subdistrict;

const sicepatLocation = require("../models").sicepat_location;

const geoProvince = require("../models").geo_province;
const geoCity = require("../models").geo_city;
const geoDistrict = require("../models").geo_district;
const geoSubdistrict = require("../models").geo_subdistrict;

const excelJS = require('exceljs');

const axios = require('axios');
const { sequelize } = require("../models");

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
    const data = await sarumanDistrict.findAll({
        include: [
            {
                model: sarumanCity,
                include: [
                    {
                        model: sarumanProvince
                    }
                ]
            }
        ]
    })

    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('District Sisepat');

    worksheet.columns = [
        { header: 'district_id', key: 'id', width: 10 },
        { header: 'sicepat_id', key: 'sicepat_id', width: 10 },
        { header: 'Provinsi', key: 'province_name', width: 32 },
        { header: 'Kota/Kab.', key: 'city_name', width: 32 },
        { header: 'Kecamatan', key: 'district_name', width: 32 },
        { header: 'has_mapping', key: 'has_mapping', width: 32 },
    ];

    dataExport = data.map((item) => {
        return {
            id: item.id,
            sicepat_id: item.sicepat_id,
            district_name: item.name,
            city_name: item.saruman_city.name,
            province_name: item.saruman_city.saruman_province.name,
            has_mapping: item.has_mapping ? 'Sudah' : ''
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