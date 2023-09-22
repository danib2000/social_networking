const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Group = require("../modules/Group");
const userController = require("../controllers/group");

// Get a group by ID
router.get('/:id', async (req, res) => {
    const group = await Group.findById(req.params.id);
  
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
  
    res.json(group);
  });
  
  // Create a group
  router.post('/', async (req, res) => {
    const group = new Group(req.body);
  
    await group.save();
  
    res.status(201).json(group);
  });
  
  // Update a group
  router.put('/:id', async (req, res) => {
    const group = await Group.findById(req.params.id);
  
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
  
    Object.assign(group, req.body);
  
    await group.save();
  
    res.status(200).json(group);
  });
  
  // Delete a group
  router.delete('/:id', async (req, res) => {
    const group = await Group.findById(req.params.id);
  
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
  
    await group.remove();
  
    res.status(204).send();
  });


module.exports = router;
