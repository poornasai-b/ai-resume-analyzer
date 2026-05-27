from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from dotenv import load_dotenv
import pdfplumber
import docx
import tempfile
import os
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def extract_text_from_pdf(path: str) -> str:
    text = ""
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text


def extract_text_from_docx(path: str) -> str:
    doc = docx.Document(path)
    return "\n".join([para.text for para in doc.paragraphs])


def analyze_resume(resume_text: str, target_role: str) -> dict:
    prompt = f"""You are an expert ATS system and senior career coach with 15 years of experience.
Analyze this resume for a {target_role} position.

Return ONLY valid JSON — no explanation, no markdown, no backticks. Just raw JSON.

{{
  "ats_score": <integer 0-100>,
  "score_reasoning": "<2-3 sentences explaining the score>",
  "improvements": ["<specific actionable improvement>", ...],
  "missing_keywords": ["<keyword missing for {target_role}>", ...],
  "skill_gaps": ["<skill gap with brief explanation>", ...],
  "strengths": ["<genuine strength found in resume>", ...],
  "interview_questions": [
    {{
      "question": "<realistic interview question based on resume content>",
      "why_asked": "<why an interviewer would ask this>",
      "tip": "<how to answer it well>"
    }},
    ...
  ]
}}

Provide exactly: 5 improvements, 5 missing keywords, 3 skill gaps, 3 strengths, 5 interview questions.

Resume:
{resume_text}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    raw = response.choices[0].message.content.strip()

    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()

    return json.loads(raw)


@app.post("/analyze")
async def analyze(
    file: UploadFile = File(...),
    target_role: str = Form(default="Software Engineer")
):
    suffix = ".pdf" if file.content_type == "application/pdf" else ".docx"

    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        if suffix == ".pdf":
            text = extract_text_from_pdf(tmp_path)
        else:
            text = extract_text_from_docx(tmp_path)

        if not text.strip():
            return {"error": "Could not extract text from file"}

        result = analyze_resume(text, target_role)
        return {"success": True, "data": result}

    except json.JSONDecodeError:
        return {"error": "LLM returned invalid JSON, try again"}
    except Exception as e:
        return {"error": str(e)}
    finally:
        os.unlink(tmp_path)


@app.get("/health")
def health():
    return {"status": "ok"}