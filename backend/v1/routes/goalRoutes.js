const express = require('express');
const goalController = require('../../controllers/goalController');
const authenticateUser = require('../../middleware/auth');
const router = express.Router();

// Routes for goals
// create goal
router.post('/', authenticateUser, goalController.createGoal);
// get goal
router.get('/', authenticateUser, goalController.getGoals);
// update goal
router.patch('/:goalId', authenticateUser, goalController.updateGoals);
// delete goal
router.delete('/:goalId', authenticateUser, goalController.deleteGoal);

// Routes for works
// create work
router.post('/:goalId/work', authenticateUser, goalController.createWork);
// get work
router.get('/:goalId/work', authenticateUser, goalController.getWork);
// update work
router.patch('/:goalId/work/:workId', authenticateUser, goalController.updateWork);
// delete work
router.delete('/:goalId/work/:workId', authenticateUser, goalController.deleteWork);


module.exports = router;