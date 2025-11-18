# Open Source Reviews

A review site that doesn't care about your clicks.

## Why This Exists

Review sites are broken. They exist to sell you things through affiliate links. Their recommendations change based on commission rates, not quality. Their "best of" lists are just affiliate revenue rankings in disguise.

We needed reviews we could actually trust. Reviews that could be fact-checked, edited, and improved by anyone who spots a problem.

So we built Open Source Reviews. It's just markdown files in a git repository. If you see something wrong, you can fix it. If you want to add a category, you can add it. If you disagree with a ranking, you can open an issue and make your case.

## Other Privacy Lists

GitHub has curated lists for privacy tools. They're useful, but upon closer inspection, the VPN sections are detailed and actively maintained. Everything else is either empty or hasn't been updated in months. It's the same problem again, just in a different form. VPNs get all the attention because that's where people focus their energy.

This project doesn't do that. All categories get equal treatment. The build system doesn't know or care whether you're reviewing VPNs, cloud storage, or task management apps. A review is a review. If someone wants to maintain a comprehensive guide to something else, they can do that here with the same tooling and the same level of support as any other category.

## How It Works

Write reviews in markdown. Submit a PR. When merged, the script runs and outputs the static site.

Each category lives in its own folder under `reviews/`. Each folder has a README.md with the actual content. The build system converts these into styled HTML pages with service cards, comparison tables, and proper navigation.

## Project Structure
```
project/
├── build/              # Build scripts
├── reviews/
│   ├── vps/            # One category
│   │   ├── README.md   # The actual content
│   │   ├── images/     # Logos, screenshots
│   │   └── theme.json  # Optional styling
│   ├── storage/
│   └── password/
├── css/                # Site styles
├── js/                 # Site scripts
├── templates/          # Site templates
└── site/               # Generated output
```

## Adding a Category

Create a folder in `reviews/` and add a README.md:

```markdown
# Best Password Managers Curated by Github Users
We tested these so you don't have to.

## Top Services

### 1. 1Password
![Logo](images/1password.png)
Actually good. Cross-platform. Reasonable price.

* **Price:** $3/month
* **Platforms:** Everything
* **Audit:** Yes

### 2. Bitwarden
![Logo](images/bitwarden.png)
Open source. Self-hostable if you want that.

* **Price:** Free (or $10/year)
* **Platforms:** Everything
* **Audit:** Yes
```

The build system handles the rest. Numbered subsections become service cards. Tables become comparison charts. Special characters like `✓` and `✗` become styled icons.

Full markdown reference is in `DOCUMENTATION.md`.

## Building

Build everything:
```bash
node build/build-all.js
```

Build one category:
```bash
node build/build.js reviews/vpn
```

Build just the index:
```bash
node build/build-main.js
```

Output goes to `site/`. Open `site/index.html` to see results.

## Contributing

Contributions are subject to the guidelines in CONTRIBUTING.md and NOTE-WELL.md.

## What This Isn't

This isn't trying to be exhaustive. It's not trying to review every product in every category. It's trying to identify the best options based on actual merit, not commission rates.

It's also not trying to be neutral about everything. If a service has a bad privacy policy, that matters. If they've had security incidents they didn't disclose, that matters. The goal is honest evaluation, not diplomatic both-sidesism.

## Requirements

Node.js.

## License

Open source MIT Licensed.

Maintained by people who just wanted better reviews.
