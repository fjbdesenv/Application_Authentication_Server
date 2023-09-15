import { Router } from "express";
import { Controller as ControllerNivel } from "../Controllers/AplicacaoNivel";
import { checkTokenAppAdministrador } from "../Utils/JWT";

const router = Router();

// Nivel
router.get(`/`, checkTokenAppAdministrador, ControllerNivel.getAll);
router.get(`/usuarios`, ControllerNivel.appGetAll);
router.get(`/aplicacoes`, checkTokenAppAdministrador, ControllerNivel.userGetAll);
router.get(`/:codigo`, checkTokenAppAdministrador, ControllerNivel.getId);
router.post(`/`, checkTokenAppAdministrador, ControllerNivel.post);
router.put(`/:codigo`, checkTokenAppAdministrador, ControllerNivel.put);
router.patch(`/:codigo`, checkTokenAppAdministrador, ControllerNivel.patch);
router.delete(`/:codigo`, checkTokenAppAdministrador, ControllerNivel.delete);

export default router;