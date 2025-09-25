const db = require('../db/connection');
const logger = require('../utils/logger');

const parseServices = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

const serializePackage = (record) => ({
  id: record.id,
  name: record.name,
  description: record.description,
  pricePilot: Number(record.price_pilot),
  priceFuture: Number(record.price_future),
  includedServices: parseServices(record.included_services),
  createdAt: record.created_at,
  updatedAt: record.updated_at,
});

exports.listPackages = async (req, res, next) => {
  try {
    const records = await db('membership_packages').select('*').orderBy('name');
    const data = records.map(serializePackage);
    res.json({ data });
  } catch (error) {
    next(error);
  }
};

exports.getPackageById = async (req, res, next) => {
  try {
    const record = await db('membership_packages').where({ id: req.params.id }).first();
    if (!record) {
      return res.status(404).json({ error: { message: 'Package not found' } });
    }
    res.json({ data: serializePackage(record) });
  } catch (error) {
    next(error);
  }
};

exports.createPackage = async (req, res, next) => {
  try {
    const { name, description, pricePilot, priceFuture, includedServices = [] } = req.body;
    const inserted = await db('membership_packages')
      .insert({
        name,
        description,
        price_pilot: pricePilot,
        price_future: priceFuture,
        included_services: JSON.stringify(includedServices),
      })
      .returning('*');
    const record = inserted[0];
    res.status(201).json({ data: serializePackage(record) });
  } catch (error) {
    next(error);
  }
};

exports.updatePackage = async (req, res, next) => {
  try {
    const { name, description, pricePilot, priceFuture, includedServices } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (description) updates.description = description;
    if (pricePilot !== undefined) updates.price_pilot = pricePilot;
    if (priceFuture !== undefined) updates.price_future = priceFuture;
    if (includedServices !== undefined) updates.included_services = JSON.stringify(includedServices);

    const updated = await db('membership_packages')
      .where({ id: req.params.id })
      .update({ ...updates, updated_at: db.fn.now() })
      .returning('*');

    if (!updated.length) {
      return res.status(404).json({ error: { message: 'Package not found' } });
    }

    res.json({ data: serializePackage(updated[0]) });
  } catch (error) {
    next(error);
  }
};

exports.archivePackage = async (req, res, next) => {
  try {
    const deleted = await db('membership_packages').where({ id: req.params.id }).del();
    if (!deleted) {
      return res.status(404).json({ error: { message: 'Package not found' } });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
