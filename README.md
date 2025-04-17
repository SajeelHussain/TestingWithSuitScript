# SuiteScript Utility Modules & Test Suite

A comprehensive collection of SuiteScript 2.x modules for NetSuite automation, including CSV file parsing, email sending, currency conversion, caching, and more. This project comes with robust Jest-based tests and mocks, enabling local development and CI workflows outside the NetSuite environment.

---

## ✨ Features

- **CSV File Parser**: Create, save, and process CSV files, with error handling for invalid data.
- **Email Sender**: Automate sending emails from SuiteScript, with test coverage.
- **Currency Converter**: Utilities for handling currency conversions.
- **Cache Utilities**: SuiteScript cache API mocks and usage examples.
- **Format Converter & Validation**: Data formatting and parameter validation helpers.
- **Timebill Automation**: Scripts and tests for timebill record handling.
- **Comprehensive Test Suite**: Jest tests for all modules, with custom mocks for NetSuite APIs.

---

## 📁 Project Structure

```
.
├── scripts/
│   ├── cache.js
│   ├── currencyConverter.js
│   ├── emailSender.js
│   ├── fileParser.js
│   ├── formatConverter.js
│   ├── timebill.js
│   └── validateParam.js
├── tests/
│   ├── cache.test.js
│   ├── currency.test.js
│   ├── emailSender.test.js
│   ├── fileParser.test.js
│   ├── timebill.test.js
│   └── validateParam.test.js
├── __mocks__/
│   ├── N/
│   │   ├── action.js
│   │   ├── cache.js
│   │   ├── currency.js
│   │   ├── email.js
│   │   ├── error.js
│   │   ├── file.js
│   │   ├── log.js
│   │   └── record.js
│   └── SuiteScripts/
│       └── zipCodes/
│           └── ca/
│               └── zipToCityIndexCacheLoader.js
├── package.json
├── jest.config.js
└── ...
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- Jest (installed via `npm install`)

### Installation

```sh
git clone https://github.com/yourusername/suitescript-utilities.git
cd suitescript-utilities
npm install
```

---

## 📦 Usage

### SuiteScript Modules

Each module in the `/scripts` directory is designed for NetSuite’s SuiteScript 2.x API.

**Example usage for the file parser:**

```javascript
define(['N/file', 'N/error', 'N/log'], function (file, error, log) {
    // See scripts/fileParser.js for full usage
});
```

---

### 🧪 Running Tests

All modules have corresponding Jest test files in `/tests` and mocks in `__mocks__`.

```sh
npm test
```

---

## 🔍 Highlights

- ✅ Mocks for all major NetSuite APIs (`N/file`, `N/error`, `N/log`, etc.) for seamless local testing.
- 🧪 Test-driven development: All scripts are covered by automated tests.
- 🛡️ Error handling: Each module demonstrates robust error handling and validation.
- 🔄 Ready for CI/CD: The setup supports continuous integration pipelines.

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request for improvements or new modules.

---

**Note:**
- Replace `yourusername` in the clone URL with your actual GitHub username or organization.
- For NetSuite deployment, copy relevant scripts to your NetSuite File Cabinet and deploy via SuiteScript.
