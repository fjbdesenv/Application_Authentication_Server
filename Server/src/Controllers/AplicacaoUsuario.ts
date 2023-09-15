import { NextFunction, Request, Response } from "express";
import { conexao, desconectar } from "../Conf/dataBase";
import { Delete, NotFound, Update } from "../Utils/Responses";
import { autoIncrement, criptografarSenha, dataBR, validacao } from "../Utils/Functions";
import { Collections } from "../Utils/Collections";
import { Usuario } from "../Interfaces";
import { config } from "dotenv";

config();

const COLLECTION = Collections.aplicacao;
const FIELDS = ["nome", "email", "nivel"];
const AUTOINC_NAME:string= "usuario";

interface ClassRegister extends Usuario { };

export const Controller = {
    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const codigoApp = req.params.codigoApp;
            const resultado = await db.collection(COLLECTION.name).findOne({ codigo: codigoApp });
            desconectar(client);
            
            (resultado?.usuarios) ? res.json(resultado?.usuarios) : res.json([]);

        } catch (error) { next(error) }
    },

    async getId(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const { codigoApp, codigoUser } = req.params;
            const resultado = await db.collection(COLLECTION.name).findOne({ codigo: codigoApp });

            if (resultado?.usuarios) {
                const usuario: Array<Usuario> = resultado?.usuarios.filter((i: any) => i.codigo === codigoUser);
                usuario.length === 0 ? NotFound(res) : res.json(usuario);
            } else {
                NotFound(res);
            }

            desconectar(client);

        } catch (error) { next(error) };
    },

    async post(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const { codigoApp } = req.params;
            const codigo = await autoIncrement(db, AUTOINC_NAME);
            const data = dataBR();
            
            if (!validacao(form, FIELDS, res)) return;
            
            form.senha = criptografarSenha(form.senha);
            form.data_criacao = data;
            form.data_atualizacao = data;

            await db.collection(COLLECTION.name).updateOne({ codigo: codigoApp }, { $push: { usuarios: { codigo, ...form } } });
            const resultado = await db.collection(COLLECTION.name).findOne({ codigo: codigoApp });
            const usuario: Array<Usuario> = resultado?.usuarios.filter((i: any) => i.codigo == codigo);
            desconectar(client);

            (usuario.length > 0) ? res.status(201).json(usuario[0]) : NotFound(res);

        } catch (error) { next(error) }
    },

    async put(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const { codigoApp, codigoUser } = req.params;

            if (!validacao(form, FIELDS, res)) return;

            form.senha = criptografarSenha(form.senha);
            form.data_atualizacao = dataBR();

            const resultado = await db.collection(COLLECTION.name).findOne({ codigo: codigoApp });

            if (resultado?.usuarios) {
                const usuario: Array<Usuario> = resultado?.usuarios.filter((i: any) => i.codigo === codigoUser);

                if (usuario.length > 0) {
                    await db.collection(COLLECTION.name).updateOne(
                        { codigo: codigoApp, "usuarios.codigo": codigoUser },
                        { $set: { "usuarios.$": { ...(usuario[0]), ...form } } }
                    );
                }

                usuario.length === 0 ? NotFound(res) : Update(res);
            } else {
                NotFound(res);
            }

            desconectar(client);

        } catch (error) { next(error) }
    },

    async patch(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const { codigoApp, codigoUser } = req.params;

            if(form.senha) form.senha = criptografarSenha(form.senha);
            form.data_atualizacao = dataBR();

            const resultado = await db.collection(COLLECTION.name).findOne({ codigo: codigoApp });

            if (resultado?.usuarios) {
                const usuario: Array<Usuario> = resultado?.usuarios.filter((i: any) => i.codigo === codigoUser);

                if (usuario.length > 0) {
                    await db.collection(COLLECTION.name).updateOne(
                        { codigo: codigoApp, "usuarios.codigo": codigoUser },
                        { $set: { "usuarios.$": { ...(usuario[0]), ...form } } }
                    );
                }

                usuario.length === 0 ? NotFound(res) : Update(res);
            } else {
                NotFound(res);
            }

            desconectar(client);

        } catch (error) { next(error) }
    },

    async delete(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const { codigoApp, codigoUser } = req.params;
            const resultado = await db.collection(COLLECTION.name).updateOne({ codigo: codigoApp }, { $pull: { usuarios: { codigo: codigoUser } } });
            desconectar(client);
            
            resultado.modifiedCount > 0 ? Delete(res) : NotFound(res);
        } catch (error) { next(error) }
    }
};