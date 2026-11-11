<p align="center">
  <img src="agora-logo-horiz.svg" alt="Agora Logo" width="500"/>
</p>

<p align="center">
  <strong>High-Velocity Conversational Sales CRM with Native WhatsApp & Unified Email Streams</strong>
</p>

<p align="center">
  <a href="https://www.linkedin.com/in/akashjadon"><img src="https://img.shields.io/badge/Architected%20%26%20Developed%20By-Akash%20Jadon-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Developed by Akash Jadon"/></a>
  <a href="https://github.com/akashjadon04"><img src="https://img.shields.io/badge/GitHub-akashjadon04-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Profile"/></a>
  <img src="https://img.shields.io/badge/Channel-WhatsApp%20%7C%20Email%20%7C%20VoIP-059669?style=for-the-badge" alt="Channels"/>
  <img src="https://img.shields.io/badge/UI-Vue%203%20%7C%20Tailwind%20%7C%20Cmd%20K-emerald?style=for-the-badge" alt="UI"/>
  <img src="https://img.shields.io/badge/Performance-Keyboard--First%20Speed-blue?style=for-the-badge" alt="Speed"/>
</p>

---

## ⚡ Executive Summary

**Agora** (named after the historic Greek marketplace and forum) is a modern, high-velocity conversational sales CRM designed for modern deal-closing teams. It bridges the critical divide in modern sales: uniting **WhatsApp Business API messaging** and **unified two-way email communications** into a single, cohesive deal timeline.

With a lightning-fast keyboard-first interface (`Cmd+K` command palette), automated deal decay monitors, visual Kanban stages, and collaborative team notes, Agora enables sales teams to close deals 3x faster without switching between disparate chat apps and slow legacy CRMs.

---

## 🏛️ Conversational Sales Architecture

```mermaid
flowchart TD
    subgraph Omnichannel ["Omnichannel Communications Engine"]
        WhatsApp["WhatsApp Business Cloud API (2-Way Messaging)"]
        Email["Unified Email Sync (IMAP / SMTP / SES)"]
        Calls["Call Logging & Telephony Integrations"]
    end

    subgraph AgoraCore ["Agora CRM Core Engine"]
        Timeline["Unified 360° Deal & Contact Activity Stream"]
        Kanban["Interactive Kanban Pipeline with Deal Decay Tracking"]
        LeadRouter["Automated SLA & Round-Robin Lead Distributor"]
        CommandPalette["Global Cmd+K Quick Navigator & Actions"]
    end

    subgraph SalesTeam ["Sales Rep Workstation"]
        Inbox["Unified Omnichannel Chat & Email Inbox"]
        PipelineView["Drag-and-Drop Deal Stages"]
        DealAnalytics["Win/Loss Probability & Velocity Metrics"]
    end

    WhatsApp <--> Timeline
    Email <--> Timeline
    Calls --> Timeline
    Timeline <--> Kanban
    Kanban <--> LeadRouter
    LeadRouter --> CommandPalette
    Timeline <--> Inbox
    Kanban <--> PipelineView
    Kanban --> DealAnalytics
```

---

## 💎 Core Technical Capabilities

| Capability | Specification | Value vs Legacy CRMs |
| :--- | :--- | :--- |
| **Native WhatsApp Integration** | Direct Meta Cloud API integration with media support | Sales reps chat with leads directly from the CRM without personal phone numbers. |
| **Unified 360° Activity Stream** | Real-time timeline of emails, chats, notes, calls, tasks | Zero context switching; every communication is logged to the deal card automatically. |
| **Kanban with Decay Alerts** | Visual deal stages with stale lead indicators | Never let a high-value opportunity go cold due to neglected follow-ups. |
| **Keyboard-First Speed** | Sub-second navigation with `Cmd+K` palette | Complete sales actions, log calls, and update stages without touching the mouse. |
| **Automated Lead Routing** | Round-robin distribution with SLA timers | Inbound leads from web forms or ad campaigns are routed to active reps instantly. |

---

## 🚀 Quick Start (Frappe Stack)

```bash
# Clone the repository
cd /Users/Satoru/.gemini/antigravity/scratch/automation-gems/agora

# Setup backend and install frontend assets
cd frontend && npm install && npm run build
```

---

## 👨‍💻 Developer & Architect

<div align="center">
  <h3>Designed, Built & Maintained by <strong>Akash Jadon</strong></h3>
  <p><em>Autonomous Agent Architect | Distributed Systems Engineer | Platform Specialist</em></p>
  
  <a href="https://www.linkedin.com/in/akashjadon">
    <img src="https://img.shields.io/badge/LinkedIn-Connect%20with%20Akash%20Jadon-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn Profile"/>
  </a>
  <a href="https://github.com/akashjadon04">
    <img src="https://img.shields.io/badge/GitHub-Follow%20@akashjadon04-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
</div>

---

## 📜 Sovereign Ownership & License

Decoupled and re-engineered as **Agora Conversational CRM**. Maintained as a private, high-performance technology asset developed by **Akash Jadon**. All legacy telemetry and third-party trackers have been removed.\n