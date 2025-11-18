# Best SaaS Ingress Services Curated by Github Users

Open Source and Always a Work in Progress (WIP)

## Abstract

<!-- annotation: Privacy first, features second. -->

This assessment ranks hosted ingress and tunneling services used by self-hosters to expose private or local services to the public internet, evaluated strictly through a privacy and verifiability lens. Instead of comparing features, this framework ranks them by where traffic is decrypted (if ever), whether payloads can be inspected or replayed, what metadata is logged, how transparent and self-hostable the architecture is, and how much trust is required of the provider. The most private SaaS ingress provider is the one that does the least: a WireGuard pipe. Everything below that introduces more metadata, more moving parts, and more trust.

## Methodology

### Evaluation Criteria

<!-- callout: Architectural privacy beats policy promises. -->

Our evaluation considers:

1. **TLS and Traffic Decryption** - Does the provider terminate TLS? Can they inspect HTTP payloads? Is encryption end-to-end between client and your origin?

2. **Metadata and Logging** - Does the service log IP addresses, hostnames, paths, TLS handshakes, or request bodies? Can logging be disabled?

3. **Architecture Transparency** - Are clients or agents open source? Is there a clear security or trust center? Are there audits or documents of what is stored?

4. **Ingress Model** - WireGuard pipe versus zero-trust overlay versus shared edge reverse-proxy architecture.

5. **Threat Model Suitability** - Suitable for sensitive production traffic? Development and testing only? Identity-linked or anonymous use?

---

## SaaS Ingress Service Comparison

### Ordered by privacy strength (strongest to weakest)

| Rank | Service | Open Source | Provider Cannot Decrypt | No Payload Inspection | Minimal Metadata | Self-Hostable | Independent Audit |
|------|---------|-------------|------------------------|----------------------|------------------|---------------|-------------------|
| **1** | ![IPv6.rs](images/ipv6rs.png) [IPv6.rs](https://ipv6.rs/) | ✗ No (WG config) | ✓ Yes | ✓ Yes | ✓ Yes | ✗ No | ✗ No |
| **2** | ![Tailscale](images/tailscale.png) [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) | [✓ Yes](https://github.com/tailscale/tailscale) | ✓ Yes | ✓ Yes | ✗ No | ✗ No | [✓ Yes](https://tailscale.com/security) |
| **3** | ![zrok](images/zrok.png) [zrok](https://zrok.io/) | [✓ Yes](https://github.com/openziti/zrok) | ✗ No* | ✗ No* | ✗ No | ✓ Yes | ✗ No |
| **4** | ![Cloudflare](images/cloudflare.png) [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) | [✓ Yes](https://github.com/cloudflare/cloudflared) (client) | ✗ No | ✗ No | ✗ No | ✗ No | [✓ Yes](https://www.cloudflare.com/trust-hub/compliance-resources/) (SOC2) |
| **5** | ![LocalXpose](images/localxpose.png) [LocalXpose](https://localxpose.io/) | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No | ✗ No |
| **6** | ![ngrok](images/ngrok.png) [ngrok](https://ngrok.com/) | [✓ Yes](https://github.com/ngrok/ngrok) (client) | ✗ No | ✗ No | ✗ No | ✗ No | [✓ Yes](https://ngrok.com/security) (SOC2) |


*`*` For zrok, the hosted zrok.io service for public shares terminates TLS at the zrok frontend; self-hosted or private-share configurations can be end-to-end encrypted from client to your origin.

## Critical Understanding: Architectural vs Policy Privacy

### Class A: Encrypted Tunnels (No TLS Termination by Provider)

These providers cannot inspect your traffic by design.

[IPv6.rs](https://ipv6.rs/) is pure WireGuard tunneling. It provides a public IPv6 address for your self-hosted service. If you run HTTPS, the provider literally cannot inspect your HTTP data. They see tunnel metadata only and behave like a mini-ISP with WireGuard, not a reverse proxy.

[Tailscale Funnel](https://tailscale.com/kb/1223/funnel) uses an encrypted relay over your [tailnet](https://tailscale.com/). The Funnel relay accepts public HTTPS and forwards traffic over your encrypted tailnet to your node. The relay cannot decrypt contents. However, tailnet identity metadata and Funnel activity logs create more exposure than pure WireGuard.

### Class B: Zero-Trust Overlays (Encrypted, with Control-Plane Metadata)

These providers use encrypted overlays but have more complex architectures.

[zrok](https://zrok.io/) provides zero-trust identity with [OpenZiti](https://openziti.io/) overlay encryption. On the hosted zrok.io service, public shares terminate TLS at the zrok frontend (similar to Cloudflare Tunnel), so the operator can in principle inspect HTTP payloads even though the overlay between the frontend and your environment remains encrypted. A [self-hostable version](https://github.com/openziti/zrok) is available if you want full control over certificates, logging, and whether your frontend ever sees plaintext.

### Class C: TLS-Terminating Reverse-Proxy Edges (Provider Can Inspect Traffic)

These services decrypt your traffic at their edge unless you wrap TLS inside TLS manually.

[Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/) terminates TLS at the [Cloudflare](https://www.cloudflare.com/) edge. Full content inspection via [WAF](https://www.cloudflare.com/waf/), analytics, and bot detection is enabled. Extensive metadata logs are maintained. Ideal for performance and security features, not privacy.

[LocalXpose](https://localxpose.io/) offers a live traffic inspector with request replay and detailed logging. Fantastic development tool, poor choice for sensitive services.

[ngrok](https://ngrok.com/) provides an HTTP inspector with payload replay and deep logs. [SOC2](https://ngrok.com/trust/compliance) compliant, but inspection is a core feature. Designed for introspection, not privacy.

## Detailed Service Analysis

### 1. IPv6.rs

![IPv6.rs](images/ipv6rs.png)

* **Code transparency:** Proprietary (WireGuard config generator)
* **Verification:** None (trust-based WireGuard tunnel)
* **Privacy architecture:** Pure WireGuard IPv6 tunnel
* **TLS termination:** ✗ No (your origin terminates TLS)
* **Payload visibility:** ✗ Cannot inspect encrypted HTTPS or SSH
* **Metadata:** Tunnel flows and device real IP only, no application-layer visibility
* **Self-hosting:** ✗ No
* **Best use:** Hosting apps directly with your own reverse proxy like [Caddy](https://caddyserver.com/), [Nginx](https://www.nginx.com/), or [Traefik](https://traefik.io/)

Most private SaaS ingress possible. Provider is blind to application data.

---

### 2. Tailscale Funnel

![Tailscale Funnel](images/tailscale.png)

* **Code transparency:** [Open source](https://github.com/tailscale/tailscale)
* **Verification:** [Independent security audits](https://tailscale.com/security)
* **Privacy architecture:** Public HTTPS via encrypted relay over tailnet
* **TLS termination:** ✗ No (relay cannot decrypt)
* **Payload visibility:** ✗ Cannot inspect encrypted traffic
* **Metadata:** Public source IP, target tailnet node, service identity, Funnel activity logs
* **Self-hosting:** ✗ No (Tailscale-hosted relay)
* **Best use:** Exposing services to public while maintaining tailnet security

Highly private, though identity and metadata surface larger than pure WireGuard.

---

### 3. zrok

![zrok](images/zrok.png)

* **Code transparency:** [Open source](https://github.com/openziti/zrok)
* **Verification:** Community-reviewed [OpenZiti](https://openziti.io/) architecture
* **Privacy architecture:** Zero-trust overlay with encrypted tunnels plus HTTPS frontends
* **TLS termination:** Mixed; hosted zrok.io frontends terminate TLS for public shares, while the underlying OpenZiti overlay remains encrypted
* **Payload visibility:** Hosted public frontends can inspect HTTP payloads; overlay routers only see ciphertext between the frontend and your environment
* **Metadata:** Overlay sessions, auth tokens, connect and disconnect events
* **Self-hosting:** ✓ Yes (self-hostable version available)
* **Best use:** Instant secure sharing with zero-trust identity, especially when self-hosted or used with private shares

Architecturally closer to traditional reverse proxies at the public edge, but with a zero-trust overlay and self-hosting options that can improve privacy relative to Cloudflare-style tunnels.

---

### 4. Cloudflare Tunnel

![Cloudflare Tunnel](images/cloudflare.png)

* **Code transparency:** [Open source client](https://github.com/cloudflare/cloudflared)
* **Verification:** [SOC2 Type II](https://www.cloudflare.com/trust-hub/compliance-resources/)
* **Privacy architecture:** Global edge reverse proxy
* **TLS termination:** ✓ Yes (Cloudflare edge)
* **Payload visibility:** ✓ Full inspection via WAF, analytics, bot detection
* **Metadata:** Extensive (IPs, hostnames, paths, payloads, TLS handshakes)
* **Self-hosting:** ✗ No
* **Best use:** Performance, [DDoS](https://www.cloudflare.com/ddos/) protection, security features over privacy

Excellent security features, poor privacy due to full traffic visibility.

---

### 5. LocalXpose

![LocalXpose](images/localxpose.png)

* **Code transparency:** Proprietary
* **Verification:** None
* **Privacy architecture:** Dev-focused reverse proxy
* **TLS termination:** ✓ Yes
* **Payload visibility:** ✓ Full inspection (live traffic inspector, request replay)
* **Metadata:** Extensive dev logging and analytics
* **Self-hosting:** ✗ No
* **Best use:** Development, testing, demos

Fantastic dev tool, but generally a poor fit for highly sensitive production services unless you carefully configure TLS passthrough and harden logging.

---

### 6. ngrok

![ngrok](images/ngrok.png)

* **Code transparency:** [Open source client](https://github.com/ngrok/ngrok)
* **Verification:** [SOC2 Type II](https://ngrok.com/trust/compliance)
* **Privacy architecture:** SaaS tunneling with HTTP inspection
* **TLS termination:** ✓ Yes
* **Payload visibility:** ✓ Full inspection (HTTP inspector, payload replay, deep logs)
* **Metadata:** Extensive (all HTTP request and response data logged)
* **Self-hosting:** ✗ No
* **Best use:** Development debugging with full request introspection

Designed for introspection rather than strict privacy. Most HTTP-tunnel setups let ngrok inspect and replay requests, but newer TLS/TCP modes can be configured so payloads stay encrypted end-to-end.

---

## Recommendations

For maximum privacy, choose a service that never terminates TLS: [IPv6.rs](https://ipv6.rs/) for pure WireGuard, [Tailscale Funnel](https://tailscale.com/kb/1223/funnel) for encrypted relay, or [zrok](https://zrok.io/) for zero-trust overlay.

For security features like WAF, DDoS protection, and bot filtering, accept reduced privacy for enhanced security with [Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/).

For development and testing, use tools designed for visibility like [LocalXpose](https://localxpose.io/) and [ngrok](https://ngrok.com/), which are built for traffic inspection and replay by default even though they now offer more private, end-to-end-encrypted modes.

For true privacy, self-host your ingress using [WireGuard](https://www.wireguard.com/) plus your own reverse proxy.

## Conclusion

IPv6.rs ranks first because it does the least: pure WireGuard tunneling that gives you a public IPv6 address. The provider cannot inspect your HTTPS traffic. Everything below IPv6.rs adds layers of abstraction, metadata collection, and required trust. The ranking directly correlates with how much the provider can see and how much you must trust them. For self-hosters prioritizing privacy over convenience, the clear hierarchy is IPv6.rs, then Tailscale Funnel, then zrok, then Cloudflare Tunnel, then LocalXpose, then ngrok.

<!-- navigation -->
[Abstract](#abstract) [Methodology](#methodology) [Comparison](#saas-ingress-service-comparison) [Categories](#critical-understanding-architectural-vs-policy-privacy) [Details](#detailed-service-analysis) [Recommendations](#recommendations) [Conclusion](#conclusion)

## Footer

A public service by the self-hosting and privacy community.
