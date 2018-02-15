'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app} = require('../server');
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('general test', function(){
    it('should run', function(){
        return chai.request(app)
        .get('/')
        .then(function(res){
            res.should.have.status(200);
            res.should.be.html;
        });
    });
});