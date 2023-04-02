import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
// import loginReqBodyMock from './mocks';
import tokenMock from './mocks';
import badRequestLoginMock from './mocks'
import UsersModel from '../database/models/UsersModel'

import { app } from '../app';

import { Response } from 'superagent';
import { resolve } from 'path';

chai.use(chaiHttp);

const { expect } = chai;


describe('testes para /login', function () {
    let chaiHttpResponse: Response;

  it('status 400 falta de campos', async function () {

    chaiHttpResponse = await chai.request(app).post('/login')
   

    expect(chaiHttpResponse.status).to.be.equal(400)
    
  });
  it('status 401 para email não autorizado', async function () {

    chaiHttpResponse = await chai.request(app).post('/login').send({ "email": "adminnnn@adminnn.com", "password": "secret_admin" });
    expect(chaiHttpResponse.status).to.be.equal(401)
  });
  it('status 200 com token', async () => {
    chaiHttpResponse = await chai.request(app).post('/login').send({
  "email": "admin@admin.com",
  "password": "secret_admin"
});
    expect(chaiHttpResponse.status).to.be.equal(200)
  });

  it('status 200 para login/role', async function () {
    chaiHttpResponse = await chai.request(app)
    .get('/login/role')
    .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjgwMTkzNzcxLCJleHAiOjE2ODA3OTg1NzF9.Bjlng4EBVXA6SBoS0eChSDljr_401yH_tfEDcRvu_L8')

    expect(chaiHttpResponse.status).to.be.equal(200);
  })
});
