import { Logout, NotFound, Unauthorized } from "../Utils/Responses";
import { NextFunction, Request, Response } from "express";
import { conexao, desconectar } from "../Conf/dataBase";
import { Secret, sign } from "jsonwebtoken";
import { Collections } from "../Utils/Collections";
import { validacao } from "../Utils/Functions";
import { getToken } from "../Utils/JWT";
import { Auth } from "../Interfaces";
import { config } from "dotenv";

config();

const COLLECTION = Collections.aplicacao;
const JWT_KEY_SECRET: Secret = process.env.JWT_KEY_SECRET || '';
const FIELDS = ['email', 'senha'];

interface ClassRegister extends Auth { };

export const Controller = {
    async authUsuario(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const { email, senha } = form;
            const token = getToken(req);

            if (!validacao(form, FIELDS, res)) return;


            const resultado = await db.collection(COLLECTION.name).findOne({ token });

            if (resultado?.usuarios) {
                const usuarios = resultado?.usuarios;
                const idX = usuarios.findIndex((usuario: any) => (usuario.email == email && usuario.senha == senha));

                if (idX > -1) {
                    const { codigo, email, nivel } = usuarios[idX]
                    const data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                    const token = sign(
                        { codigo, email, nivel },
                        JWT_KEY_SECRET,
                        { expiresIn: "1d" }
                    );

                    await db.collection(COLLECTION.name).updateOne(
                        { 'usuarios.codigo': codigo },
                        {
                            $set: { 'usuarios.$.token': token, 'usuarios.$.data_atualizacao': data_atualizacao }
                        }
                    );

                    res.json({ token });
                } else {
                    Unauthorized(res);
                }
            } else {
                Unauthorized(res);
            };

            desconectar(client);

        } catch (error) { next(error) }
    },

    async authAplicacao(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const form: ClassRegister = req.body;
            const { email, senha } = form;

            if (!validacao(form, ['email', 'senha'], res)) return;

            const resultado = await db.collection(COLLECTION.name).findOne({ $and: [{ email }, { senha }] });

            if (resultado?._id) {
                const { codigo, email, nivel } = resultado;
                const data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                const token = sign(
                    { codigo, email, nivel },
                    JWT_KEY_SECRET,
                    { expiresIn: "30d" }
                );

                await db.collection(COLLECTION.name).updateOne(
                    { codigo: resultado?.codigo },
                    { $set: { token, data_atualizacao } }
                );
                res.json({ token });
            } else {
                Unauthorized(res);
            };

            desconectar(client);

        } catch (error) { next(error) }
    },

    async logoutAplicacao(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const token = getToken(req);

            if (token) {
                const data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                const resultado_aplicacao = await db.collection(COLLECTION.name).findOneAndUpdate(
                    { token },
                    { $set: { token: '', data_atualizacao } }
                );

                (resultado_aplicacao?.value) ? Logout(res) : NotFound(res);
            } else {
                Unauthorized(res);
            }

            desconectar(client);

        } catch (error) { next(error) }
    },

    async logoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { client, db } = await conexao();
            const token = getToken(req);
            const codigoUser = req.params.codigoUser;

            if (token) {
                const data_atualizacao = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
                const resultado_usuario = await db.collection(COLLECTION.name).updateOne(
                    { 'usuarios.codigo': codigoUser },
                    {
                        $set: { 'usuarios.$.token': '', 'usuarios.$.data_atualizacao': data_atualizacao }
                    }
                );

                (resultado_usuario.modifiedCount > 0) ? Logout(res) : NotFound(res);
            } else {
                Unauthorized(res);
            }

            desconectar(client);

        } catch (error) { next(error) }
    }

};