import asyncHandler from 'express-async-handler';
import { PDFParse } from 'pdf-parse';
import { analyzeResume as analyzeResumeAI } from '../utils/aiService.js';
import User from '../models/userModel.js';

// @desc    Upload, parse, and analyze resume
// @route   POST /api/resume/analyze
// @access  Private
const handleAnalyzeResume = asyncHandler(async (req, res) => {
  // 1. Check if user has enough credits
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.credits <= 0) {
    res.status(403);
    throw new Error('Insufficient credits. Please purchase more to continue.');
  }

  // 2. Validate file upload
  if (!req.file) {
    res.status(400);
    throw new Error('Please upload a PDF file');
  }

  try {
    // 3. Parse PDF Text
    const parser = new PDFParse({ data: req.file.buffer });
    const pdfData = await parser.getText();
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      res.status(400);
      throw new Error('Could not extract text from the PDF. It might be scanned or empty.');
    }

    // 4. Send to AI Service for Analysis
    const analysisResult = await analyzeResumeAI(resumeText);

    // 5. Deduct 1 credit from user
    user.credits -= 1;
    await user.save();

    // 6. Return the analysis and updated credits
    res.status(200).json({
      success: true,
      analysis: analysisResult,
      creditsRemaining: user.credits,
    });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500);
    throw new Error(error.message || 'Failed to analyze resume');
  }
});

export { handleAnalyzeResume as analyzeResume };
