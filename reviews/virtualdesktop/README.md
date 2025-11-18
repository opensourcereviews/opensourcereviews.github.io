# Best Virtual Desktop Providers Curated by Github Users

Open Source and Always a Work in Progress (WIP)

<!-- navigation -->
[Abstract](#abstract) [Methodology](#methodology) [Comparison](#virtual-desktop-comparison-2025) [Analysis](#detailed-provider-analysis) [Conclusion](#conclusion)

---

## Abstract

<!-- annotation: Simply the facts. -->

This assessment ranks **virtual desktop providers ([DaaS](https://en.wikipedia.org/wiki/Desktop_as_a_service)/[VDI](https://en.wikipedia.org/wiki/Desktop_virtualization))** by **privacy**, not by convenience or cost.

We evaluate two privacy dimensions. First, **workload privacy**, which includes hypervisor isolation, [confidential computing](https://en.wikipedia.org/wiki/Confidential_computing) ([TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)-based CPU/RAM encryption), and zero-local-storage / pixel streaming architectures. Second, **account + identity privacy**, which includes [KYC](https://en.wikipedia.org/wiki/Know_your_customer) requirements, metadata collection, and crypto payment options.

Only providers operating for **≥ 5 years** are included to avoid unstable newcomers.

---

## Methodology

### Evaluation Criteria

Our evaluation considers:

1. **Confidential Computing / Data-in-Use Protection**: [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html), [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html)/[SGX](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html), [AWS Nitro](https://aws.amazon.com/ec2/nitro/), [Firecracker](https://firecracker-microvm.github.io/) isolation, encrypted RAM

2. **Zero Local Storage Architecture**: Desktop fully cloud-hosted; no data ever present on endpoint machines

3. **Signup & KYC / Identity Requirements**: Enterprise identity & billing vs consumer SaaS vs anonymous

4. **Crypto Payments**: [BTC](https://bitcoin.org/)/[XMR](https://www.getmonero.org/) accepted or not

5. **Metadata Collection & Logging**: Platform telemetry, monitoring, device tracking

6. **Jurisdiction & Longevity**: Country laws + minimum 5 years operation

<!-- callout: Evaluation framework for privacy assessment. -->

---

## Virtual Desktop Comparison (2025)

| Rank | Provider | Confidential Computing | Zero Local Storage | Crypto Payments | Low KYC | Minimal Metadata | 5+ Years |
|------|----------|------------------------|--------------------|--------------------|---------|------------------|----------|
| 1 | ![Azure Virtual Desktop](images/azure-vd.png) [Azure Virtual Desktop](https://azure.microsoft.com/en-us/products/virtual-desktop/) | ✓ Yes (SEV-SNP/TDX) | ✓ Yes | ✗ No | ✗ No | ✗ No (enterprise logs) | ✓ Yes |
| 2 | ![AWS WorkSpaces](images/aws-workspaces.png) [AWS WorkSpaces](https://aws.amazon.com/workspaces/) | ✓ Yes (Nitro) | ✓ Yes | ✗ No | ✗ No | ✗ No (enterprise logs) | ✓ Yes |
| 3 | ![Citrix DaaS](images/citrix-daas.png) [Citrix DaaS](https://www.citrix.com/products/citrix-daas/) | ✓ Yes (inherits cloud) | ✓ Yes | ✗ No | ✗ No | ✗ No (high telemetry) | ✓ Yes |
| 4 | ![VMware Horizon Cloud](images/vmware-horizon.png) [VMware Horizon Cloud](https://www.omnissa.com/products/horizon-cloud) | ✓ Yes (if configured) | ✓ Yes | ✗ No | ✗ No | ✗ No (enterprise logs) | ✓ Yes |
| 5 | ![Shells.com](images/shells.png) [Shells.com](https://www.shells.com/) | ✗ No | ✓ Yes | ✓ Yes (BitPay) | ✓ Yes | ✓ Yes (minimal SaaS) | ✓ Yes (since 2020) |
| 6 | ![V2 Cloud](images/v2cloud.png) [V2 Cloud](https://v2cloud.com/) | ✗ No | ✓ Yes | ✗ No | ✗ No | ✗ No (SaaS logs) | ✓ Yes |
| 7 | ![Paperspace](images/paperspace.png) [Paperspace Desktops](https://www.paperspace.com/) | ✗ No | ✓ Yes | ✗ No | ✗ No | ✗ No (SaaS logs) | ✓ Yes |
| 8 | ![Shadow PC](images/shadowpc.png) [Shadow PC](https://shadow.tech/) | ✗ No | ✓ Yes | ✗ No | ✗ No | ✗ No (high telemetry) | ✓ Yes |

---

## Detailed Provider Analysis

### 1. Azure Virtual Desktop

![Azure Virtual Desktop](images/azure-vd.png)

* **Infrastructure / privacy model:** Runs desktops inside [Azure Confidential VMs](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-vm-overview) with [AMD SEV-SNP](https://www.amd.com/en/developer/sev.html) or [Intel TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html). Memory, CPU state, and VM internals encrypted & integrity-protected. Endpoint devices receive only a pixel stream.

* **Verification / audits (confidential computing):** Public, extensively documented CC stack. Hardware-backed attestation via [vTPM](https://learn.microsoft.com/en-us/azure/virtual-machines/trusted-launch) + Azure CC APIs.

* **Org / jurisdiction:** [Microsoft](https://www.microsoft.com/) (USA)

* **Signup & KYC:** ✗ No. Full identity, corporate billing, compliance data required.

* **Payments:** ✗ No crypto. Standard enterprise billing only.

* **What's logged (by policy):** Extensive usage, device, session logs; unavoidable in enterprise cloud

* **Operational history:** Azure since 2010; AVD since 2019

---

### 2. AWS WorkSpaces

![AWS WorkSpaces](images/aws-workspaces.png)

* **Infrastructure / privacy model:** Runs desktops on [AWS Nitro](https://aws.amazon.com/ec2/nitro/) infrastructure where operator access to RAM is cryptographically blocked. [Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/) optionally isolate highly sensitive workloads. Zero-local model: client sees only a video stream.

* **Verification / audits:** Nitro has strong published guarantees and [architecture papers](https://aws.amazon.com/ec2/nitro/)

* **Org / jurisdiction:** [Amazon](https://www.amazon.com/) (USA)

* **Signup & KYC:** ✗ No. Full AWS identity + billing required.

* **Payments:** ✗ No crypto. Credit card / invoice only.

* **What's logged:** [CloudTrail](https://aws.amazon.com/cloudtrail/), IAM activity, session logs

* **Operational history:** WorkSpaces since 2014

---

### 3. Citrix DaaS

![Citrix DaaS](images/citrix-daas.png)

* **Infrastructure / privacy model:** Citrix front-end on top of [AWS](https://aws.amazon.com/)/[Azure](https://azure.microsoft.com/)/[GCP](https://cloud.google.com/) hypervisors. Privacy depends on whichever cloud you choose (can be Confidential VMs).

* **Verification / audits:** Security papers available; inherits hyperscaler proof

* **Org / jurisdiction:** [Citrix](https://www.citrix.com/) / [Cloud Software Group](https://www.cloud.com/) (USA)

* **Signup & KYC:** ✗ No. Full enterprise identity required.

* **Payments:** ✗ No crypto. Enterprise contracts only.

* **What's logged:** Extensive telemetry: admin logins, device IDs, [SIEM](https://en.wikipedia.org/wiki/Security_information_and_event_management) data, org metadata

* **Operational history:** Citrix VDI lineage since 1990s; DaaS for many years

---

### 4. VMware Horizon Cloud

![VMware Horizon Cloud](images/vmware-horizon.png)

* **Infrastructure / privacy model:** VDI orchestrator on [VMware](https://www.vmware.com/), [AWS](https://aws.amazon.com/), or [Azure](https://azure.microsoft.com/) infrastructures. Can run desktops in Confidential VM hosts if configured.

* **Verification / audits:** VMware security architecture docs; inherits underlying cloud TEEs

* **Org / jurisdiction:** [Omnissa](https://www.omnissa.com/) (formerly VMware EUC)

* **Signup & KYC:** ✗ No. Standard enterprise sign-up required.

* **Payments:** ✗ No crypto. Subscription only.

* **What's logged:** Enterprise logging comparable to Citrix

* **Operational history:** Horizon for over a decade; Horizon Cloud stable

---

### 5. Shells.com

![Shells.com](images/shells.png)

* **Infrastructure / privacy model:** Full Linux/Windows desktops hosted in Shells' datacenters. Entire desktop runs server-side; endpoint gets only the streamed display. Multi-OS, multi-device: browsers, consoles, mobile, smart TVs.

* **Verification / audits (confidential computing):** No [TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)/SEV/TDX/SGX claiming. Uses standard hypervisor isolation + encrypted [TLS](https://en.wikipedia.org/wiki/Transport_Layer_Security) transport.

* **Org / jurisdiction:** Shells, Inc. (USA-based but globally distributed cloud)

* **Signup & KYC:** ✓ Yes. Standard SaaS sign-up (email + billing). No identity verification / ID upload.

* **Payments:** ✓ Yes crypto. Accepts cryptocurrency via [BitPay](https://bitpay.com/) ([BTC](https://bitcoin.org/) + some altcoins). Major credit cards also accepted.

* **What's logged (by policy):** Normal SaaS telemetry: account metadata, IP, usage logs. Desktop data remains server-side; no local storage leaks.

* **Operational history:** Founded in 2020; commercial service widely available by 2021. Featured in [TechRadar](https://www.techradar.com/), [NotebookCheck](https://www.notebookcheck.net/), and educational orgs.

* **Summary:** Most privacy-friendly consumer-grade virtual desktop. Strong endpoint privacy (zero local data) + crypto payments. Not as secure as TEEs from Azure/AWS but far better account privacy.

---

### 6. V2 Cloud

![V2 Cloud](images/v2cloud.png)

* **Infrastructure / privacy model:** Windows-only cloud desktops; zero local data by design

* **Verification / audits:** No confidential computing; relies on hypervisor + TLS

* **Org / jurisdiction:** Canada, founded ~2012

* **Signup & KYC:** ✗ No. Full SaaS identity & billing required.

* **Payments:** ✗ No crypto. Credit cards only.

* **What's logged:** Standard SaaS logs

* **Operational history:** >10 years

---

### 7. Paperspace Desktops

![Paperspace](images/paperspace.png)

* **Infrastructure / privacy model:** Windows/Linux cloud desktops; no local storage; GPU options

* **Verification / audits:** No TEEs; encrypted channels, standard VM isolation

* **Org / jurisdiction:** USA; acquired by [DigitalOcean](https://www.digitalocean.com/)

* **Signup & KYC:** ✗ No. SaaS identity and billing required.

* **Payments:** ✗ No crypto. Card + DO billing only.

* **What's logged:** SaaS usage metadata

* **Operational history:** Since ~2014

---

### 8. Shadow PC

![Shadow PC](images/shadowpc.png)

* **Infrastructure / privacy model:** Full Windows PC in the cloud; consumer-targeted

* **Verification / audits:** No TEEs; standard VM setup

* **Org / jurisdiction:** EU + USA data centers

* **Signup & KYC:** ✗ No. Regular consumer account with billing data required.

* **Payments:** ✗ No crypto.

* **What's logged:** High consumer telemetry. ToS restrictions on uses (e.g., mining).

* **Operational history:** Since mid-2010s

---

## Conclusion

The assessment of virtual desktop providers reveals distinct privacy characteristics across workload isolation and account anonymity dimensions. [Azure Virtual Desktop](https://azure.microsoft.com/en-us/products/virtual-desktop/) and [AWS WorkSpaces](https://aws.amazon.com/workspaces/) demonstrate superior workload privacy through [Confidential Computing](https://en.wikipedia.org/wiki/Confidential_computing) implementations ([SEV-SNP](https://www.amd.com/en/developer/sev.html), [TDX](https://www.intel.com/content/www/us/en/developer/tools/trust-domain-extensions/overview.html), [Nitro](https://aws.amazon.com/ec2/nitro/)) that cryptographically prevent cloud operators from accessing VM memory and CPU state during execution.

Enterprise VDI deployments benefit from [Citrix DaaS](https://www.citrix.com/products/citrix-daas/) and [VMware Horizon Cloud](https://www.omnissa.com/products/horizon-cloud) when paired with Azure or AWS confidential VMs, combining mature management capabilities with hardware-based isolation. These platforms provide robust security for organizations requiring integration with existing identity and compliance frameworks.

[Shells.com](https://www.shells.com/) emerges as the optimal choice for consumer privacy and account anonymity, offering zero-local-storage desktops with cryptocurrency payments via [BitPay](https://bitpay.com/), minimal [KYC](https://en.wikipedia.org/wiki/Know_your_customer) requirements, and reduced telemetry compared to Shadow, V2 Cloud, and Paperspace. While lacking [TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment)-based encryption, it provides superior account-level privacy protections.

[V2 Cloud](https://v2cloud.com/) and [Paperspace](https://www.paperspace.com/) serve small and medium business deployments with solid endpoint privacy through zero-local architectures, though without confidential computing protections.

The optimal selection depends on threat model priorities. Organizations concerned with cloud operator access to running workloads should prioritize Azure or AWS for their memory-safe [TEE](https://en.wikipedia.org/wiki/Trusted_execution_environment) implementations. Users prioritizing account identity privacy over workload isolation should select Shells.com for its cryptocurrency payment support and minimal [KYC](https://en.wikipedia.org/wiki/Know_your_customer) requirements. [Shadow PC](https://shadow.tech/) exhibits the weakest privacy profile in this assessment due to extensive consumer telemetry collection, absence of TEE protections, and restrictive terms of service.

---

## Footer

A public service by the users of GitHub.