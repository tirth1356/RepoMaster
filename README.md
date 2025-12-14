# GitHub Repository Evaluation Platform

A modern web application that analyzes public GitHub repositories and provides actionable insights to help students and early-career developers improve their projects.

**Try it live:** [https://repo-master-evaluator.vercel.app/](https://repo-master-evaluator.vercel.app/) <br>
**Watch Demo Video:** [https://www.youtube.com/watch?v=Tr8-tOHeJt4](https://www.youtube.com/watch?v=Tr8-tOHeJt4) on Youtube or uploaded in REPO

## 🎯 Purpose

This platform helps developers understand how their projects appear to recruiters and mentors by evaluating:

- **Documentation** – README clarity and completeness  
- **Code Structure** – Folder hierarchy and organization  
- **Commits** – Consistency and message quality  
- **Testing** – Test coverage and frameworks used  
- **Tech Stack** – Language choices and suitability  
- **Community** – Stars, forks, and engagement  
- **Versioning** – Releases and semantic versioning  

## ✨ Features

- **Landing Page**: Clean, minimal design with step-by-step explanation  
- **Analysis Page**: Enter a repository URL for instant evaluation  
- **Results Dashboard**:
  - Overall score (0-100) with qualitative level (Beginner / Intermediate / Advanced)  
  - Personalized summary highlighting strengths and weaknesses  
  - Actionable improvement roadmap  
  - Category-wise breakdown and repository metadata  

## 🧠 How It Works

1. **Data Collection**  
   The backend fetches public repository data from GitHub:
   - Repository contents, structure, and README  
   - Commit history and release information  
   - Programming languages and metadata  

2. **Scoring Algorithm**  
   Each aspect is evaluated and scored independently. Scores are combined into a weighted overall score.  

3. **Improvement Roadmap**  
   Weak areas are prioritized and actionable steps are generated to help the developer enhance their repository.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, Tailwind CSS, Axios, React Hooks  
- **Backend**: Node.js, Express.js, GitHub API  

## 🔒 Privacy & Security

- No database or user accounts  
- Only analyzes public repositories  
- No tracking or data collection  

## 🎓 Benefits for Students & Mentors

- Showcases professional development practices  
- Encourages clean documentation, consistent commits, and quality testing  
- Helps build a stronger, recruiter-friendly portfolio  

---

Built with ❤️ by Tirth1356
