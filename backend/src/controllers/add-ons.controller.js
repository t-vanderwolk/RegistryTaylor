const db = require('../db/connection');

const mapAddOn = (record) => ({
  id: record.id,
  name: record.name,
  category: record.category,
  description: record.description,
  pricePilot: Number(record.price_pilot),
  priceFuture: Number(record.price_future),
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

exports.listAddOns = async (req, res, next) => {
  try {
    const categoryFilter = req.query.category;
    let query = db('add_ons').select('*').orderBy('name');
    if (categoryFilter) {
      query = query.where({ category: categoryFilter });
    }
    const records = await query;
    res.json({ data: records.map(mapAddOn) });
  } catch (error) {
    next(error);
  }
};

exports.getAddOnById = async (req, res, next) => {
  try {
    const record = await db('add_ons').where({ id: req.params.id }).first();
    if (!record) {
      return res.status(404).json({ error: { message: 'Add-on not found' } });
    }
    res.json({ data: mapAddOn(record) });
  } catch (error) {
    next(error);
  }
};

exports.createAddOn = async (req, res, next) => {
  try {
    const { name, category, description, pricePilot, priceFuture } = req.body;
    const inserted = await db('add_ons')
      .insert({
        name,
        category,
        description,
        price_pilot: pricePilot,
        price_future: priceFuture,
      })
      .returning('*');
    res.status(201).json({ data: mapAddOn(inserted[0]) });
  } catch (error) {
    next(error);
  }
};

exports.updateAddOn = async (req, res, next) => {
  try {
    const { name, category, description, pricePilot, priceFuture } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (category) updates.category = category;
    if (description) updates.description = description;
    if (pricePilot !== undefined) updates.price_pilot = pricePilot;
    if (priceFuture !== undefined) updates.price_future = priceFuture;

    const updated = await db('add_ons')
      .where({ id: req.params.id })
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');

    if (!updated.length) {
      return res.status(404).json({ error: { message: 'Add-on not found' } });
    }

    res.json({ data: mapAddOn(updated[0]) });
  } catch (error) {
    next(error);
  }
};

exports.archiveAddOn = async (req, res, next) => {
  try {
    const deleted = await db('add_ons').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Add-on not found' } });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
