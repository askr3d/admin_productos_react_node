import { Router } from "express";
import { body, param } from 'express-validator'
import { createProduct, deleteProduct, getProductById, getProducts, updateAvailability, updateProduct } from "./handlers/product";
import { handleInputErrors } from "./middleware";


const router = Router();
/**
 * @swagger
 * components:
 *  schemas:
 *      Product:
 *          type: object
 *          properties:
 *              id:
 *                  type: integer
 *                  description: The Product ID
 *                  example: 1
 *              name:
 *                  type: string
 *                  description: The Product name
 *                  example: Monitor Curvo 49 pulgadas
 *              price:
 *                  type: number
 *                  description: The Product price
 *                  example: 300
 *              availability:
 *                  type: boolean
 *                  description: The Product availability
 *                  example: true
*/

/**
 * @swagger
 * /api/products:
 *  get:
 *      summary: Get a list of products
 *      tags:
 *          - Products
 *      description: Return a list of products
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Product'
 */
router.get('/', getProducts);

/**
 * @swagger
 * /api/products/{id}:
 *  get:
 *      summary: Get a product by ID
 *      tags:
 *          - Products
 *      description: Return a product based on its unique ID
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *      responses:
 *          200:
 *              description: Successful Response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Not Found
 *          400:
 *              description: Bad Request - Invalid ID
 */
router.get('/:id',
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    getProductById
);

/**
 * @swagger
 * /api/products:
 *  post:
 *      summary: Creates a new product
 *      tags:
 *          - Product
 *      description: Returns a new record in the database
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *      responses:
 *          201:
 *              description: Product created successfully
 *          400:
 *              description: Bad Request - Invalid Input Data
 */
router.post('/', 
    //Validacion
    body('name')
            .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price')
            .isNumeric().withMessage('Valor no válido')
            .notEmpty().withMessage('El precio del producto es obligatorio')
            .custom(value => value > 0).withMessage('Precio no valido'),
    handleInputErrors,
    createProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  put:
 *      summary: Updates a product with user input
 *      tags:
 *          - Products
 *      description: Returns the updated product
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          name:
 *                              type: string
 *                              example: "Monitor Curvo 49 pulgadas"
 *                          price:
 *                              type: number
 *                              example: 399
 *                          availability:
 *                              type: boolean
 *                              example: true
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product Not Found
 *          400:
 *              description: Bas Request - Invalid ID or Invalid input data
 */
router.put('/:id',
    param('id').isInt().withMessage('ID no válido'),
    body('name')
            .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('price')
            .isNumeric().withMessage('Valor no válido')
            .notEmpty().withMessage('El precio del producto es obligatorio')
            .custom(value => value > 0).withMessage('Precio no valido'),
    body('availability')
            .isBoolean()
            .withMessage('Valor para disponibilidad no válido'),
    handleInputErrors,
    updateProduct
);

/**
 * @swagger
 * /api/products/{id}:
 *  patch:
 *      summary: Update Product availability
 *      tags:
 *          - Product
 *      description: Returns the updated availability
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Product'
 *          404:
 *              description: Product Not Found
 *          400:
 *              description: Bas Request - Invalid ID
 *          
 */
router.patch('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    updateAvailability
);

/**
 * @swagger
 * /api/products/{id}:
 *  delete:
 *      summary: Delete a product by a given ID
 *      tags:
 *          - Product
 *      description: Returns a confirmation message
 *      parameters:
 *       - in: path
 *         name: id
 *         description: The ID of the product to delete
 *         required: true
 *         schema:
 *           type: integer
 *      responses:
 *          200:
 *              description: Successful response
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: string
 *                          value: 'Producto Eliminado'
 *          404:
 *              description: Product Not Found
 *          400:
 *              description: Bas Request - Invalid ID
 */
router.delete('/:id', 
    param('id').isInt().withMessage('ID no válido'),
    handleInputErrors,
    deleteProduct
);

export default router;