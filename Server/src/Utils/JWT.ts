import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { config } from "dotenv";
import { Forbidden, Unauthorized } from "./Responses";
import { conexao, desconectar } from "../Conf/dataBase";
import { Collections } from "./Collections";

config();

const COLLECTION = Collections.aplicacao;
const JWT_KEY_SECRET = process.env.JWT_KEY_SECRET || '';

export const getToken = (req: Request) => {
    const BearerHeader: string | undefined = req.headers['authorization'];
    let retorno = undefined;

    if (BearerHeader) {
        const resultado = BearerHeader.split(' ');
        if (resultado.length > 1) {
            retorno = resultado[1];
        }
    }
    return retorno;
};

export const getPayloadToken = (token: string | undefined) => {
    let resultado = undefined;
    if (token) resultado = verify(token, JWT_KEY_SECRET);

    return resultado;
};

export const checkTokenAppAdministrador = async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);
    const payload = getPayloadToken(token);

    if (typeof payload === 'object') {
        if (payload?.nivel === 1) {
            const { client, db } = await conexao();
            const resultado = await db.collection(COLLECTION.name).findOne({ token });
            
            if(resultado){
                next();
            }else{
                Unauthorized(res);
            }

            desconectar(client);
        } else {
            Forbidden(res);
        }
    } else {
        Unauthorized(res);
    }
};

export const checkTokenApp = async (req: Request, res: Response, next:NextFunction) => {
    const codigo = req.params.codigoApp;
    const token = getToken(req);
    const payload = getPayloadToken(token);
    
    if (typeof payload === 'object') {
        if (payload?.codigo === codigo) {
            const { client, db } = await conexao();
            const resultado = await db.collection(COLLECTION.name).findOne({ token });
            
            if(resultado){
                next();
            }else{
                Unauthorized(res);
            }

            desconectar(client);
        } else {
            Forbidden(res);
        }
    } else {
        Unauthorized(res);
    }
    return false;
};
