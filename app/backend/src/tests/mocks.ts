const allTeamsMock = [
  {
    "id": 1,
    "teamName": "Avaí/Kindermann"
  },
  {
    "id": 2,
    "teamName": "Bahia"
  },
  {
    "id": 3,
    "teamName": "Botafogo"
  },
  {
    "id": 4,
    "teamName": "Corinthians"
  },
  {
    "id": 5,
    "teamName": "Cruzeiro"
  },
  {
    "id": 6,
    "teamName": "Ferroviária"
  },
  {
    "id": 7,
    "teamName": "Flamengo"
  },
  {
    "id": 8,
    "teamName": "Grêmio"
  },
  {
    "id": 9,
    "teamName": "Internacional"
  },
  {
    "id": 10,
    "teamName": "Minas Brasília"
  },
  {
    "id": 11,
    "teamName": "Napoli-SC"
  },
  {
    "id": 12,
    "teamName": "Palmeiras"
  },
  {
    "id": 13,
    "teamName": "Real Brasília"
  },
  {
    "id": 14,
    "teamName": "Santos"
  },
  {
    "id": 15,
    "teamName": "São José-SP"
  },
  {
    "id": 16,
    "teamName": "São Paulo"
  }
];

const teamsByIdMock = {"id": 1, "teamName": "Avaí/Kindermnann"}

const reqBodyLoginMock = {
  "email": "admin@admin.com",
  "password": "secret_admin"
};

const tokenMock = {
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiYWRtaW5AYWRtaW4uY29tIiwiaWF0IjoxNjgwMTkzNzcxLCJleHAiOjE2ODA3OTg1NzF9.Bjlng4EBVXA6SBoS0eChSDljr_401yH_tfEDcRvu_L8"
}

const badRequestLoginMock = {
  "message": "All fields must be filled"
}

const unaithorizedLoginMock = {
  "message": "Invalid email or password"
}

export default {
  allTeamsMock,
  teamsByIdMock,
  reqBodyLoginMock,
  tokenMock,
  badRequestLoginMock,
  unaithorizedLoginMock
}