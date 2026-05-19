# SCD Vocabulary

A unified reference mapping security controls across major global compliance frameworks. **SCD (Security Control Dictionary)** provides a zero-knowledge, client-side reference tool for security professionals to quickly look up and compare requirements from various standards.

## Features

- **Quick Lookup**: Search for security domains (e.g., Access, Physical, Cryptography) to find relevant controls.
- **Framework Mappings**: See how specific controls map to ISO 27001, SOC 2, NIST CSF, CIS Controls, COBIT, PCI DSS, GDPR, and DORA.
- **Detailed View**: Slide-over panel with specific clauses and Unified Security Control descriptions.
- **Print to PDF**: Export requirement details for documentation or reporting.
- **Privacy First**: All processing is done locally in your browser.

## Contributing to the Database

We believe in community-driven data. Everyone is welcome to update the database to keep the mappings accurate and up-to-date.

If you find a missing mapping, a typo, or want to add a new standard:
1. Locate the `src/mappings.json` file.
2. Make your changes or additions.
3. **Submit a Pull Request (PR)** with a brief description of your updates.

Your contributions help make this tool better for everyone in the security community!

## Tech Stack

- **React 19**
- **Vite**
- **Tailwind CSS**
- **Lucide React Icons**
- **TypeScript**

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
