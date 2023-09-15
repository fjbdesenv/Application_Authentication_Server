import { NotField, UnauthorizedKey } from "./Responses";
import { Collections } from "./Collections";
import { Db } from "mongodb";
import { NextFunction, Response } from "express";

export const validacao = (collection: any, campos: Array<string>, res: Response) => {
    for (let posicao = 0; posicao < campos.length; posicao++) {
        if (!collection?.[campos[posicao]]) {
            NotField(res, campos[posicao]);
            return false;
        }
    }
    return true;
};

export const autoIncrement = async (db: Db, collection: string) => {

    const COLLECTION_AUTO_INCREMENT = Collections.autoIncrement;
    const WHERE = { codigo: "1" };

    const autoIncrement = await db.collection(COLLECTION_AUTO_INCREMENT.name).findOne(WHERE);
    const codigo: string = autoIncrement?.[collection];
    const registro = JSON.parse(`{"${collection}" : "${(parseInt(codigo) + 1)}"}`);

    await db.collection(COLLECTION_AUTO_INCREMENT.name).updateOne(
        WHERE,
        { $set: registro }
    );

    return codigo;
};

export const checkKey = (req: any, res: Response, next: NextFunction) => {
    const APP_KEY: string = process.env.APP_KEY || '';
    const HEADER_APP_KEY: string = req.header('x-app-key');

    if (HEADER_APP_KEY) {

        const HEADER_APP_KEY_PROCESS: string = HEADER_APP_KEY.replace(',', '').trim();

        if (HEADER_APP_KEY_PROCESS === APP_KEY) {
            next();
        } else {
            UnauthorizedKey(res);
        }

    } else {
        UnauthorizedKey(res);
    }

};



