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
import leaderboardMock from './mocks'
import { app } from '../app';
import * as jwt from 'jsonwebtoken'
import { Response } from 'superagent';
import TokenGenerator from '../utils/TokenGenerator';

chai.use(chaiHttp);

const { expect } = chai;



describe('testes para rota /leaderboard', function () {
  let chaiHttpResponse: Response;

it('status 200 com placar completo - home', async function () {
  chaiHttpResponse = await chai
        .request(app)
        .get('/leaderboard/home');

        expect(chaiHttpResponse.status).to.be.equal(200);})
it('status 200 com placar completo - away', async function () {
  chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

  expect(chaiHttpResponse.status).to.be.equal(200);
})
it('status 200 com placar total', async function () {
  chaiHttpResponse = await chai.request(app).get('/leaderboard');

  expect(chaiHttpResponse.status).to.be.equal(200);
})
});