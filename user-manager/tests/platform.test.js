const request = require('supertest');
const app = require('../app');  // Adjust the path to your actual Express app instance
const User = require('../models/User');  // Connect to User Model

// Mock the necessary database functions
jest.mock('../models/User');

let token; // to store authentication token after login

describe('expressController', ()=> {

    // Test Registration
    describe('register', () => {
        it('should register a new user successfully', async() => {
            const response = await request(app)
            .post('/api/users/register')
            .send({
                email: "test@example.com",
                password: "testpassword"
            });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User registered successfully!');
        })
    });
    
    describe('login', () => {
        it('should login user successfully', async() => {
            const response = await request(app)
                .post('/api/users/login')
                .send({
                    email: "test@example.com",
                    password: "testpassword"
                });
            
            expect(response.status).toBe(200);
            token = reponse.body.token;
        })
    });
    
})