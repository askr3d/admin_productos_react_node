import express from 'express';
import colors from 'colors';
import router from './router';
import swaggerUi from 'swagger-ui-express';
import db from './config/db';
import swaggerSpec, { swaggerUiOptions } from './config/swagger';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';

//Conectar a base de datos
export const connectDB = async() => {
    try {
        await db.authenticate();
        db.sync();
        // console.log(colors.bgGreen.white('Conexion exitosa a la base de datos'));
        
    } catch (error) {
        console.log(colors.red.bold('Hubo un error al conectar a la base de datos'));
    }
}

connectDB();

const server = express();

//Permitir conexiones
const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if(origin === process.env.FRONTEND_URL){
            callback(null, true);
        }else{
            callback(new Error('Error de CORS'));
        }
    }
}

server.use(cors(corsOptions));

//Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'));
server.use('/api/products', router);

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions))


export default server