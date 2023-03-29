// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');
// import TeamsModel from '../../database/models/TeamsModel'
// import allTeamsMock from './mocks'

// import { app } from '../../app';

// import { Response } from 'superagent';

// chai.use(chaiHttp);

// const { expect } = chai;

// type TTeams = {
//     id: number;
//     teamName: string;
// }

// describe('Seu teste', () => {

//   let chaiHttpResponse: Response;

//   beforeEach(async () => {
//     sinon
//       .stub(TeamsModel, "findAll")
//       .resolves(allTeamsMock as TTeams[]);
//   });

//   afterEach(()=>{
//     (TeamsModel.findAll as sinon.SinonStub).restore();
//   })

//   // it('...', async () => {
//   //   chaiHttpResponse = await chai
//   //      .request(app)
//   //      ...

//   //   expect(...)
//   // });

//   it('Seu sub-teste', async () => {
//     chaiHttpResponse = await chai.request(app).get('/teams')

//     expect(chaiHttpResponse.status).to.be.equal(200)
//     expect(chaiHttpResponse.body).to.be.deep.equal(allTeamsMock)
//   });
// });
