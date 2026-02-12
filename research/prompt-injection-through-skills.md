# Prompt Injection Through Skills: Security Risk Assessment

> **Research Date:** February 2026
> **Status:** Initial Research
> **Focus:** Evaluating prompt injection via skills, tools, and plugins as a security risk for AI agents

---

## Executive Summary

Prompt injection through skills, tools, and plugins is the **#1 critical vulnerability** in AI agent systems according to OWASP's 2025 Top 10 for LLM Applications. Attack success rates range from 41–84% across major platforms, current defenses are bypassed at rates exceeding 78%, and real CVEs have enabled full system compromise via tool ecosystems. The problem is structural, growing with agent capability, and acknowledged by OpenAI as unlikely to ever be fully solved.

---

## 1. The Core Problem

When an AI agent processes external content — tool descriptions, skill metadata, fetched documents, repository files — it can misinterpret embedded malicious instructions as legitimate commands. Because skills and tools operate within the agent's trust boundary, a successful injection inherits whatever permissions the agent has: file access, code execution, network requests, or API calls.

The attack surface has expanded dramatically as agents gained access to tools, MCP servers, and skill ecosystems — each a potential vector for injecting malicious instructions.

---

## 2. Scale of the Problem

### 2.1 Prevalence

| Metric | Value | Source |
|---|---|---|
| Production AI deployments with prompt injection vulnerabilities | **73%** | [Obsidian Security](https://www.obsidiansecurity.com/blog/prompt-injection) |
| Organizations lacking dedicated prompt injection defenses | **65.3%** | [VentureBeat](https://venturebeat.com/security/openai-admits-that-prompt-injection-is-here-to-stay) |
| CVEs documented across major AI coding IDEs in 2025 | **30+** | [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1) |
| New attack attempts analyzed daily (Lakera Gandalf) | **100,000+** | [Lakera](https://www.lakera.ai/blog/the-year-of-the-agent-what-recent-attacks-revealed-in-q4-2025-and-what-it-means-for-2026) |
| Cumulative prompt injection attacks in Lakera dataset | **279,000** | [Lakera](https://www.lakera.ai/blog/the-year-of-the-agent-what-recent-attacks-revealed-in-q4-2025-and-what-it-means-for-2026) |

### 2.2 Attack Success Rates

The AIShellJack exploitation framework tested 314 unique payloads covering 70 MITRE ATT&CK techniques across agentic coding assistants:

| Attack Type | Success Rate |
|---|---|
| Data exfiltration | **84%** |
| Overall (auto-execution mode) | **66.9–84.1%** |
| Persistence mechanisms | **41%** |
| At least one platform compromised | **85%+** |
| Adaptive attacks bypassing published defenses | **90%+** |

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

### 2.3 Defense Bypass Rates

Current detection-based defenses are overwhelmed by adaptive attacks:

| Defense Tool | Reported Protection | Actual Bypass Rate (Adaptive) |
|---|---|---|
| Protect AI | <5% false positive | **93% bypassed** |
| PromptGuard | <3% false positive | **91% bypassed** |
| PIGuard | <5% false positive | **89% bypassed** |
| Model Armor | <10% false positive | **78% bypassed** |
| TaskTracker | <8% false positive | **85% bypassed** |

All evaluated defenses were bypassed at rates exceeding 78%.

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

### 2.4 Financial Impact

| Metric | Value | Source |
|---|---|---|
| Average savings from prevented AI data breaches | **$2.4M** | [Obsidian Security](https://www.obsidiansecurity.com/blog/prompt-injection) |
| Reduction in AI security incidents with comprehensive controls | **67%** | [Obsidian Security](https://www.obsidiansecurity.com/blog/prompt-injection) |
| Prompt injection defense market (2024) | **$1.14B** | [Dataintelo](https://dataintelo.com/report/prompt-injection-defense-market) |
| Projected defense market (2033) | **$10.47B** | [Dataintelo](https://dataintelo.com/report/prompt-injection-defense-market) |
| Defense market CAGR (2025–2033) | **28.7%** | [Dataintelo](https://dataintelo.com/report/prompt-injection-defense-market) |

---

## 3. Attack Vectors Through Skills & Tools

### 3.1 Tool Poisoning via MCP

Malicious instructions embedded in MCP tool *descriptions* manipulate the model into executing unintended calls. Since LLMs use tool metadata to decide which tools to invoke, compromised descriptions hijack the agent's decision-making before any user input is even processed.

MCP sampling relies on an implicit trust model and lacks robust, built-in security controls, enabling new attack vectors in agents that leverage MCP.

*Sources: [Palo Alto Unit 42](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/), [Snyk Labs](https://labs.snyk.io/resources/prompt-injection-mcp/), [Microsoft](https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp)*

### 3.2 Rules File Exploitation

Configuration files like `.cursorrules` and `.github/copilot-instructions.md` are processed as trusted instructions. Attackers plant injection payloads in repositories that coding agents parse automatically — a supply-chain attack requiring zero interaction from the victim.

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

### 3.3 Indirect Prompt Injection via External Content

Lakera's Q4 2025 analysis found that indirect attacks (through external content/tools) **succeed with fewer attempts** than direct prompt injections and are **less effectively filtered** — meaning skills and tools are a more efficient attack vector than direct user manipulation.

*Source: [Lakera Q4 2025 Report](https://www.lakera.ai/blog/the-year-of-the-agent-what-recent-attacks-revealed-in-q4-2025-and-what-it-means-for-2026)*

### 3.4 Trust Boundary Failures

**73%** of tested platforms fail to adequately enforce at least one critical trust boundary:

- User–Agent boundaries
- Agent–Tool boundaries
- Tool–Tool boundaries
- Session boundaries

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

---

## 4. Real-World Incidents

### 4.1 CVE-2025-53773 — GitHub Copilot Remote Code Execution

**CVSS 7.8 (HIGH)** — A prompt injection in GitHub Copilot enabled full remote code execution:

1. Attacker embeds payload in a GitHub issue or source comment
2. Copilot processes it and writes `"chat.tools.autoApprove": true` to VS Code settings
3. All subsequent tool calls execute without user confirmation
4. Copilot downloads malware, joins C2 servers — **full system compromise**

This was a **wormable** vulnerability affecting millions of developers before the August 2025 patch.

*Sources: [Embrace The Red](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/), [NVD](https://nvd.nist.gov/vuln/detail/CVE-2025-53773)*

### 4.2 Supabase/Cursor Agent Token Exfiltration

In mid-2025, Supabase's Cursor agent ran with privileged service-role access and processed support tickets containing user-supplied input. Attackers embedded SQL instructions that exfiltrated sensitive integration tokens into public support threads.

*Source: [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2405959525001997)*

---

## 5. Platform Vulnerability Comparison

| Platform | Risk Rating | Key Weakness |
|---|---|---|
| **Cursor** | Critical | Auto-approve, unsandboxed MCP, `.cursorrules` processed without validation |
| **GitHub Copilot** | High | CVE-2025-53773, cursory marketplace review |
| **Codex CLI** | Medium-High | Limited egress controls |
| **Gemini CLI** | Medium-High | Similar trust boundary issues |
| **Claude Code** | Low | Mandatory tool confirmation, sandboxed MCP, no auto-approve flag |

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

---

## 6. Implications

### 6.1 Structurally Unsolvable at the Model Layer

OpenAI has publicly stated: *"Prompt injection, much like scams and social engineering on the web, is unlikely to ever be fully 'solved.'"* This means every agent that uses skills or tools carries inherent, irreducible risk.

*Source: [TechCrunch](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/)*

### 6.2 Scales With Agent Capability

Every new skill, tool, or MCP server added to an agent increases the attack surface. The more capable the agent, the more damage a successful injection can cause. This creates a fundamental tension between agent utility and security.

### 6.3 Supply Chain Risk

Skills and plugins are often third-party. A single compromised tool description in a marketplace can propagate to every agent that installs it — a software supply-chain attack at the AI layer. Marketplace review processes remain cursory.

### 6.4 Enterprise Exposure

Nearly two-thirds of organizations deploying AI agents have no dedicated defenses. Less than 40% conduct regular security testing on AI models or agent workflows. The defense market's projected 10x growth ($1.14B to $10.47B) reflects the scale of unaddressed risk.

---

## 7. What Actually Works (So Far)

Detection-based defenses have proven insufficient. The most promising mitigations are **architectural**:

| Defense Approach | Effectiveness | Mechanism |
|---|---|---|
| **StruQ** (data-prompt separation) | Attack success **<2%** | Separates data from instructions structurally |
| **SecAlign** (preference optimization) | Reduces attacks **96% → 2%** | Trains model to reject injected instructions |
| **CaMeL** (provable security) | **77%** secure on AgentDojo | Formal verification of agent behavior |
| **Mandatory human-in-the-loop** | High (used by Claude Code) | Requires user confirmation for tool execution |

Additional architectural defenses showing promise:

- Cryptographic tool identity with immutable versioning
- Fine-grained capability scoping (least privilege)
- Multi-agent validation pipelines
- Sandboxed execution with strict egress controls
- End-to-end provenance tracking

*Source: [arxiv: 2601.17548](https://arxiv.org/html/2601.17548v1)*

---

## 8. Key Takeaways

1. **73% of AI deployments are vulnerable**, and 65% of organizations have no dedicated defenses.
2. **Attack success rates of 41–84%** across major coding assistant platforms, with defense bypass rates exceeding 78%.
3. **Skills and tools are a more efficient attack vector** than direct prompt injection — indirect attacks succeed with fewer attempts and are less effectively filtered.
4. **Real CVEs (e.g., CVE-2025-53773) have demonstrated full system compromise** via tool ecosystems, affecting millions of users.
5. **The problem is permanent** — acknowledged by OpenAI as unsolvable at the model layer.
6. **Only architectural defenses work reliably** — sandboxing, mandatory human approval, capability scoping, and structural data-instruction separation.

---

## Sources

- [OWASP Top 10 for LLMs 2025 — Prompt Injection](https://genai.owasp.org/llmrisk/llm01-prompt-injection/)
- [arxiv: Prompt Injection on Agentic Coding Assistants (2601.17548)](https://arxiv.org/html/2601.17548v1)
- [Obsidian Security — Prompt Injection: Most Common AI Exploit](https://www.obsidiansecurity.com/blog/prompt-injection)
- [Lakera — Q4 2025 Agent Attack Analysis](https://www.lakera.ai/blog/the-year-of-the-agent-what-recent-attacks-revealed-in-q4-2025-and-what-it-means-for-2026)
- [VentureBeat — OpenAI Admits Prompt Injection Is Here to Stay](https://venturebeat.com/security/openai-admits-that-prompt-injection-is-here-to-stay)
- [Palo Alto Unit 42 — MCP Attack Vectors](https://unit42.paloaltonetworks.com/model-context-protocol-attack-vectors/)
- [Snyk Labs — Prompt Injection Meets MCP](https://labs.snyk.io/resources/prompt-injection-mcp/)
- [Microsoft — Protecting Against Indirect Injection in MCP](https://developer.microsoft.com/blog/protecting-against-indirect-injection-attacks-mcp)
- [Embrace The Red — CVE-2025-53773](https://embracethered.com/blog/posts/2025/github-copilot-remote-code-execution-via-prompt-injection/)
- [NVD — CVE-2025-53773](https://nvd.nist.gov/vuln/detail/CVE-2025-53773)
- [ScienceDirect — From Prompt Injections to Protocol Exploits](https://www.sciencedirect.com/science/article/pii/S2405959525001997)
- [TechCrunch — OpenAI on AI Browser Vulnerability](https://techcrunch.com/2025/12/22/openai-says-ai-browsers-may-always-be-vulnerable-to-prompt-injection-attacks/)
- [Dataintelo — Prompt Injection Defense Market Report](https://dataintelo.com/report/prompt-injection-defense-market)
- [Practical DevSecOps — MCP Security Vulnerabilities 2026](https://www.practical-devsecops.com/mcp-security-vulnerabilities/)
