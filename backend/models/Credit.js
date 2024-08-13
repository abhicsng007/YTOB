import mongoose from "mongoose";


const creditSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  count: { type: Number, default: 3 }, // Start with 3 free credits
  totalCount: { type: Number, default: 3 },
  plan: { type: String, enum: ['Free', 'Neural', 'Synapse', 'Quantum'], default: 'Free' },
  subscriptionStatus: { type: String, enum: ['active', 'cancelled', 'expired'], default: 'active' },
  subscriptionEndDate: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('Credit', creditSchema);