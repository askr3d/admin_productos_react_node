import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator'
import Product from '../models/Product.model';
import colors from 'colors';

export const getProducts = async(request: Request, response: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ],
        // attributes: {
        //     exclude: ['createdAt', 'updatedAt', 'availability']
        // }
    });
    response.json({data: products});
}

export const getProductById = async(request: Request, response: Response) => {
    const { id } = request.params;
    const product = await Product.findByPk(id);

    if(!product){
        response.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }

    response.json({data: product})
}

export const createProduct = async(request: Request, response: Response) => {
    const product = await Product.create(request.body);
    response.status(201).json({data: product});
}

export const updateProduct = async(request: Request, response: Response) => {
    const { id } = request.params;
    const product = await Product.findByPk(id);

    if(!product){
        response.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }

    //Actualizar
    await product.update(request.body);
    await product.save();

    response.json({data: product})
}

export const updateAvailability = async(request: Request, response: Response) => {
    const { id } = request.params;
    const product = await Product.findByPk(id);

    if(!product){
        response.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }

    //Actualizar
    product.availability = !product.dataValues.availability;
    await product.save();

    response.json({data: product});
}

export const deleteProduct = async(request: Request, response: Response) => {
    const { id } = request.params;
    const product = await Product.findByPk(id);

    if(!product){
        response.status(404).json({
            error: 'Producto no encontrado'
        })
        return;
    }

    await product.destroy();
    response.json({data: 'Producto Eliminado'})
}