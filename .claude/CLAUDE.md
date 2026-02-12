# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skill Scanner (skillscanner.xyz) is a web app that scans AI agent skills for security threats — prompt injections, data exfiltration, malicious code, obfuscation, and more. Users upload a `.zip`/`.skill` file or paste a GitHub URL, and the app runs 5 security analyzers returning a trust label (Safe/Caution/Unsafe/Dangerous/Inconclusive) with detailed findings.

## Architecture

Three managed services, no self-hosted infrastructure:

- **Vercel** — Next.js 15 frontend (App Router, TypeScript, Tailwind CSS). Handles UI, API routes that proxy to the scanner backend, and Stripe webhooks.
- **Supabase** — Auth (email/password, Google OAuth, GitHub OAuth), PostgreSQL database (users, scans, findings, credits), and temporary file storage for uploads.
- **Railway** — Python scanner backend running [cisco-ai-defense/skill-scanner](https://github.com/cisco-ai-defense/skill-scanner). FastAPI REST API with 5 analyzers: Static, Behavioral, LLM, Meta, VirusTotal.

The frontend never calls the scanner directly from the browser. All scan requests go through Next.js API routes (`/api/scan/*`) which proxy to Railway.

## Key Documents

- `PRD.md` — Complete product requirements (architecture, user flows, features, DB schema, API routes, pricing, error states). This is the source of truth for all product decisions.
- `research/prompt-injection-through-skills.md` — Security threat landscape research backing the product.

## Database Schema

Four application tables in Supabase (defined in PRD section 9.3):
- `profiles` — User data, credit balance, free scan tracking
- `scans` — Scan results with trust labels, findings summary, full JSON results
- `scan_findings` — Individual findings per scan (severity, category, remediation, confidence)
- `credit_transactions` — Credit purchase and deduction ledger

## Scoring System

Trust labels are derived from backend severity findings:
- **Safe** (green) — no findings above INFO
- **Caution** (yellow) — MEDIUM findings, no HIGH/CRITICAL
- **Unsafe** (red) — 1+ HIGH or 1 CRITICAL
- **Dangerous** (dark red) — 2+ CRITICAL
- **Inconclusive** (gray) — low confidence / partial scan failure

## Business Logic

- Scan-first, gate results behind sign-up
- 1 free scan per rolling 30 days per account
- Prepaid credit packs via Stripe (1/$2, 5/$5, 25/$15, 100/$40), credits never expire
- Failed/invalid scans never consume credits
- Duplicate file hash triggers warning before re-scanning
- Uploaded files deleted immediately after scan; scan results stored indefinitely

## Backend (cisco-ai-defense/skill-scanner)

The Python backend is an open-source tool installed via `pip install cisco-ai-skill-scanner`. Key endpoints:
- `POST /scan-upload` — accepts ZIP file, returns scan results
- `GET /health` — health check with available analyzers
- `GET /analyzers` — list configured analyzers

We need to enhance it beyond the base to add: document scanning (PPTX/XLSX/DOCX macros via olevba), PDF scanning (embedded JS), image/SVG scanning, and Unicode smuggling detection. See PRD section 7.3.
