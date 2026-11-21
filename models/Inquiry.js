const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    company: {
      type: String,
      trim: true,
      default: ''
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    service: {
      type: String,
      default: 'custom_software'
    },
    budget: {
      type: String,
      default: 'not_decided'
    },
    details: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in_progress', 'closed'],
      default: 'new'
    },
    notes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

// Search text index
inquirySchema.index({
  name: 'text',
  company: 'text',
  email: 'text',
  phone: 'text',
  details: 'text'
});

const Inquiry = mongoose.model('Inquiry', inquirySchema);

module.exports = Inquiry;
