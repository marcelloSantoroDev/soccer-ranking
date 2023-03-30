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

chai.use(chaiHttp);

const { expect } = chai;


describe('testes para /login', () => {
    let chaiHttpResponse: Response;

  it('status 400 falta de campos', async function () {

    chaiHttpResponse = await chai.request(app).post('/login')
   

    expect(chaiHttpResponse.status).to.be.equal(400)
    // expect(chaiHttpResponse.body).to.be.deep.equal(badRequestLoginMock)
    
  });
  it('status 401 para email não autorizado', async function () {

    chaiHttpResponse = await chai.request(app).post('/login').send({ "email": "adminnnn@adminnn.com", "password": "secret_admin" });
    expect(chaiHttpResponse.status).to.be.equal(401)
  });
  it('status 200 com token', async function () {
    chaiHttpResponse = await chai.request(app).post('/login').send({
  "email": "admin@admin.com",
  "password": "secret_admin"
});
    expect(chaiHttpResponse.status).to.be.equal(200)
  });
});
