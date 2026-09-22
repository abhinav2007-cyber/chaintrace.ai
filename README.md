# ⚡ ChainTrace AI — Crypto Crime Investigation & Evidence Fusion
### *iQOO Hackathon 2026 Prototype Submission*

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black.svg?logo=next.js)](https://nextjs.org)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?logo=python)](https://python.org)
[![Demo Mode](https://img.shields.io/badge/Data-Synthetic%20%2F%20Demo-amber.svg)]()

> **"From fragmented victim reports to court-ready, evidence-backed crypto asset recovery."**

---

## 🎯 1. The Core Problem & Product Story

Law enforcement officers investigating modern cryptocurrency investment scams face a massive **evidence fragmentation bottleneck**:
1. Victims file complaints with fiat banking slips (UPI / IMPS receipts).
2. Scammers communicate over ephemeral messaging (WhatsApp / Telegram).
3. Funds are rapidly converted into cryptocurrency and dispersed across intermediate wallets and cross-chain bridges within minutes.
4. Traditional blockchain explorers only show on-chain transfers—ignoring off-chain communication records, bank UTRs, and fraud websites.
5. AI tools often fabricate real-world attribution, creating severe legal liabilities.

### **The ChainTrace AI Solution**
ChainTrace AI fuses **off-chain evidence** (complaint texts, bank statements, chat logs) with **on-chain blockchain ledgers** into a **unified forensic graph**, explaining *every* connection with rigorous mathematical signals and clear legal separation:
```text
FRAGMENTED EVIDENCE
       ↓
AI EXTRACTION (Phone, UPI, Wallets, Hashes)
       ↓
EVIDENCE FUSION (Section 65B SHA-256 Seals)
       ↓
UNIFIED GRAPH & TIMELINE (Bank Payment ↔ Crypto Hop)
       ↓
EXPLAINABLE CORRELATION (Amount similarity 99.4%, Δ 7m 29s)
       ↓
VASP CANDIDATE ATTRIBUTION (Candidate: 92% • Prototype Heuristic)
       ↓
ACTIONABLE INVESTIGATION GAPS (Click to search repository)
       ↓
AI COPILOT & SAHYOG-READY VASP REQUEST PACKET
```

---

## ⚖️ 2. Responsible AI & Legal Rigor (Zero False Accusations)

In compliance with hackathon guidelines and Indian criminal justice procedures:
- **No Fabricated Real-World Data**: All blockchain addresses, phone numbers, websites, and transaction amounts in the demo are **100% SYNTHETIC DEMO DATA**.
- **Candidate Attribution**: Attributions are strictly displayed as `"VASP-X — Candidate Attribution: 92% (DEMO / SYNTHETIC INTELLIGENCE)"`.
- **Explainable "Why?" Panels**: Every correlation and attribution contains an interactive explanatory reasoning breakdown showing:
  - *Supporting Signals* (Deposit cluster, proximity, timing)
  - *Anchor Evidence* (File IDs and SHA-256 hashes)
  - *Model Confidence Bar*
  - *Critical Legal Limitations*
- **Epistemic Honesty (Fact vs Inference vs Unknown)**:
  - `FACT`: Verified by cryptographic hash or bank UTR ledger.
  - `INFERENCE`: Probabilistic temporal/amount correlation deduced by AI.
  - `UNKNOWN`: Critical missing evidence flagged as an actionable gap.

---

## 📱 3. Mobile & Desktop Responsive Design (iQOO Handheld Experience)

ChainTrace AI features a responsive UI designed for investigating officers on the field using their **iQOO smartphone**:
- **Mobile Header**: Compact header with hamburger drawer and instant `✦ ASK CHAINTRACE` floating trigger.
- **Mobile Bottom Navigation**: Direct access to the 4 investigation stages (`Evidence → Analysis → Findings → Actions`).
- **Touch-Friendly Graph & Bottom Sheets**: Tap any wallet or evidence node on mobile to open full slide-in investigation drawers.

---

## 🚀 4. Quickstart Guide (Running Locally)

### **Prerequisites**
- Python 3.10+
- Node.js 18+ and npm

### **Backend Setup (FastAPI)**
```bash
cd backend

# 1. Create and activate virtual environment (optional)
python -m venv venv
# Windows:
.\venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. (Optional) Set your Gemini API key in .env for live AI extraction
# If not provided, built-in deterministic heuristic fallback activates automatically!
cp .env.example .env

# 4. Start the backend server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
The FastAPI backend will run on `http://localhost:8000` (Swagger docs at `http://localhost:8000/docs`).

### **Frontend Setup (Next.js 14)**
```bash
cd frontend

# 1. Dependencies are already installed in package.json
npm install

# 2. Start dev server
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🎬 5. The 2-Minute Judge Walkthrough

1. **Dashboard**: Click the green **"LOAD DEMO CASE (CYBER-2026-0847)"** button. The complete pre-built synthetic investigation loads in one click.
2. **Case Overview**: See the executive story: ₹2,50,000 UPI transfer correlated with 1.84 ETH crypto movement within 7m 29s.
3. **01 Evidence**: Inspect `complaint.txt`, `bank_statement.csv`, `chat.txt`, and `wallet.txt`. Click any item to inspect its SHA-256 cryptographic seal.
4. **02 Analysis (Centerpiece)**:
   - **Graph**: Trace Victim → UPI ₹2,50,000 → Wallet A → Wallet B → Bridge Contract → Wallet C → VASP-X. Notice the off-chain chat and phone nodes connected to Wallet A!
   - Click **Wallet C** or **VASP-X** → Click **`[ Why this connection? ]`** to see explainable AI signals and confidence score.
   - **Timeline**: View chronological milestones with `FACT` vs `INFERENCE` badges.
   - **Correlations**: Inspect the Bank ↔ Crypto temporal link card with 99.4% amount match.
   - **Campaign**: Observe cross-case shared infrastructure between Case 0847, 0789, and 0801.
5. **03 Findings**: Review behavioral indicators (Rapid movement, cross-chain bridge) and click an **Actionable Gap** → click **`[ SEARCH CASE EVIDENCE ]`** to see real-time corroboration.
6. **04 Actions**:
   - Click **`[ Prepare Packet ]`** to generate the Sahyog-ready VASP Information Request Packet.
   - Click **`[ Generate Report ]`** to view or export the Section 65B Indian Evidence Act compliant report.
7. **✦ ASK CHAINTRACE**: Click the floating button in the top bar to ask the AI Copilot questions about evidence, facts, and inferences at any time.

---

## 👥 Built with pride for iQOO Hackathon 2026
Forensic evidence fusion and crypto asset tracing prototype.
