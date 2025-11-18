# Best Private Email Providers Curated by Github Users

Open Source and Always a Work in Progress (WIP)

## Abstract

<!-- annotation: Simply the facts. -->

This technical assessment provides an evidence-based analysis of private email providers. In contrast to commercial review sites, this framework prioritizes architectural privacy via zero-access encryption, public source code availability, independent security audits, and operational trustworthiness.

## Methodology

### Evaluation Criteria

Our evaluation considers:

1. **Code Transparency**: Public availability of source code
2. **Independent Verification**: Third party security audits
3. **Architectural Verifiability**: Zero-access encryption vs trust-based policies
4. **Organizational Transparency**: Public disclosure of ownership and jurisdiction
5. **Privacy Architecture**: Technical implementation of encryption and metadata handling
6. **Operational Trust**: Historical behavior when faced with legal requests and organizational affiliations

<!-- callout: Ignore the marketing. Read the facts. -->

## Email Provider Comparison

| Rank | Provider | Source Available | Proof | Anonymous Signup | Zero-Access | E2EE | Minimal Metadata |
|------|----------|------------------|-------|------------------|-------------|------|------------------|
| 1 | ![Self-Hosted](images/self-hosted.png) Self-Hosted Email | ✓ Yes | ✓ Yes | ✓ Yes | ✓ Yes | ✓ Yes | ✓ Yes |
| 2 | ![Tutanota](images/tutanota.png) [Tutanota](https://tuta.com/) | [✓ Yes](https://github.com/tutao/tutanota) | [✓ Yes](https://tuta.com/security) | ✓ Yes | ✗ No (claimed) | ✓ Yes | ✓ Yes |
| 3 | ![Proton Mail](images/protonmail.png) [Proton Mail](https://proton.me/mail) | [Partial](https://github.com/ProtonMail) | [✓ Yes](https://proton.me/blog/soc-2) | ✓ Yes | ✗ No (claimed) | ✓ Yes | ✓ Yes |
| 4 | ![AtomicMail](images/atomicmail.png) [AtomicMail](https://atomicmail.io/) | ✗ No | ✗ No | ✓ Yes | ✗ No (claimed) | ✓ Yes | ✓ Yes |
| 5 | ![Mailbox.org](images/mailbox.png) [Mailbox.org](https://mailbox.org/) | [Partial](https://mailbox.org/en/services#mail) | ✗ No | ✗ No | ✗ No | ✗ No (PGP) | ✓ Yes |
| 6 | ![Posteo](images/posteo.png) [Posteo](https://posteo.de/) | [Partial](https://posteo.de/en/site/about_posteo#opensource) | ✗ No | ✓ Yes | ✗ No | ✗ No (PGP) | ✓ Yes |
| 7 | ![Kolab Now](images/kolabnow.png) [Kolab Now](https://kolabnow.com/) | [✓ Yes](https://git.kolab.org/source/kolab/) | ✗ No | ✗ No | ✗ No | ✗ No (PGP) | ✓ Yes |
| 8 | ![Gmail](images/gmail.png) [Gmail](https://gmail.com/) | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No |
| 9 | ![Fastmail](images/fastmail.png) [Fastmail](https://www.fastmail.com/) | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No |
| 10 | ![HEY](images/hey.png) [HEY](https://hey.com/) | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No |

## Critical Understanding: Architectural vs Policy Based Privacy

### Class 1: Architectural Privacy (True Zero-Access)

Only **self-hosted email** provides **verifiable zero-access** where you control the entire stack.

- **Self-Hosted Email**: Complete control over encryption, logs, and infrastructure. You audit your own servers and can cryptographically verify no backdoors exist. Only truly verifiable solution.

### Class 2: Claimed Zero-Access (Requires Trust)

These providers **claim zero-access architecture** but require trusting that the client code served to you hasn't been compromised before encryption occurs. Historical actions under legal pressure should factor into trust assessments.

- **Tutanota**: Claims end-to-end encryption for mail, contacts, and calendars. Entire client stack is open-source. Custom E2EE system. German jurisdiction. Requires trust in code delivery and execution environment.
- **Proton Mail**: Claims zero-access mailbox with client-side encryption. Partially open-source clients and documented cryptographic architecture. Swiss jurisdiction. In 2021, logged and provided IP address of climate activist to authorities after legal order, leading to arrest. Initially marketed as not logging IPs. Received WEF Technology Pioneer award in 2022. Requires trust that served code matches published code.
- **AtomicMail**: Claims zero-access architecture with AES-256 and ECIES. Newer provider with less public verification. Code not fully open. Higher trust requirement than Tuta/Proton.

### Class 3: Privacy-Aware Traditional Hosts (PGP Required)

These providers **can read your email by default**, but support strong encryption when you configure PGP/S-MIME.

- **Mailbox.org**: Strong PGP support and privacy policies. Without PGP, mail stored decrypted on servers. German jurisdiction with good privacy practices.
- **Posteo**: Anonymous signup supported. PGP/S-MIME support. IP addresses stripped where possible. No custom domains by design. German jurisdiction with strong privacy laws.
- **Kolab Now**: Built on open-source groupware stack. Supports PGP. Swiss jurisdiction. Not zero-access without user-managed encryption.

### Class 4: Mainstream Email (Not Private)

These services **provide minimal privacy** and should not be used for private communications.

- **Gmail**: Can read all email content. Enterprise CSE available but only for specific Workspace editions. Headers and metadata remain visible. High metadata collection.
- **Fastmail**: Excellent IMAP/SMTP host with great UX. No zero-access design. Servers see message content. Australian jurisdiction.
- **HEY**: Opinionated UX focused on workflow. No E2EE or zero-access architecture. Normal server-side content access.

## Detailed Provider Analysis

### 1. Self-Hosted Email

![Self-Hosted Email](images/self-hosted.png)

* **Code transparency:** Fully open source (Mailcow, Mail-in-a-Box, Postfix/Dovecot)
* **Verification:** You audit yourself
* **Org transparency:** You are the organization
* **Privacy architecture:** Complete control over encryption, logs, storage, and jurisdiction
* **Signup & payment:** Not applicable
* **What's logged (by policy):** Your choice
* **Can provider read email:** No (if you implement E2EE)
* **Operational history:** Various open-source projects with 10+ years
* **Trust considerations:** Complete control means complete responsibility

---

### 2. Tutanota

![Tutanota](images/tutanota.png)

* **Code transparency:** [Fully published](https://github.com/tutao/tutanota)
* **Verification:** [Public audits and research papers](https://tuta.com/security)
* **Org transparency:** [Fully disclosed](https://tuta.com/team)
* **Privacy architecture:** End-to-end encryption for mail, contacts, calendars; custom E2EE system
* **Signup & payment:** No email required; accepts conventional payment methods (card, bank transfer, PayPal). Bitcoin can be used indirectly via gift cards or donations, but is not supported for direct subscription billing as of 2025.
* **What's logged (by policy):** Minimal metadata
* **Can provider read email:** No (claimed)
* **Operational history:** ~10 years, German jurisdiction
* **Trust considerations:** Fully open-source codebase; no major controversies; German privacy laws

---

### 3. Proton Mail

![Proton Mail](images/protonmail.png)

* **Code transparency:** [Open-source clients](https://github.com/ProtonMail); server-side code closed-source
* **Verification:** [Public audits and cryptographic reviews](https://proton.me/security/audits)
* **Org transparency:** [Fully disclosed](https://proton.me/about)
* **Privacy architecture:** Zero-access mailbox with client-side encryption; encrypted search indexes
* **Signup & payment:** No email required; accepts conventional payment methods (card, bank transfer, PayPal). Bitcoin can be used indirectly via gift cards or donations, but is not supported for direct subscription billing as of 2025.
* **What's logged (by policy):** Metadata; can log IP addresses under legal order
* **Can provider read email:** No (claimed)
* **Operational history:** ~10 years, Swiss jurisdiction
* **Trust considerations:** 2021 climate activist IP logging case; initially claimed no IP logging; WEF Technology Pioneer 2022; partially open source

---

### 4. AtomicMail

![AtomicMail](images/atomicmail.png)

* **Code transparency:** Closed-source platform (no public source code yet); public security whitepaper available
* **Verification:** Claims of audits; limited public reports
* **Org transparency:** [Disclosed](https://atomicmail.io/)
* **Privacy architecture:** Claimed AES-256 and ECIES with zero-access architecture
* **Signup & payment:** No email or phone required; current service tier is free (no payment required).
* **What's logged (by policy):** Minimal metadata (claimed)
* **Can provider read email:** No (claimed)
* **Operational history:** New provider (less than 5 years)
* **Trust considerations:** Limited track record; less code transparency

---

### 5. Mailbox.org

![Mailbox.org](images/mailbox.png)

* **Code transparency:** Uses open-source stack and components
* **Verification:** Good privacy policies; limited formal audits
* **Org transparency:** [Fully disclosed](https://mailbox.org/en/company)
* **Privacy architecture:** Strong PGP support; server-side storage without PGP
* **Signup & payment:** Email required; accepts various payment methods
* **What's logged (by policy):** Low metadata
* **Can provider read email:** Yes (without PGP)
* **Operational history:** ~10 years, German jurisdiction
* **Trust considerations:** Traditional provider with good reputation; requires user PGP setup

---

### 6. Posteo

![Posteo](images/posteo.png)

* **Code transparency:** Uses open-source tools
* **Verification:** Good policies; limited formal audits
* **Org transparency:** [Fully disclosed](https://posteo.de/en/site/about_posteo)
* **Privacy architecture:** PGP/S-MIME support; IP stripping where possible
* **Signup & payment:** Anonymous signup supported; accepts bank transfer, card, PayPal, and cash by mail. Does not accept Bitcoin or other cryptocurrencies.
* **What's logged (by policy):** Low metadata
* **Can provider read email:** Yes (without PGP)
* **Operational history:** ~12 years, German jurisdiction
* **Trust considerations:** Strong privacy stance; no custom domains; good for anonymity

---

### 7. Kolab Now

![Kolab Now](images/kolabnow.png)

* **Code transparency:** Built on open-source Kolab stack
* **Verification:** Limited published audits
* **Org transparency:** [Disclosed](https://kolabnow.com/company)
* **Privacy architecture:** PGP support; groupware suite
* **Signup & payment:** Email required; accepts card, etc.
* **What's logged (by policy):** Low metadata
* **Can provider read email:** Yes (without PGP)
* **Operational history:** ~10 years, Swiss jurisdiction
* **Trust considerations:** Open-source foundation; groupware features

---

### 8. Gmail

![Gmail](images/gmail.png)

* **Code transparency:** Proprietary
* **Verification:** Independent security and compliance audits (for Google Workspace, e.g., ISO 27001 and SOC 2) but no zero-access / end-to-end encryption privacy audit because Gmail can access message content
* **Org transparency:** [Google/Alphabet](https://about.google/)
* **Privacy architecture:** Client-Side Encryption available for enterprise only; headers visible
* **Signup & payment:** Email/phone required; free with ads or paid Workspace
* **What's logged (by policy):** High metadata; content scanned for features
* **Can provider read email:** Yes (consumer), Partially (enterprise CSE)
* **Operational history:** ~20 years
* **Trust considerations:** Surveillance capitalism business model; extensive data collection

---

### 9. Fastmail

![Fastmail](images/fastmail.png)

* **Code transparency:** Some components open; mostly proprietary
* **Verification:** Independent security and compliance audits (for Google Workspace, e.g., ISO 27001 and SOC 2) but no zero-access / end-to-end encryption privacy audit because Gmail can access message content
* **Org transparency:** [Fully disclosed](https://www.fastmail.com/about/)
* **Privacy architecture:** No E2EE; excellent IMAP/SMTP implementation
* **Signup & payment:** Email required; accepts card
* **What's logged (by policy):** Normal email provider logs
* **Can provider read email:** Yes
* **Operational history:** ~20 years, Australian jurisdiction
* **Trust considerations:** Reliable service; no E2EE; Five Eyes jurisdiction

---

### 10. HEY

![HEY](images/hey.png)

* **Code transparency:** Proprietary
* **Verification:** No privacy audits
* **Org transparency:** [Basecamp/37signals](https://37signals.com/)
* **Privacy architecture:** No E2EE; opinionated workflow features
* **Signup & payment:** Email required; paid subscription
* **What's logged (by policy):** Normal email provider logs
* **Can provider read email:** Yes
* **Operational history:** ~5 years
* **Trust considerations:** Focus on UX over privacy; no encryption

## Conclusion

Self-hosting with E2EE is the only truly verifiable zero-access email solution where you control keys, servers, and logs without requiring trust in any third party. 

Tutanota offers a fully open-source implementation with end-to-end encryption and no major trust controversies. Its complete code transparency and clean operational history make it the strongest hosted E2EE option.

Proton Mail provides strong technical architecture with partial open-source code and security audits. However, the 2021 case of logging and providing a climate activist's IP address to authorities (after initially marketing that IPs weren't logged), combined with WEF affiliations, raises trust considerations. Users with heightened threat models should use Tor access.

AtomicMail shows promise with similar E2EE claims but requires more independent verification and trust due to less code transparency and limited operational history.

Traditional providers like Mailbox.org, Posteo, and Kolab Now offer good privacy practices when combined with user-managed PGP encryption. They are honest about their limitations and don't claim zero-access.

Mainstream services like Gmail, Fastmail, and HEY should not be considered private email providers as they can read message contents by design.

<!-- navigation -->
[Abstract](#abstract) [Methodology](#methodology) [Comparison](#email-provider-comparison) [Categories](#critical-understanding-architectural-vs-policy-based-privacy) [Details](#detailed-provider-analysis) [Conclusion](#conclusion)

## Footer

A public service by the users of Github.
