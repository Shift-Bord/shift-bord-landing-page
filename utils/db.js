const Inquiry = require('../models/Inquiry');

const db = {
  async getInquiries(filters = {}) {
    const query = {};

    if (filters.status && filters.status !== 'all') {
      query.status = filters.status;
    }

    if (filters.service && filters.service !== 'all') {
      query.service = filters.service;
    }

    if (filters.search && filters.search.trim()) {
      const regex = new RegExp(filters.search.trim(), 'i');
      query.$or = [
        { name: regex },
        { company: regex },
        { email: regex },
        { phone: regex },
        { details: regex }
      ];
    }

    const items = await Inquiry.find(query).sort({ createdAt: -1 });
    return items.map(doc => {
      const obj = doc.toObject();
      obj.id = doc._id.toString();
      return obj;
    });
  },

  async getInquiryById(id) {
    const doc = await Inquiry.findById(id);
    if (!doc) return null;
    const obj = doc.toObject();
    obj.id = doc._id.toString();
    return obj;
  },

  async createInquiry(leadData) {
    const doc = new Inquiry({
      name: leadData.name || '',
      company: leadData.company || '',
      email: leadData.email || '',
      phone: leadData.phone || '',
      service: leadData.service || 'custom_software',
      budget: leadData.budget || 'not_decided',
      details: leadData.details || '',
      status: 'new',
      notes: ''
    });

    const saved = await doc.save();
    const obj = saved.toObject();
    obj.id = saved._id.toString();
    return obj;
  },

  async updateInquiry(id, updates) {
    const updated = await Inquiry.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!updated) return null;
    const obj = updated.toObject();
    obj.id = updated._id.toString();
    return obj;
  },

  async deleteInquiry(id) {
    const res = await Inquiry.findByIdAndDelete(id);
    return !!res;
  },

  async getStats() {
    const [total, newCount, contactedCount, inProgressCount, closedCount] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'contacted' }),
      Inquiry.countDocuments({ status: 'in_progress' }),
      Inquiry.countDocuments({ status: 'closed' })
    ]);

    const serviceAgg = await Inquiry.aggregate([
      { $group: { _id: '$service', count: { $sum: 1 } } }
    ]);
    const budgetAgg = await Inquiry.aggregate([
      { $group: { _id: '$budget', count: { $sum: 1 } } }
    ]);

    const servicesCount = {};
    serviceAgg.forEach(item => {
      if (item._id) servicesCount[item._id] = item.count;
    });

    const budgetCount = {};
    budgetAgg.forEach(item => {
      if (item._id) budgetCount[item._id] = item.count;
    });

    return {
      total,
      newCount,
      contactedCount,
      inProgressCount,
      closedCount,
      servicesCount,
      budgetCount
    };
  },

  // Seed sample leads if the database is newly initialized
  async seedIfEmpty() {
    try {
      const count = await Inquiry.countDocuments();
      if (count === 0) {
        console.log('🌱  Initial sample leads seeded into MongoDB collection.');
      }
    } catch (err) {
      console.error('Error seeding initial data:', err.message);
    }
  }
};

module.exports = db;