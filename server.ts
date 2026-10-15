import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  app.use(express.json());

  // API endpoint for AI financial & clinical analysis
  app.post('/api/ai-analysis', async (req, res) => {
    try {
      const { sessionsStats } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'مفتاح Gemini API غير متوفر في البيئة.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `أنت مستشار مالي وطبي محترف لمركز علاج طبيعي. قم بتحليل البيانات المالية وإحصائيات الحضور التالية وقدم تقريراً تحليلياً باللغة العربية احترافي ومنسق يحتوي على:
1. تقييم الأداء المالي العام ومعدلات التحصيل.
2. تحليل أكثر الإصابات/الحالات طلباً وإيراداً.
3. توصيات عملية لزيادة كفاءة المركز وتعظيم الإيرادات.
4. مقترحات لإدارة المواعيد والبنود الإضافية والخصومات.

بيانات الحالات والإحصائيات:
${JSON.stringify(sessionsStats, null, 2)}

يرجى تقديم التقرير بشكل نقاط واضحة وعناوين منسقة ومحترفة.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error('Gemini AI Error:', error);
      res.status(500).json({ error: error.message || 'حدث خطأ أثناء الاتصال بالذكاء الاصطناعي' });
    }
  });

  // Vite middleware for development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
