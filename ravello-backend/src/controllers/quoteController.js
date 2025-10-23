import Quote from "../models/quoteModel.js";

export const createQuote = async (req, res, next) => {
  try {
    const quote = new Quote(req.body);
    await quote.save();
    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

export const getQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    next(err);
  }
};

export const updateQuoteStatus = async (req, res, next) => {
  try {
    const quote = await Quote.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(quote);
  } catch (err) {
    next(err);
  }
};
