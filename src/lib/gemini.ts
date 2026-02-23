import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;

const genAI = new GoogleGenerativeAI(apiKey);

export interface GeminiReceiptResult {
  vendor_name: string;
  receipt_no: string;
  receipt_time: string;
  subtotal: number;
  gst_hst: number;
  pst_qst: number;
  tax: number;
  total: number;
  payment: string;
  chart_of_acct: string;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeReceiptImage(
  file: File
): Promise<GeminiReceiptResult> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const base64Data = await fileToBase64(file);

  const prompt = `Analyze this receipt image and extract the following information. 
Return ONLY a valid JSON object with these exact fields (no markdown, no code fences):
{
  "vendor_name": "store/vendor name",
  "receipt_no": "receipt number or transaction number",
  "receipt_time": "ISO 8601 datetime string (e.g. 2026-02-15T14:30:00Z)",
  "subtotal": 0.00,
  "gst_hst": 0.00,
  "pst_qst": 0.00,
  "tax": 0.00,
  "total": 0.00,
  "payment": "payment method (Credit Card, Debit Card, Cash, etc.)",
  "chart_of_acct": "expense category (Office Supplies, Meals & Entertainment, Vehicle Expenses, etc.)"
}

Rules:
- All number fields must be numeric (not strings).
- "tax" should equal gst_hst + pst_qst.
- "total" should equal subtotal + tax.
- If a field cannot be determined, use empty string for text or 0 for numbers.
- For receipt_time, if only a date is visible, append T00:00:00Z.`;

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        mimeType: file.type || "image/jpeg",
        data: base64Data,
      },
    },
  ]);

  const text = result.response.text().trim();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Gemini did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]) as GeminiReceiptResult;
}
