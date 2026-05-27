# 🎯 AI Resume Analyzer & Interview Coach

An AI-powered resume analysis platform that provides ATS scoring, improvement suggestions, skill gap analysis, and personalized interview questions.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## 🚀 Features

- 📄 **Resume Upload** — supports PDF and DOCX
- 🎯 **ATS Score** — instant scoring with detailed reasoning
- ✅ **Strengths Analysis** — what's working in your resume
- ⚡ **Improvement Suggestions** — specific actionable fixes
- 🔑 **Missing Keywords** — keywords to add for your target role
- 📊 **Skill Gap Analysis** — what skills to learn next
- 🎤 **Interview Questions** — role-specific questions with tips
- 📚 **History Tracking** — all past analyses saved

---

## 🏗️ Architecture

```
React Frontend (Port 5173)
        ↓ REST API
Spring Boot Backend (Port 8080)
        ↓ Internal HTTP
Python FastAPI AI Service (Port 8000)
        ↓ Groq LLM API
PostgreSQL Database (Port 5433)
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, Axios |
| Backend | Spring Boot 3.5, Spring Security, JWT |
| AI Service | Python, FastAPI, Groq (Llama 3.3 70B) |
| Database | PostgreSQL |
| Auth | JWT Tokens |

---

## ⚙️ Local Setup

### Prerequisites
- Java 17+
- Maven 3.9+
- Python 3.9+
- Node.js 18+
- PostgreSQL 17

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Setup AI Service
```bash
cd ai-service
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY to .env
uvicorn main:app --reload --port 8000
```

### 3. Setup Backend
```bash
cd backend
# Create PostgreSQL database named: resume_analyzer
mvn spring-boot:run
```

### 4. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Open the app
```
http://localhost:5173
```

---

## 📸 Screenshots

> Upload your resume → Get instant AI analysis

---

## 🔐 Environment Variables

### AI Service (`ai-service/.env`)
```
GROQ_API_KEY=your_groq_api_key
```

### Backend (`application.properties`)
```
DB_URL=jdbc:postgresql://localhost:5433/resume_analyzer
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=your_jwt_secret
```

---

## 👨‍💻 Author

**B Poorna Sai Reddy**
[GitHub](https://github.com/yourusername) • [LinkedIn](https://linkedin.com/in/yourprofile)

---

## ⚠️ Disclaimer

This tool is for educational and career development purposes only.
