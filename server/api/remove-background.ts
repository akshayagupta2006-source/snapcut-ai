import { VercelRequest, VercelResponse } from '@vercel/node';
import axios from 'axios';
import FormData from 'form-data';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const apiKey = process.env.REMOVE_BG_API_KEY;
    
    if (!apiKey) {
      console.error('REMOVE_BG_API_KEY not configured');
      return res.status(500).json({ 
        error: 'Background removal API key not configured. Please set REMOVE_BG_API_KEY environment variable.' 
      });
    }

    // Get image from request body (base64)
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Handle base64 encoded image
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const imageBuffer = Buffer.from(base64Data, 'base64');

    // Call remove.bg API
    const formData = new FormData();
    formData.append('image_file', imageBuffer, { filename: 'image.png' });

    console.log('Calling remove.bg API...');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'X-Api-Key': apiKey,
        },
        responseType: 'arraybuffer',
      }
    );

    // Convert response to base64
    const resultBase64 = Buffer.from(response.data).toString('base64');
    const imageUrl = `data:image/png;base64,${resultBase64}`;

    console.log('Background removed successfully');

    res.json({ 
      success: true, 
      url: imageUrl 
    });
  } catch (error: any) {
    console.error('Background removal error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your REMOVE_BG_API_KEY.' 
      });
    }
    
    if (error.response?.status === 402) {
      return res.status(402).json({ 
        error: 'API credits exhausted. Please upgrade your remove.bg plan.' 
      });
    }

    res.status(500).json({ 
      error: 'Failed to remove background', 
      details: error.response?.data ? error.response.data.toString() : error.message 
    });
  }
}