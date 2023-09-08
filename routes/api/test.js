const express = require("express");

const router = express.Router();

const { isValidId, authenticate, validateBody } = require("../../middlewares");
const { joiTestSchema } = require("../../models/test");
const ctrlTests = require("../../controllers/tests");
const { schemas } = require("../../models/user");

/**
 * @swagger
 * /test/:
 *   get:
 *     tags: [Test]
 *     summary: Get all tests
 *     security:
 *       - Bearer: []
 *     description: Use this endpoint to get all tests
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                    $ref: '#/components/schemas/TestResponse'
 *       '401':
 *          description: unauthorized
 */
router.get("/", ctrlTests.getTests);

/**
 * @swagger
 * /test/getResults:
 *   get:
 *     tags: [Test]
 *     summary: Get results, who passed your test
 *     security:
 *       - Bearer: []
 *     description: Use this endpoint get results, who passed your test
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserResultResponse'
 *       '401':
 *          description: unauthorized
 */
router.get("/getResults", authenticate, ctrlTests.getResults);

/**
 * @swagger
 * /test/{id}:
 *   get:
 *     tags: [Test]
 *     summary: Get test by id
 *     security:
 *       - Bearer: []
 *     description: Use this endpoint to get test by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the test to retrieve
 *     responses:
 *       '200':
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/TestResponse'
 *       '400':
 *          description: is not valid id
 *       '401':
 *          description: unauthorized
 */
router.get("/:id", isValidId, ctrlTests.getById);

/**
 * @swagger
 * /test/:
 *   post:
 *     tags: [Test]
 *     summary: Add new test
 *     security:
 *       - Bearer: []
 *     description: Use this endpoint to add new test
 *     requestBody:
 *       description: New test object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TestRequest'
 *     responses:
 *       '201':
 *         description: Successful response
 *         content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/TestResponse'
 *       '400':
 *          description: Bad request (invalid request body)
 *       '401':
 *          description: unauthorized
 */
router.post("/", authenticate, validateBody(joiTestSchema), ctrlTests.addTest);

/**
 * @swagger
 * /test/{id}:
 *   post:
 *     tags: [Test]
 *     summary: Add results of the test
 *     security:
 *       - Bearer: []
 *     description: Use this endpoint to add results of the test
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the test to write
 *     requestBody:
 *       description: Passed test object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Successful response
 *       '400':
 *          description: Bad request (invalid request body)
 *       '401':
 *          description: unauthorized
 */
router.post(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.joiTestScoreSchema),
  ctrlTests.writePassedTest
);

module.exports = router;
