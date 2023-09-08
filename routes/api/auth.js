const express = require("express");
const { validateBody, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");

const router = express.Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new user
 *     description: Use this endpoint to register a new user
 *     requestBody:
 *       description: Registration's object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationRequest'
 *     responses:
 *       '201':
 *         description: Successful response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserFullResponse'
 *       '400':
 *          description: Bad request (invalid request body)
 *       '409':
 *          description: Provided email already exists
 */

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login user
 *     description: Use this endpoint to login
 *     requestBody:
 *       description: Login's object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       '201':
 *         description: Successful response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserFullResponse'
 *       '401':
 *          description: Email or password invalid
 */
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);

/**
 * @swagger
 * /auth/current:
 *   get:
 *     tags: [Auth]
 *     summary: Get currently logged in user
 *     security: 
 *       - Bearer: []
 *     description: Use this endpoint to get currently logged in user
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserFullResponse'
 *       '401':
 *          description: unauthorized
 */
router.get("/current", authenticate, ctrl.getCurrent);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current user
 *     security: 
 *       - Bearer: []
 *     description: Use this endpoint to logout current user
 *     responses:
 *       '200':
 *         description: Successful response
 *       '401':
 *          description: unauthorized
 */
router.post("/logout", authenticate, ctrl.logout);

module.exports = router;
