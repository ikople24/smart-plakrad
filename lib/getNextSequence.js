import dbConnect from './dbConnect';
import mongoose from 'mongoose';

const DEFAULT_PREFIX = 'PKD-69';

export default async function getNextSequence(sequenceName, prefix = DEFAULT_PREFIX) {
  await dbConnect();
  const db = mongoose.connection.db;
  const counters = db.collection('counters');

  let result;
  try {
    result = await counters.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequence_value: 1 } },
      {
        upsert: true,
        returnDocument: 'after', // For MongoDB Node Driver v4+
      }
    );
  } catch (err) {
    console.error('⚠️ Mongo error during findOneAndUpdate:', err);
  }

  const doc = result?.value ?? result;
  const value = doc?.sequence_value;

  if (typeof value !== 'number') {
    const fallback = await counters.findOne({ _id: sequenceName });
    if (!fallback || typeof fallback.sequence_value !== 'number') {
      throw new Error('ไม่สามารถดึงเลขลำดับได้จาก fallback');
    }
    const fallbackNumber = fallback.sequence_value.toString().padStart(6, '0');
    return `${prefix}${fallbackNumber}`;
  }

  const number = value.toString().padStart(4, '0');
  return `${prefix}${number}`;
}