# 🎯 RIFT 2026 Submission Checklist: Autonomous DevOps Agent

This document tracks the strict requirements for the AI CI/CD Healing Core project.

## 1. Dashboard Requirements (React)
- [x] **Input Section**: URL, Team Name, Leader Name.
- [x] **Run Summary Card**: repo_url, names, branch, metrics, CI status badge.
- [x] **Score Breakdown Panel**: Base 100, Speed Bonus (+10), Efficiency Penalty (-2).
- [x] **Fixes Applied Table**: File | Bug Type | Line | Commit | Status.
- [x] **CI/CD Status Timeline**: Iteration dots, pass/fail status, iteration count (e.g., 3/5).
- [ ] **Public Deployment**: Need to deploy frontend (Vercel/Netlify) and backend (Railway/AWS).

## 2. Agent Backend Requirements (Python/LangGraph)
- [x] **GitHub Integration**: Clones and analyzes repository structure.
- [x] **Multi-Agent Architecture**: Implemented with LangGraph.
- [x] **Polyglot Testing**: Automatically discovers and runs tests (Python/Node.js/Java).
- [x] **Targeted Fixes**: Identifies failures and generates patches using LLM.
- [x] **Branch Naming**: Must enforce `TEAM_NAME_LEADER_NAME_AI_FIX` (strict uppercase).
- [x] **Commit Prefix**: Enforces `[AI-AGENT]` prefix.
- [x] **results.json**: Generates a strict contract file at the end of each run.
- [x] **Sandboxing**: Docker logic implemented for safe execution.
- [x] **Retry Logic**: Configurable limit (default: 5).

## 3. Mandatory Submission Components
- [ ] **Live URL**: Publicly accessible dashboard.
- [ ] **LinkedIn Video**: 2-3 min demo (Architecture + Workflow + Dashboard).
- [ ] **GitHub Repo**: Clean public repository.
- [ ] **README**: Architecture diagram, Installation, Setup, Tech Stack, Usage.

## 4. Specific Logic Verification
- [x] **Branch Naming Fix**: Code translates inputs to "TEAM_LEADER_AI_FIX" format correctly.
- [x] **Scoring Logic**: Implemented speed bonus (+10 if < 5 min) and commit penalty (-2 per commit > 20).
- [x] **Bug Type Matching**: Verified mapping for strictly matching RIFT categories.

---
*Created: 2026-02-20*
