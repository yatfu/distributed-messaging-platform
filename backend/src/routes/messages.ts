import express from "express";
import {pool} from '../db';

const router = express.Router();
// EDIT message given id
// DELETE message given id
router.delete("/:messageId", async (req, res) => {
  const { messageId } = req.params;
  const result = await pool.query(
    `DELETE FROM messages WHERE id = $1 RETURNING *`, [messageId]
  );
  if (result.rowCount === 0) {
    return res.status(404).json({error: "Message not found"});
  }
  res.status(204).send();
});

export default router;