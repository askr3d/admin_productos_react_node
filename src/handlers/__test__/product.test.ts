import request from 'supertest';
import server from '../../server';
import { response } from 'express';

describe('POST /api/products', () => {
    it('Should display validation erros', async() => {
        const response = await request(server).post('/api/products').send({});

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(4);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })
    
    it('Should validate that the price is greater than 0', async() => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Test',
            price: 0
        });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(1);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(2);
    })
    
    it('Should validate that the price is a number and greater than 0', async() => {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Test',
            price: "hola"
        });

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toHaveLength(2);

        expect(response.status).not.toBe(404);
        expect(response.body.errors).not.toHaveLength(4);
    })

    it('Should create a new product', async() => {
        const response = await request(server).post('/api/products').send({
            name: 'Mouse - Testing',
            price: 50
        });

        expect(response.status).toEqual(201);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('errors');
    })
})

describe('GET /api/products', () => {
    it('Should check if api/products url exists', async() => {
        const response = await request(server).get('/api/products');
        expect(response.status).not.toBe(404);
    })

    it('GET a JSON response with products', async() => {
        const response = await request(server).get('/api/products');
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/json/);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveLength(1);
        expect(response.body).not.toHaveProperty('errros');
    })
})

describe('GET /api/producst/:id', () => {
    it('Should return a 404 response for a non-existent product', async() => {
        const productId = 2000;
        const response = await request(server).get(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe("Producto no encontrado");
    })

    it('Should check a valid ID int he URL', async() => {
        const response = await request(server).get('/api/products/not-valid-url');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    })

    it('Get a JSON response for a single product', async() => {
        const response = await request(server).get('/api/products/1');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("data");
    })
})


describe('PUT /api/products', () => {
    it('Should check a valid ID int he URL', async() => {
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Curvo",
            availability: true,
            price: 300
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("errors");
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('ID no válido');
    })

    it('Should display validation error messages when updating a product', async() => {
        const response = await request(server).put('/api/products/1').send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(5);

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    })

    it('Should validate that the price is greater than 0', async() => {
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Nuevo - Actualizado",
            availability: true,
            price: 0
        });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors).toBeTruthy();
        expect(response.body.errors).toHaveLength(1);
        expect(response.body.errors[0].msg).toBe('Precio no valido');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    })

    it('Should return a 404 response for a non.existent product', async() => {
        const productId = 2000;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Nuevo - Actualizado",
            availability: true,
            price: 300
        });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data');
    })

    it('Should update an existing product with valid data', async() => {
        const productId = 1;
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Nuevo - Actualizado",
            availability: true,
            price: 300
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('data');

        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('errors');
    })


})

describe('PATH /api/products/:id', () => {
    it('Should update the product availability', async() => {
        const productId = 2000;
        const response = await request(server).patch(`/api/products/${productId}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
        expect(response.body).not.toHaveProperty('data')
    })

    it('Should return a 404 response for a non-existing product', async() => {
        const response = await request(server).patch('/api/products/1');
        expect(response.status).toBe(200);

        expect(response.body).toHaveProperty('data');
        expect(response.body.data.availability).toBe(false);

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
        expect(response.body).not.toHaveProperty('error');
    })
})

describe('DELETE /api/products', () => {
    it('Should check a valid ID', async() => {
        const response = await request(server).delete('/api/products/not-valid');
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('errors');
        expect(response.body.errors[0].msg).toBe('ID no válido');
    })

    it('Should return a 404 response for a non-existent product', async() => {
        const productId = 2000;
        const response = await request(server).delete(`/api/products/${productId}`);
        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Producto no encontrado');

        expect(response.status).not.toBe(200);
    })

    it('Should delete a product', async() => {
        const response = await request(server).delete('/api/products/1');
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("Producto Eliminado");

        expect(response.status).not.toBe(404);
        expect(response.status).not.toBe(400);
    })
})