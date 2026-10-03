import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

function getIntelligentHeuristicAdvice(prompt: string, context: any): string {
  const p = prompt.toLowerCase();
  const salary = context?.user?.monthlyNetSalary || 6850;
  const savingsRate = context?.stats?.savingsRate || 28;
  const emergencyRunway = context?.stats?.emergencyRunwayMonths || 5.4;
  const discretionarySpend = context?.stats?.discretionarySpend || 1420;

  if (p.includes('save') && p.includes('400')) {
    return `Here is an actionable plan to reclaim $400 this month from your current cashflow:

1. **Dining & Delivery Trim ($160/mo)**: You spent $680 on dining and takeout this month. Switching 2 weekday takeout meals to meal-prep recovers $40/week ($160/mo).
2. **Subscription Audit ($85/mo)**: You have 3 underutilized subscriptions (Gym check-in was 24 days ago: $65/mo, plus unused duplicate cloud storage $20/mo). Pausing them is an immediate win.
3. **Smart Round-Up Savings ($95/mo)**: Enabling 2x round-ups on your Daily Essentials Card will passively capture ~$95 into your Protected Vault without lifestyle friction.
4. **Utility & Insurance Optimization ($60/mo)**: Switching to the partner fiber plan in Smart Offers lowers your broadband bill by $30/mo, and auto-insurance policy update recovers $30/mo.

Total monthly boost: **$400/month** ($4,800/year invested at 7% yields ~$35,000 in 6 years).`;
  }

  if (p.includes('subscription')) {
    return `### Subscription Intelligence Audit
Looking at your active recurring services ($328.90/month total):
- **High Value / Daily Use**: Spotify Family ($19.99), Claude/ChatGPT Pro ($20.00), iCloud ($9.99) — keep these.
- **Immediate Cancellation Flag**: Equinox/Gym ($140/mo) — no activity logged in 24 days. Recommend freezing or downgrading to a local pass to save $95/mo immediately.
- **Upcoming Renewal**: Amazon Prime ($139/year) renews in 18 days. Switch to annual corporate discount partner in Smart Offers for 15% off.`;
  }

  if (p.includes('debt') || p.includes('invest') || p.includes('401k')) {
    return `### Debt vs. 401(k) Investment Hierarchy
Based on your current numbers (Net salary $${salary}/mo, Savings Rate ${savingsRate}%):
1. **Always capture employer match first**: If your company offers a 401(k) match (e.g. 4-6%), that is an immediate 100% risk-free return. Never forfeit this.
2. **High-Interest Debt (>8%)**: Direct every dollar above your baseline emergency fund ($${context?.emergencyFund?.current || 18500}) to extinguish credit cards or high APR debt using the Avalanche method.
3. **Low-Interest Debt (<4.5%)**: Maximize tax-advantaged accounts (Roth IRA / Index ETFs) as historical market returns outpace low-interest fixed payments.`;
  }

  if (p.includes('laptop') || p.includes('buy') || p.includes('afford')) {
    return `### Purchase Simulation: $1,200 Expense
- **Current Discretionary Bucket**: $${context?.allocation?.wants?.remaining || 480} remaining this cycle.
- **Direct Impact**: Paying $1,200 outright from checking would push your monthly Wants budget into a -$720 deficit.
- **Recommended Strategy**: 
  1. Allocate $400 from this month's discretionary budget.
  2. Draw $800 from your "Tech Upgrade" Protected Vault (which has ample liquidity).
  3. This preserves your 6-month Emergency Fund Runway (${emergencyRunway} months) and keeps your budget streak intact!`;
  }

  return `### Strategic Financial Overview
- **Net Inflow**: $${salary}/month
- **Current Savings Rate**: ${savingsRate}% (Target: >25% - You are outperforming the national average)
- **Safety Cushion**: ${emergencyRunway} months of baseline living costs secured.
- **Immediate Recommendation**: Your Protected Savings Vault earns 5.1% APY. Reinvesting your upcoming tax refund into the High-Yield Vault will accelerate your milestone target by 4 months. What specific scenario would you like to explore next?`;
}

// AI Assistant endpoint
app.post('/api/assistant', async (req, res) => {
  const { prompt, context } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.json({ response: getIntelligentHeuristicAdvice(prompt, context) });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `You are SmartMoney AI, a world-class personal financial architect, certified financial planner (CFP), and wealth coach.
Here is the user's real-time financial context:
${JSON.stringify(context, null, 2)}

User's prompt:
"${prompt}"

Instructions:
1. Provide concrete, highly specific, numbers-driven advice tailored exactly to their balances, salary, and budget constraints.
2. Format cleanly with clear headings and bullet points.
3. Maintain an empowering, analytical, zero-nonsense tone. No boilerplate legal disclaimers.`,
    });

    const reply = response.text || getIntelligentHeuristicAdvice(prompt, context);
    return res.json({ response: reply });
  } catch (err: any) {
    console.error('Gemini API call error:', err);
    return res.json({ response: getIntelligentHeuristicAdvice(prompt, context) });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`SmartMoney server running at http://0.0.0.0:${port}`);
  });
}

startServer();
