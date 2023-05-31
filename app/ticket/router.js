/* eslint-disable camelcase */
const router = require('express').Router();
const ticketController = require('./controller');
const { police_check } = require('../../middlewares');

router.get(
  '/tickets-admin',
  police_check('view', 'Ticket'),
  ticketController.adminIndex,
);

router.get(
  '/tickets-user',
  police_check('read', 'Ticket'),
  ticketController.userIndex,
);

router.post(
  '/tickets-user',
  police_check('create', 'Ticket'),
  ticketController.store,
);

router.put(
  '/tickets-admin/:id',
  police_check('update', 'Ticket'),
  ticketController.update,
);

module.exports = router;
