import { Router } from "express";
import { Controller as ControllerAplicacao } from "../Controllers/Aplicacao";
import { Controller as ControllerUsuario } from "../Controllers/AplicacaoUsuario";
import { checkTokenApp, checkTokenAppAdministrador } from "../Utils/JWT";

const router = Router();
const USER_ROUTER = "/:codigoApp/usuarios";

// Aplicação
router.get(`/`, checkTokenAppAdministrador, ControllerAplicacao.getAll);
router.get(`/:codigo`, checkTokenAppAdministrador, ControllerAplicacao.getId);
router.post(`/`, ControllerAplicacao.post);
router.put(`/:codigo`, checkTokenAppAdministrador, ControllerAplicacao.put);
router.patch(`/:codigo`, checkTokenAppAdministrador, ControllerAplicacao.patch);
router.delete(`/:codigo`, checkTokenAppAdministrador, ControllerAplicacao.delete);

// Usuário
router.get(`${USER_ROUTER}/`, checkTokenApp, ControllerUsuario.getAll);
router.get(`${USER_ROUTER}/:codigoUser`, checkTokenApp, ControllerUsuario.getId);
router.post(`${USER_ROUTER}/`, checkTokenApp, ControllerUsuario.post);
router.put(`${USER_ROUTER}/:codigoUser`, checkTokenApp, ControllerUsuario.put);
router.patch(`${USER_ROUTER}/:codigoUser`, checkTokenApp, ControllerUsuario.patch);
router.delete(`${USER_ROUTER}/:codigoUser`, checkTokenApp, ControllerUsuario.delete);

export default router;