const mongoose = require('mongoose');

const { model, Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const ticketSchema = Schema({
  ticket_number: {
    type: Number,
  },
  is_priority: {
    type: Boolean,
    default: false,
  },
  summary: {
    type: String,
    required: [true, 'Summary harus diisi!'],
    maxlength: [100, 'Panjang summary maksimal 100 karakter'],
  },
  detail: {
    type: String,
    required: [true, 'Detail harus diisi'],
    maxlength: [500, 'Panjang detail maksimal 500 karakter'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Kategori harus diisi'],
  },
  status: {
    type: String,
    enum: ['menunggu tindakan', 'sedang dalam proses', 'sedang direspon', 'telah selesai'],
    default: 'menunggu tindakan',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },

}, { timestamps: true });

ticketSchema.plugin(AutoIncrement, { inc_field: 'ticket_number' });

module.exports = model('Ticket', ticketSchema);
