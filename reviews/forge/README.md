# Best Code Forges & Git Hosting Platforms Curated by GitHub Users

Open Source and Always a Work in Progress (WIP)

## Abstract

<!-- annotation: Simply the facts. -->

This assessment ranks **software forges** (platforms for hosting Git repositories) based on verifiable technical criteria rather than popularity. Forges are evaluated by **self-hostability**, **open-source transparency**, **independent audits**, **metadata exposure**, **federation support**, **jurisdiction risk**, and **operational maturity**.

## Methodology

### Evaluation Criteria

1. **Self-Hosting Capability**: Full user control over metadata and logs
2. **Code Transparency**: Fully open-source or open-core
3. **Independent Audit**: SOC2/ISO or third-party security reviews
4. **Federation / Decentralization**: ForgeFed/ActivityPub support
5. **Metadata Exposure**: IP logging, analytics, telemetry
6. **Business Model**: Incentives aligned with privacy
7. **Jurisdiction Risk**: Surveillance environment of hosting
8. **Operational Maturity**: Reliability, CI/CD security, governance
9. **Reproducibility**: Ability to verify build artifacts

<!-- callout: Ignore the marketing. Read the facts. -->

## Forge Comparison (2025)

| Rank | Forge | Open Source | Independent Audit | Federation | Self-Host | Metadata Privacy | Jurisdiction Risk |
|------|-------|-------------|-------------------|------------|-----------|------------------|-------------------|
| 1 | ![Forgejo](images/forgejo.png) [Forgejo](https://forgejo.org/) | ✓ Yes | ✗ No | ✗ No (ForgeFed implementation in progress) | ✓ Yes | ✓ Yes (self-controlled) | ? Depends |
| 2 | ![Gitea](images/gitea.png) [Gitea](https://gitea.io/) | ✓ Yes | ✗ No | ✗ No (experimental) | ✓ Yes | ✓ Yes | ? Depends |
| 3 | ![GitLab CE](images/gitlab.png) [GitLab CE](https://about.gitlab.com/install/) | ✓ Yes (open-core) | ✓ Yes (SOC2/ISO) | ✗ No | ✓ Yes | ✓ Yes (partial) | ? Depends |
| 4 | ![Codeberg](images/codeberg.png) [Codeberg](https://codeberg.org/) | ✓ Yes (Forgejo-based) | ✗ No | ✗ No (planned via ForgeFed/Forgejo) | ✗ No (hosted service) | ✓ Yes | ✓ Yes (Germany/EU) |
| 5 | ![GitHub](images/github.png) [GitHub](https://github.com/) | ✗ No | ✓ Yes (SOC2/ISO) | ✗ No | ✗ No (Enterprise Server is closed-source) | ✗ No | ✗ No (US, extensive telemetry) |
| 6 | ![SourceHut](images/sourcehut.png) [SourceHut](https://sourcehut.org/) | ✓ Yes | ✗ No | ✗ No (in development) | ✓ Yes | ✓ Yes | ✗ No (US, no audits) |
| 7 | ![Bitbucket](images/bitbucket.png) [Bitbucket](https://bitbucket.org/) | ✗ No | ✓ Yes (Atlassian SOC2) | ✗ No | ✓ Yes (Data Center/self-managed) | ✗ No | ✗ No (heavy metadata) |
| 8 | ![Azure DevOps](images/azuredevops.png) [Azure DevOps](https://azure.microsoft.com/en-us/products/devops) | ✗ No | ✓ Yes (enterprise SOC2/ISO via Azure) | ✗ No | ✓ Yes (Azure DevOps Server on-prem) | ✗ No | ✗ No (US cloud, extensive telemetry) |

---

## Critical Understanding: Architectural vs Policy-Based Privacy

**Architectural privacy** means privacy by design. These are systems where metadata exposure is technically impossible (self-hosted forges).

**Policy-based privacy** relies on trusting service providers to honor their promises. Even with audits, closed-source platforms require trust rather than verification.

- **Self-hosted open-source forges** (Forgejo, Gitea, GitLab CE) enable complete verification and control
- **Audited closed-source platforms** (GitHub, Bitbucket, Azure DevOps, AWS CodeCommit) provide compliance but require trust
- **Non-audited open-source** (SourceHut) offers transparency but lacks hardened security validation through external certifications
- **Location matters**: Self-hosting jurisdiction determines risk; EU > UK > US for privacy

The ideal forge combines open-source code, independent audits, self-hosting capability, federation support, and strong operational maturity. Currently, **GitLab CE** comes closest for enterprises, while **Forgejo** leads for community-driven privacy.

---

## Detailed Service Analysis

### 1. Forgejo

![Forgejo](images/forgejo.png)

* **Code transparency:** [Fully open-source](https://codeberg.org/forgejo/forgejo)
* **Verification:** Community-led, no formal audits
* **Org transparency:** [Nonprofit governance](https://forgejo.org/faq/)
* **Privacy architecture:** No telemetry by default, self-controlled metadata when self-hosted
* **Federation:** ForgeFed/ActivityPub implementation in progress; experimental federation support under active development
* **Self-hosting:** Full control over data and logs
* **Jurisdiction:** Depends on self-hosting location
* **Operational history:** ~3 years (forked from Gitea in 2022)

---

### 2. Gitea

![Gitea](images/gitea.png)

* **Code transparency:** [Fully open-source](https://github.com/go-gitea/gitea)
* **Verification:** No formal audits
* **Org transparency:** [Community-led with company sponsorship](https://gitea.io/en-us/)
* **Privacy architecture:** Minimal telemetry, self-controlled when self-hosted
* **Federation:** Experimental ForgeFed/ActivityPub work, not generally available yet
* **Self-hosting:** Easy deployment, full control
* **Jurisdiction:** Depends on self-hosting location
* **Operational history:** ~9 years

---

### 3. GitLab CE (Self-Hosted)

![GitLab CE](images/gitlab.png)

* **Code transparency:** [Open-core model](https://about.gitlab.com/install/) (CE is open-source under MIT)
* **Verification:** [SOC2 Type 2, ISO 27001/27017/27018 certified for GitLab’s hosted offerings](https://about.gitlab.com/security/)
* **Org transparency:** [Public company](https://about.gitlab.com/)
* **Privacy architecture:** Configurable telemetry (Usage Ping, etc.) when self-hosted; can be restricted or disabled
* **Federation:** No ForgeFed/ActivityPub federation support today
* **Self-hosting:** Enterprise-grade with strong CI/CD security model
* **Jurisdiction:** Depends on self-hosting location
* **Operational history:** ~14 years

---

### 4. Codeberg

![Codeberg](images/codeberg.png)

* **Code transparency:** [Forgejo-based, fully open-source](https://codeberg.org/)
* **Verification:** No formal SOC2/ISO audits
* **Org transparency:** [German nonprofit](https://docs.codeberg.org/getting-started/what-is-codeberg/)
* **Privacy architecture:** [Minimum-collection policy, short-lived logs, privacy-focused terms](https://codeberg.org/codeberg/org/src/branch/main/PrivacyPolicy.md)
* **Federation:** ForgeFed/ActivityPub support planned via Forgejo’s implementation; not generally available on Codeberg.org yet
* **Self-hosting:** Codeberg.org itself is a hosted service; you can self-host the underlying Forgejo software instead
* **Jurisdiction:** Germany/EU (strong privacy laws)
* **Operational history:** ~6 years of public operation (launched in 2019)

---

### 5. GitHub

![GitHub](images/github.png)

* **Code transparency:** Closed-source server infrastructure
* **Verification:** [SOC2 reports and ISO 27001-based certifications for GitHub’s cloud offerings](https://docs.github.com/enterprise-cloud@latest/organizations/keeping-your-organization-secure/managing-security-settings-for-your-organization/accessing-compliance-reports-for-your-organization)
* **Org transparency:** [Microsoft subsidiary](https://github.com/about)
* **Privacy architecture:** Extensive telemetry, cookies, and behavioral tracking across core product, Codespaces, and Copilot
* **Federation:** No ForgeFed/ActivityPub federation support
* **Self-hosting:** GitHub Enterprise Server available as an on-prem virtual appliance (closed-source)
* **Jurisdiction:** US jurisdiction, subject to US surveillance laws and data access requests
* **Operational history:** ~17 years (service launched 2008)

---

### 6. SourceHut

![SourceHut](images/sourcehut.png)

* **Code transparency:** [Fully open-source platform](https://sourcehut.org/)
* **Verification:** No public SOC2/ISO audits or similar certifications
* **Org transparency:** [Small independent team and LLC](https://sourcehut.org/)
* **Privacy architecture:** No tracking or advertising; minimal logging; strong anti-scraping stance
* **Federation:** Email-based workflows today; ActivityPub/ForgeFed-style federation under discussion/development
* **Self-hosting:** Possible but more complex; SourceHut is 100% open source and can be self-hosted with sufficient Ops effort
* **Jurisdiction:** US jurisdiction without formal compliance programs
* **Operational history:** Public alpha since 2018 (~7+ years of public operation)

---

### 7. Bitbucket

![Bitbucket](images/bitbucket.png)

* **Code transparency:** Closed-source (both Cloud and Data Center)
* **Verification:** [Atlassian cloud services have SOC2 reports and other attestations](https://www.atlassian.com/trust/compliance)
* **Org transparency:** [Atlassian product](https://www.atlassian.com/)
* **Privacy architecture:** Heavy metadata collection and analytics across Atlassian cloud stack
* **Federation:** No ForgeFed/ActivityPub federation support
* **Self-hosting:** Bitbucket Data Center is a self-managed/on-prem product (closed-source)
* **Jurisdiction:** Subject to Australian and US laws, plus regional data center regimes for cloud
* **Operational history:** ~17 years (founded 2008)

---

### 8. Azure DevOps / AWS CodeCommit

![Azure DevOps](images/azuredevops.png)

* **Code transparency:** Closed-source platforms
* **Verification:** Covered by [Microsoft Azure and AWS SOC2/ISO certifications](https://learn.microsoft.com/en-us/azure/compliance/offerings/offering-iso-27001) and corresponding SOC reports
* **Org transparency:** [Microsoft/Amazon cloud services](https://azure.microsoft.com/)
* **Privacy architecture:** Deep enterprise telemetry, logging, and monitoring by default
* **Federation:** No ForgeFed/ActivityPub federation support
* **Self-hosting:** Azure DevOps Server available for on-prem deployments (closed-source); AWS CodeCommit is fully managed only (no self-hosted version)
* **Jurisdiction:** Primarily US cloud providers with global regions; subject to US cloud compliance and data-access regimes
* **Operational history:** Each has over a decade of operation (Azure DevOps lineage via TFS; AWS CodeCommit GA since 2015)

---

## Conclusion

Forgejo and Gitea represent the gold standard for forge privacy through architectural control. Their fully open-source codebases, self-hosting capability, and minimal default telemetry make metadata exposure controllable by the operator rather than a remote SaaS vendor. Forgejo’s ongoing ForgeFed implementation work positions it as the most privacy-forward option for those who value future federation and decentralization, even though cross-instance federation is still emerging rather than fully mature.

GitLab CE stands out as the best enterprise-grade option, combining open-source transparency with SOC2/ISO certification on the vendor side and mature CI/CD security. For organizations requiring compliance frameworks and operational maturity, GitLab CE provides the most balanced mix of auditability and self-hosting control.

Codeberg offers the strongest hosted alternative for users who cannot self-host but want an open, nonprofit-backed platform. As a German nonprofit operating under EU privacy laws and running Forgejo, it provides transparent governance and a privacy-first stance, while leaving room to adopt ForgeFed-based federation once Forgejo’s implementation stabilizes.

GitHub requires trusting a proprietary system despite its SOC2/ISO certifications. While these attestations provide compliance confidence, users cannot verify claims about telemetry, logging, or data handling. Its closed-source nature and extensive metadata collection place it below self-hostable alternatives, though its operational maturity and audit history still provide more assurance than unaudited platforms.

SourceHut provides open-source transparency and avoids tracking and advertising, making it attractive for users who prioritize simplicity and minimal data collection. However, the absence of third-party audits, a relatively small team, and a more complex self-hosting story mean buyers must weigh transparency against formal assurance.

Bitbucket and Azure DevOps (plus AWS CodeCommit) represent the most corporate-heavy tier, combining closed-source codebases with substantial monitoring and analytics. While they maintain enterprise compliance certifications, their proprietary nature prevents independent verification of privacy claims, and their business models align more with enterprise telemetry and integration than with user privacy.

The ideal forge strategy prioritizes self-hosted open-source solutions (Forgejo, Gitea, GitLab CE) when possible, or privacy-focused hosted options (Codeberg, SourceHut) when self-hosting is impractical. Only self-hosted forges provide verifiable control over source code privacy and metadata; audits on proprietary SaaS platforms supplement that with formal assurance but cannot replace the benefits of architectural transparency.

<!-- navigation -->
[Abstract](#abstract) [Methodology](#methodology) [Comparison](#forge-comparison-2025) [Understanding](#critical-understanding-architectural-vs-policy-based-privacy) [Details](#detailed-service-analysis) [Conclusion](#conclusion)

## Footer

A public service by the users of GitHub.
