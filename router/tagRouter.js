import express from "express";

import {
  addTag,
  fetchTags,
//  fetchTagById,
  fetchTagByName
} from "../controller/tagController.js";

const router = express.Router();

router.post('/tag', addTag);
router.get('/tag/', fetchTags);
// router.get('/tag/:id', fetchTagById);
router.get('/tag/:name', fetchTagByName);

export default router;
