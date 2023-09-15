import { Router } from "express";
import { Controller } from "../Controllers/Autenticacao";
import { checkTokenApp } from "../Utils/JWT";

const router = Router();

router.post(`/auth/aplicacao`, Controller.authAplicacao);
router.post(`/auth/aplicacao/:codigoApp/usuario`, checkTokenApp, Controller.authUsuario);
router.patch(`/logout/aplicacao`, Controller.logoutAplicacao);
router.patch(`/logout/usuario/:codigoUser`, Controller.logoutUser);

export default router;