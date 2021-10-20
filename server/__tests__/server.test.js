const request = require('supertest');
const app = require('../server');

describe('Api testing', () => {
    it('Get game', (done) => {
        request(app)
        .get('/')
        .expect(200)
        .end((err, res) => {
            expect(Object.keys(res.body).length).not.toEqual(0)
            expect(res.body.player1.cards.length + res.body.player1.cardsInHand.length).toEqual(20)
            done();
        })
    });
    it('Play card succesfully', (done) => {
        request(app)
        .get('/playcard/0')
        .expect(200)
        .end((err, res) => {
            expect(Object.keys(res.body).length).not.toEqual(0)
            done();
        })
    });
    it('Play card unsuccesfully', (done) => {
        request(app)
            .get('/playcard/100')
            .expect(400)
            .end((err, res) => {
                done();
            })
    });
    it('Change player', (done) => {
        request(app)
        .get('/changeplayer')
        .expect(200)
        .end((err, res) => {
            expect(Object.keys(res.body).length).not.toEqual(0)
            done();
        })
    });
    it('Restart game', (done) => {
        request(app)
        .get('/restartgame')
        .expect(200)
        .end((err, res) => {
            expect(Object.keys(res.body).length).not.toEqual(0)
            done();
        })
    });
});
