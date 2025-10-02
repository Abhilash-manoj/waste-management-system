import express from 'express';
import WorkerLoginModel from '../models/workerLoginModels.js';
import WorkerLoginController from '../controllers/workerLoginController.js';

const router = express.Router();
const workerModel = new WorkerLoginModel();
const workerController = new WorkerLoginController(workerModel);

router.get('/workerlogin', (req, res) => workerController.renderLoginPage(req, res));
router.post('/worker/login', (req, res) => workerController.login(req, res));
router.get('/workerdashboard', (req, res) => workerController.renderDashboard(req, res));

export default router;