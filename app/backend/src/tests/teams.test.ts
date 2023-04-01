import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import TeamsModel from '../database/models/TeamsModel'
import allTeamsMock from './mocks'
import teamsByIdMock from './mocks'

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;


describe('testes para camada controller de /teams', function () {
    let chaiHttpResponse: Response;

  it('status 200 com lista de times', async function () {
    sinon
        .stub(TeamsModel, "findAll")
        .resolves(allTeamsMock as any);

    chaiHttpResponse = await chai.request(app).get('/teams')

    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.be.deep.equal(allTeamsMock)
  });
  it('status 200 para /teams/:id', async function () {
        sinon
        .stub(TeamsModel, "findOne")
        .resolves(teamsByIdMock as any);

    chaiHttpResponse = await chai.request(app).get('/teams/1')
    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.be.deep.equal(teamsByIdMock)
  });

});
