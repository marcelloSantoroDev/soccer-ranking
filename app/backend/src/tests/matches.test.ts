import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import MatchesModel from '../database/models/MatchesModel'
import allMatchesMock from './mocks'
import newMatchMock from './mocks'
import newMatchMockWithoutId from './mocks'
import tokenAuthMock from './mocks'
import reqBodyLoginMock from './mocks'
import { app } from '../app';
import * as jwt from 'jsonwebtoken'
import { Response } from 'superagent';
import TokenGenerator from '../utils/TokenGenerator';

chai.use(chaiHttp);

const { expect } = chai;


describe('testes para /matches', () => {
    let chaiHttpResponse: Response;

  it('status 200 com lista de partidas', async function () {
    sinon
        .stub(MatchesModel, 'findAll')
        .resolves(allMatchesMock as any)
    
    chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse.status).to.be.equal(200)
    expect(chaiHttpResponse.body).to.be.deep.equal(allMatchesMock)
  });
  it('status 200 apenas com partidas em progresso', async function () {
    chaiHttpResponse = await chai
      .request(app)
      .get('/matches?inProgress=true')

    expect(chaiHttpResponse.status).to.be.equal(200)
  });
});

describe('testes para rota post de /matches', async function () {
     let chaiHttpResponse: Response;


    it.only('status 201 com nova partida criada', async function () {
      const secret = process.env.JWT_SECRET || 'batatinha';
      sinon.stub(jwt, 'verify').resolves()
      sinon.stub(MatchesModel, 'update').resolves(newMatchMock as any)
        chaiHttpResponse = await chai
            .request(app)
            .post('/matches')
            .set('Authorization', `${tokenAuthMock}`)
            .send(newMatchMockWithoutId)
        
            expect(chaiHttpResponse.status).to.be.equal(200);
    });

})
