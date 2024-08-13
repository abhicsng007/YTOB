import mongoose from "mongoose";
import Credit from "../models/Credit.js";

export const getCreditInfo = async (req, res) => {
  try {
    const userId = req.user.userId; // This comes from the authenticateToken middleware

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    let credit = await Credit.findOne({ user: userId });
    
    if (!credit) {
      // If no credit document exists, create one with free plan
      credit = new Credit({
        user: userId,
        count: 3,
        plan: 'Free',
        subscriptionStatus: 'active'
      });
      try {
        await credit.save();
      } catch (saveError) {
        console.error('Error saving new credit document:', saveError);
        return res.status(500).json({ message: 'Error creating credit information', error: saveError.message });
      }
    }
    
    res.json({
      creditCount: credit.count,
      totalCreditCount: credit.totalCount,
      plan: credit.plan,
      subscriptionStatus: credit.subscriptionStatus,
      subscriptionEndDate: credit.subscriptionEndDate,
      lastUpdated: credit.lastUpdated
    });
  } catch (error) {
    console.error('Error in getCreditInfo:', error);
    res.status(500).json({ message: 'Error fetching credit information', error: error.message });
  }
};

export const useCredits = async (userId, creditAmount) => {
  try {
    const credit = await Credit.findOne({ user: userId });

    if (!credit) {
      throw new Error('Credit information not found for this user');
    }

    if (credit.count === 0) {
      throw new Error(`Insufficient credits. Current: ${credit.count}, Requested: ${creditAmount}`);
    }

    credit.count -= creditAmount;
    credit.lastUpdated = new Date();

    await credit.save();

    return {
      message: 'Credits used successfully',
      deductedAmount: creditAmount,
      remainingCredits: credit.count
    };
  } catch (error) {
    console.error('Error in useCredits:', error);
    throw error;
  }
};