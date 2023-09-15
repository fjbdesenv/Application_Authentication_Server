import { NextFunction, Request, Response } from "express";

export const NotFound = (res: Response) => {
    res.status(404).json({ ok: false, message: 'Conteúdo não encontrado.' });
};

export const Erro = (error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ ok: false,  Erro: error.message });
};

export const NotField = (res: Response, filed: string) => {
    res.status(412).json({ ok: false, Erro: `Campo '${filed}' é obrigatorio.` });
};

export const Delete = (res: Response) => {
    res.status(200).json({ ok: true, message: `Registro deletado com sucesso.` });
};

export const Update = (res: Response) => {
    res.status(204).end();
};

export const NotFoundForeignKey = (res: Response, filed: string) => {
    res.status(412).json({ ok: false, message: `Chave estrangeira não existe para campo '${filed}'.` });
};

export const Logout = (res: Response) => {
    res.status(200).json({ ok: true, message: `Logout feito com sucesso.` });
};

export const Unauthorized = (res: Response) => {
    res.status(401).json({  ok: false, message: `Não autorizado, faça autenticação.` });
};

export const UnauthorizedKey = (res: Response) => {
    res.status(401).json({  ok: false, message: `Necessario informar o header 'X-app-key'.` });
};

export const Forbidden = (res: Response) => {
    res.status(403).json({  ok: false, message: `Autentificação insuficiência para acesso.` });
};