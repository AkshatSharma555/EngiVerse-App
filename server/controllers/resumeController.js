import Resume from "../models/resumeModel.js";
import imagekit from "../config/imagekit.js";
import ai from "../config/ai.js";
import fs from 'fs';

// --- HELPER: Get User ID Safely ---
// Yeh function check karega ki ID kahan chipi hai (body me, ya req.user me)
const getUserId = (req) => {
  if (req.body && req.body.userId) return req.body.userId;
  if (req.user && req.user.id) return req.user.id;
  if (req.user && req.user._id) return req.user._id;
  if (req.userId) return req.userId;
  return null;
};

// ---------------------------
// --- RESUME CRUD LOGIC ---
// ---------------------------

// 1. Create New Resume
export const createResume = async (req, res) => {
  try {
    const userId = getUserId(req); // <--- Updated
    const { title } = req.body; 

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated (ID missing)" });
    }

    const newResume = await Resume.create({ userId, title });

    return res.status(201).json({
      success: true,
      message: 'Resume created successfully',
      resume: newResume
    });

  } catch (error) {
    console.error("Create Error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Get Resume by ID
export const getResumeById = async (req, res) => {
  try {
    const userId = getUserId(req); // <--- Updated
    const { resumeId } = req.params;

    const resume = await Resume.findOne({ userId, _id: resumeId });

    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }

    return res.status(200).json({ success: true, resume });

  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// 3. Update Resume (With Image Upload)
export const updateResume = async (req, res) => {
  try {
    const userId = getUserId(req); // <--- Updated
    const { resumeId, resumeData, removeBackground } = req.body;
    const image = req.file;

    let resumeDataCopy;

    if (typeof resumeData === 'string') {
      resumeDataCopy = JSON.parse(resumeData);
    } else {
      resumeDataCopy = structuredClone(resumeData);
    }

    // Handle Image Upload
    if (image) {
      const imageBufferData = fs.createReadStream(image.path);

      const response = await imagekit.files.upload({
        file: imageBufferData,
        fileName: `resume-${Date.now()}.png`, 
        folder: 'engiverse_resumes',
        transformation: {
          pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground === 'yes' ? ',e-bgremove,f-png' : ''),
        },
      });

      if (!resumeDataCopy.personal_info) resumeDataCopy.personal_info = {};
      resumeDataCopy.personal_info.image = response.url;
    }

    const resume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      resumeDataCopy,
      { new: true }
    );

    return res.status(200).json({ success: true, message: 'Saved successfully', resume });

  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ---------------------------
// --- AI FEATURES LOGIC ---
// ---------------------------

export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;

    if (!userContent) {
      return res.status(400).json({ success: false, message: "Content is required." });
    }

    // ... (Your AI Prompt Logic Same as before) ...
    const preamble = `You are a Senior Resume Strategist. Rewrite into a High-Impact Executive Hook. Short, active voice, no quotes.`;

    const response = await ai.chat({
      model: "command-r-08-2024",
      message: `Refine this summary:\n\n"${userContent}"`,
      preamble: preamble,
      temperature: 0.5, 
    });

    // Helper to clean text inside this function or globally
    const cleanText = (text) => text?.replace(/^"|"$/g, "").trim();

    return res.status(200).json({ success: true, enhancedContent: cleanText(response.text) });
  } catch (error) {
    console.error("AI Error:", error);
    return res.status(500).json({ success: false, message: "AI service failed." });
  }
};

// --- NEW FUNCTION 1: Get All User Resumes (For List View) ---
export const getUserResumes = async (req, res) => {
  try {
    const userId = getUserId(req);
    const resumes = await Resume.find({ userId }).sort({ updatedAt: -1 }); // Latest first
    return res.status(200).json({ success: true, resumes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- NEW FUNCTION 2: Delete Resume ---
export const deleteResume = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeId } = req.params;
    await Resume.findOneAndDelete({ _id: resumeId, userId });
    return res.status(200).json({ success: true, message: "Resume deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- NEW FUNCTION 3: AI PDF Parser (Upload & Extract) ---
export const parseResumeFromPDF = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeText } = req.body; // Frontend will extract text from PDF and send here

    if (!resumeText) return res.status(400).json({ success: false, message: "No text provided" });

    // Tumhara original JSON Schema for AI
    const jsonSchema = `{
      "professional_summary": "string",
      "skills": ["string"],
      "personal_info": { "full_name": "string", "email": "string", "phone": "string", "linkedin": "string", "location": "string", "profession": "string" },
      "experience": [{ "company": "string", "position": "string", "start_date": "string", "end_date": "string", "description": "string", "is_current": boolean }],
      "education": [{ "institution": "string", "degree": "string", "field": "string", "graduation_date": "string", "gpa": "string" }],
      "project": [{ "name": "string", "type": "string", "description": "string" }]
    }`;

    const response = await ai.chat({
      model: "command-r-08-2024",
      message: `Extract data from this resume text:\n\n"${resumeText.slice(0, 30000)}"`,
      preamble: `You are a strict JSON Data Extraction API. Return ONLY valid JSON mapping to this schema: ${jsonSchema}. No markdown.`,
      temperature: 0, 
    });

    let extractedText = response.text.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
    let parsedData = JSON.parse(extractedText);

    // Create a new resume with this data
    const newResume = await Resume.create({
      userId,
      title: parsedData.personal_info?.full_name ? `${parsedData.personal_info.full_name}'s Uploaded Resume` : "Parsed Resume",
      ...parsedData,
    });

    return res.status(200).json({ success: true, resumeId: newResume._id });

  } catch (error) {
    console.error("Parser Error:", error);
    return res.status(500).json({ success: false, message: "AI parsing failed. " + error.message });
  }
};