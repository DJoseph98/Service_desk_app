const request = require("supertest");
const app = require('../app');
const { Ticket } = require('../models/index');
const { v4 } = require('uuid');

let bodyTestData = {
    title: "createTicket",
    email: "test@test",
    problemDescription: "test unit",
    ticketLvlPriorId: 1
}

let ticketNumber;

beforeAll(async () => {
    ticketNumber = v4();
    await Ticket.create({
        ...bodyTestData,
        ticketActivitesId:1,
        ticketStatusId:1,
        ticketNumber: ticketNumber
    });
});

describe('Ticket API', () => {
    it('should show all tickets', async (done) => {
        const res = await request(app).get('/api/ticketList');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('response');
        done();
    }),
        it('should create a new ticket', async (done) => {
            const res = await request(app)
                .post('/api/createTicket')
                .send({
                    ...bodyTestData
                });
            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('newTicket');
            done();
        }),
        it('should fail to create a new ticket', async (done) => {
            const res = await request(app)
                .post('/api/createTicket')
                .send({
                    ...bodyTestData,
                    email: undefined

                });
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error');
            done();
        }),
        it('should update ticket', async (done) => {
            const res = await request(app)
                .put(`/api/updateTicket/${ticketNumber}`)
                .send({
                    ...bodyTestData,
                    email:"email@test"
                });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('updatedTicket');
            done();
        }),
        it('should fail to update ticket', async (done) => {
            const res = await request(app)
                .put('/api/updateTicket/3')
                .send({
                    ...bodyTestData
                });
            expect(res.statusCode).toEqual(500);
            expect(res.body).toHaveProperty('error');
            done();
        });
});