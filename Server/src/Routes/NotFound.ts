import { Router } from "express";
import { NotFound } from "../Utils/Responses";

const router = Router();

router.get(`*`,  (req, res, next)=> NotFound(res));
router.post(`*`,  (req, res, next)=> NotFound(res));
router.put(`*`, (req, res, next)=> NotFound(res));
router.patch(`*`, (req, res, next)=> NotFound(res));
router.delete(`*`, (req, res, next)=> NotFound(res));

export default router;