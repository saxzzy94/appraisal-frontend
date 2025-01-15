import { PropertyAnalysis } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function analyzeProperty(url: string): Promise<PropertyAnalysis> {
  try {
    const response = await fetch(`${API_BASE_URL}/v1/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new APIError(
        response.status,
        errorData.message || 'Failed to analyze property'
      );
    }

    const data = await response.json() as PropertyAnalysis;
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(500, 'Failed to connect to the analysis service');
  }
}

export async function downloadReport(filename: string): Promise<Blob> {
  const response = await fetch(`${API_BASE_URL}/v1/reports/${filename}`);
  
  if (!response.ok) {
    throw new APIError(
      response.status,
      'Failed to download report'
    );
  }
  
  return response.blob();
}
