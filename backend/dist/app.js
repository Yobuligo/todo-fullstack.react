"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const Todo_1 = require("./model/Todo");
const Controller_1 = require("./services/Controller");
const SequelizeRepository_1 = require("./services/SequelizeRepository");
const ITodo_1 = require("./shared/model/ITodo");
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(new Controller_1.Controller(ITodo_1.TodoMeta, new SequelizeRepository_1.SequelizeRepository(Todo_1.Todo)).router);
app.use((req, res) => {
    res.status(404).send("<h1>Unknown Request</h1>");
});
app.listen(5000);
//# sourceMappingURL=app.js.map