# Documentation for Open Source Reviews Curated by Github Users

## Introduction

This guide explains how to write README.md files that work with our build system. The build system converts your markdown into a beautiful HTML website automatically.

---

## Basic Structure

Every README.md follows this pattern:

```markdown
# Main Title
Subtitle text

## Section Name
Section content

### Subsection Name
Subsection content

## Footer
Footer text
```

---

## Title and Subtitle

The first `#` heading becomes your page title:

```markdown
# Best VPN Services 2024
A comprehensive review of top VPN providers
```

- **Title:** The `# heading` text
- **Subtitle:** The first text line after the title (optional)

---

## Sections

Use `##` for main sections:

```markdown
## Introduction
This is the introduction section content.

## Top Services
Here are our top picks.

## Methodology
This is how we tested.
```

Each section:
- Gets its own heading in the page
- Appears in the navigation menu
- Can contain paragraphs, lists, tables, and subsections

---

## Subsections

Use `###` for subsections:

```markdown
## Main Section

### First Subsection
Content here.

### Second Subsection
More content here.
```

---

## Service Cards (Special Feature)

**Numbered subsections create special service cards:**

```markdown
### 1. Service Name
![Logo](images/logo.png)
Brief description of the service.

* **Price:** $9.99/month
* **Servers:** 5,000+
* **Encryption:** AES-256
```

**Key points:**
- Must start with a number and period: `### 1.`, `### 2.`, etc.
- Image (optional) goes on the first line after the heading
- Description paragraph (optional)
- Details use `* **Label:** Value` format

**Output:** Beautiful card with logo, description, and details list

---

## Text Formatting

### Bold and Italic

```markdown
**Bold text**
*Italic text*
```

### Inline Code

```markdown
Use `backticks` for code
```

### Links

```markdown
[Link text](https://example.com)
```

All links automatically open in new tabs.

### Images

```markdown
![Alt text](images/photo.jpg)
```

**Image locations:**
- In service cards → smaller icon size
- In tables → smaller icon size  
- Standalone → larger logo size

### Clickable Images

```markdown
[![Alt text](images/logo.png)](https://example.com)
```

Creates an image that links to a URL.

---

## Lists

### Simple Lists

```markdown
- First item
- Second item
- Third item
```

### Lists with Bold Labels

```markdown
- **Feature Name:** Description of the feature
- **Another Feature:** More description here
- **Third Feature:** Even more details
```

**Output:** Styled list with bold labels and descriptions

### Numbered Lists with Bold

```markdown
1. **First Point:** Explanation here
2. **Second Point:** More explanation
3. **Third Point:** Final point
```

---

## Tables

Standard markdown tables work perfectly:

```markdown
| Service | Price | Rating |
|---------|-------|--------|
| NordVPN | $3.99 | ✓ Excellent |
| ExpressVPN | $8.32 | ✓ Good |
| Surfshark | $2.49 | ✓ Very Good |
```

**Features:**
- First row is automatically highlighted
- First column is styled differently (great for rank numbers)
- Full markdown support in cells (bold, links, images, icons)
- Automatically mobile-responsive

**With Images:**

```markdown
| Service | Price | Features |
|---------|-------|----------|
| ![Logo](logo1.png) Service A | $5/mo | ✓ Fast |
| ![Logo](logo2.png) Service B | $3/mo | ✓ Secure |
```

---

## Special Icons

These characters automatically convert to colored SVG icons:

```markdown
✓  or  ✅  →  Green checkmark
✗  or  ❌  →  Red X mark
⚠  or  ⚠️  →  Yellow warning
```

**Usage examples:**

```markdown
* **Security:** ✓ Excellent
* **Logging:** ✗ Logs connections
* **Speed:** ⚠ Variable

| Feature | Status |
|---------|--------|
| Netflix | ✓ Works |
| Torrenting | ✗ Blocked |
| Free Trial | ⚠ Limited |
```

---

## Special Directives

Use HTML comments for special features:

### Annotations

Creates a highlighted note box:

```markdown
<!-- annotation: This is an important note about our methodology -->
```

**When to use:** Important clarifications, methodology notes, disclaimers

### Callouts

Creates a callout box after subsections:

```markdown
<!-- callout: Remember to check the latest prices on official websites -->
```

**When to use:** Reminders, warnings, tips

### Custom Navigation

Override the auto-generated navigation:

```markdown
<!-- navigation -->
[Home](#) | [Reviews](#reviews) | [About](#about)
```

If not provided, navigation is automatically created from section headings.

### Notes

For internal comments (not displayed):

```markdown
<!-- note: Update this section monthly -->
```

---

## Footer

Add a footer section at the end:

```markdown
## Footer
Last updated: November 2024 | [Contact Us](mailto:email@example.com)
```

The footer appears at the bottom of every page.

---

## Complete Example

```markdown
# Best Cloud Storage 2024
Compare the top cloud storage providers

## Introduction
Cloud storage has become essential for modern computing. This guide reviews the best options available.

### What We Tested
- **Storage Space:** Free and paid tiers
- **Speed:** Upload and download performance
- **Security:** Encryption and privacy features

<!-- annotation: All services were tested over a 30-day period -->

## Top Cloud Storage Services

### 1. Dropbox
![Dropbox Logo](images/dropbox.png)
Industry leader with excellent sync technology and collaboration features.

* **Free Storage:** 2GB
* **Paid Plans:** From $9.99/month
* **Sync Speed:** ✓ Excellent
* **Security:** ✓ AES-256

### 2. Google Drive
![Google Drive Logo](images/gdrive.png)
Best integration with Google Workspace and generous free tier.

* **Free Storage:** 15GB
* **Paid Plans:** From $1.99/month
* **Sync Speed:** ✓ Very Good
* **Security:** ✓ Strong

### 3. MEGA
![MEGA Logo](images/mega.png)
Privacy-focused with end-to-end encryption and generous free storage.

* **Free Storage:** 20GB
* **Paid Plans:** From $5.69/month
* **Sync Speed:** ✓ Good
* **Security:** ✓ End-to-End

<!-- callout: Always verify current pricing on provider websites -->

## Feature Comparison

| Feature | Dropbox | Google Drive | MEGA |
|---------|---------|--------------|------|
| Free Storage | 2GB | 15GB | 20GB |
| Desktop Sync | ✓ | ✓ | ✓ |
| Mobile Apps | ✓ | ✓ | ✓ |
| E2E Encryption | ✗ | ✗ | ✓ |
| Office Suite | ⚠ Basic | ✓ Full | ✗ |

## Methodology

### Testing Process
We tested each service using the following criteria:

- **Performance:** Upload and download speeds measured across 100 files
- **Reliability:** Sync accuracy and conflict resolution
- **Features:** Collaboration tools and integrations
- **Security:** Encryption standards and privacy policies

<!-- annotation: Tests conducted from multiple locations with varying internet speeds -->

## Footer
Last updated: November 2024 | [Privacy Policy](#) | [Terms](#)
```

---

## Quick Reference

### Headings
```markdown
# Page Title (only one)
## Section (navigation item)
### Subsection
```

### Service Card
```markdown
### 1. Name
![Logo](image.png)
Description.
* **Label:** Value
```

### Text Formatting
```markdown
**bold**
*italic*
`code`
[link](url)
![image](url)
```

### Lists
```markdown
- Simple item
- **Bold Label:** Description
```

### Table
```markdown
| Col 1 | Col 2 |
|-------|-------|
| Data  | Data  |
```

### Icons
```markdown
✓ (checkmark)
✗ (cross)
⚠ (warning)
```

### Directives
```markdown
<!-- annotation: text -->
<!-- callout: text -->
<!-- navigation -->
<!-- note: text -->
```
