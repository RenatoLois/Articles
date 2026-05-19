import dotenv from "dotenv";
import express from 'express';
import tagRouter from './router/tagRouter.js';
import articleRouter from './router/articleRouter.js';
import renderRouter from './router/renderRouter.js';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

const dirname = path.dirname(fileURLToPath(import.meta.url));

const { SERVER_PORT } = process.env;

const app = express();

app.use(express.static(path.join(dirname, 'public')));
app.use(express.json());
app.use(cors());

app.use('/api', tagRouter);
app.use('/api', articleRouter);
app.use('/', renderRouter);

app.listen(SERVER_PORT, () => console.log(`Server listening on ${SERVER_PORT}`));

