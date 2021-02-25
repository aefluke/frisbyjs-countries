const frisby = require('frisby');
const Joi = frisby.Joi;
const config = require('../config.js');
describe('restcountries', function () {

    it('should return a status of 200 with an appropriate sorted json response for countries', function () {
        return frisby
            .get(`${config.base_url}`)
            .expect('status', 200)
            .expect('header', 'content-type', 'application/json;charset=utf-8')
            .expect('jsonTypes', Joi.array())
            .then(function (res) {
                let body = JSON.parse(res.body);
                expect(body).toHaveLength(250);
                expect(body).toEqual(expect.arrayContaining([expect.objectContaining({ 'name': 'Turkey', 'alpha2Code': 'TR', 'alpha3Code': 'TUR' })]));
                expect(body).toBeSortedBy('name', { compare: (a, b) => a.localeCompare(b) });
            });
    });

    it('should return a specific countries information', function () {
        return frisby
            .get(`${config.base_url}/name/turkey`)
            .expect('status', 200)
            .expect('jsonTypes', Joi.array())
            .expect('jsonTypes', '*', {
                name: Joi.string().required(),
                population: Joi.number().required(),
                alpha2Code: Joi.string().required(),
                area: Joi.number().required(),
            })
            .then(function (res) {
                let body = JSON.parse(res.body);
                expect(body).toHaveLength(1);
            });
    });


    it('turkeys second border countries capital should be Baku', function () {
        return frisby
            .get(`${config.base_url}/name/turkey`)
            .expect('status', 200)
            .then(function (res) {
                let body = JSON.parse(res.body);
                const alpha3code = body[0].borders[1];
                return frisby
                    .get(`${config.base_url}/alpha/${alpha3code}`)
                    .expect('status', 200)
                    .expect('json', 'capital', 'Baku')
            });
    });
});


