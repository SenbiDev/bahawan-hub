/* eslint-disable consistent-return */
/* eslint-disable camelcase */
const Ticket = require('./model');
const Category = require('../category/model');
const { ticketStatus } = require('../../constant');

const adminIndex = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 10, query = '', category_number, is_priority, status,
    } = req.query;

    let criteria = {};

    if (query.length) {
      criteria = { ...criteria, summary: { $regex: `${query}`, $options: 'i' } };
    }

    if (category_number) {
      const categoryResult = await Category.findOne({
        category_number: parseInt(category_number, 10),
      });

      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id };
      }
    }

    if (is_priority) {
      criteria = { ...criteria, is_priority: is_priority === 'true' };
    }

    if (status) {
      criteria = { ...criteria, status: ticketStatus[status] };
    }

    const count = await Ticket.find(criteria).countDocuments();
    const ticket = await Ticket
      .find(criteria)
      .skip((parseInt(page, 10) - 1) * limit)
      .limit(parseInt(limit, 10) * 1)
      .populate('category');

    return res.json({
      data: ticket,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (err) {
    next(err);
  }
};

const userIndex = async (req, res, next) => {
  try {
    const {
      page = 1, limit = 10, query = '', category_number, is_priority, status,
    } = req.query;

    let criteria = { user: req.user._id };

    if (query.length) {
      criteria = { ...criteria, summary: { $regex: `${query}`, $options: 'i' } };
    }

    if (category_number) {
      const categoryResult = await Category.findOne({
        category_number: parseInt(category_number, 10),
      });

      if (categoryResult) {
        criteria = { ...criteria, category: categoryResult._id };
      }
    }

    if (is_priority) {
      criteria = { ...criteria, is_priority: is_priority === 'true' };
    }

    if (status) {
      criteria = { ...criteria, status: ticketStatus[status] };
    }

    const count = await Ticket.find(criteria).countDocuments();
    const ticket = await Ticket
      .find(criteria)
      .skip((parseInt(page, 10) - 1) * limit)
      .limit(parseInt(limit, 10) * 1)
      .populate('category');

    return res.json({
      data: ticket,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page, 10),
    });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    const category = await Category.findOne({ category_number: payload.category_number });

    if (category) {
      payload = { ...payload, category: category._id };
    } else {
      delete payload.category;
    }

    payload = { ...payload, user: req.user._id };

    const ticket = new Ticket(payload);
    await ticket.save();
    return res.status(201).json(ticket);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const payload = req.body;
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(ticket);
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

module.exports = {
  adminIndex,
  userIndex,
  store,
  update,
};
