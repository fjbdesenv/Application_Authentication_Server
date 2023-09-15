import { NextFunction, Request, Response } from "express";
import { conexao, desconectar } from "../Conf/dataBase";
import { Delete, NotFound, Update } from "../Utils/Responses";
import { autoIncrement, validacao } from "../Utils/Functions";
import { Collections } from "../Utils/Collections";
import { Aplicacao } from "../Interfaces";
import { config } from "dotenv";

config();

const COLLECTION = Collections.aplicacao;
interface ClassRegister extends Aplicacao { };
const AUTOINC_NAME: string = "aplicacao";

export const Controller = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const resultado = await db.collection(COLLECTION.name).find({}).toArray();
            desconectar(client);

            res.json(resultado);

        } catch (error) { next(error) }
    },

    async getId(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const codigo = req.params.codigo;

            const resultado = await db.collection(COLLECTION.name).findOne({ codigo });
            desconectar(client);
            
            resultado?._id ? res.json(resultado) : NotFound(res);

        } catch (error) { next(error) };
    },

    async post(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const codigo = await autoIncrement(db, AUTOINC_NAME);
            const data = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            if (!validacao(form, COLLECTION.fields, res)) return;
            
            form.data_criacao = data;
            form.data_atualizacao = data;

            await db.collection(COLLECTION.name).insertOne({ codigo, ...form });

            const registro = await db.collection(COLLECTION.name).findOne({ codigo });
            desconectar(client);

            res.status(201).json(registro);

        } catch (error) { next(error) }
    },

    async put(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const codigo: string = req.params.codigo;

            if (!validacao(form, COLLECTION.fields, res)) return;
            form.data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            const resultado = await db.collection(COLLECTION.name).findOneAndUpdate(
                { codigo },
                { $set: { codigo, ...form } }
            );
            desconectar(client);

            !resultado?.value ? NotFound(res) : Update(res);

        } catch (error) { next(error) }
    },

    async patch(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const codigo: string = req.params.codigo;
            
            form.data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

            const resultado = await db.collection(COLLECTION.name).findOneAndUpdate(
                { codigo },
                { $set: { codigo, ...form } }
            );
            desconectar(client);

            !resultado?.value ? NotFound(res) : Update(res);

        } catch (error) { next(error) }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const codigo: string = req.params.codigo;
            const resultado = await db.collection(COLLECTION.name).findOneAndDelete({ codigo });
            desconectar(client);

            resultado?.value ? Delete(res) : NotFound(res);
            
        } catch (error) { next(error) }
    }
};