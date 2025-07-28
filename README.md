# ING HR App

A simple employee management interface built with [Lit](https://lit.dev/).  
Users can add, edit, and delete employees — all data is stored in `localStorage`.

## 🚀 Getting Started

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone https://github.com/Semcester/ing-case.git
cd ing-case
```

### 2. Install Dependencies

```bash
npm install
```
```bash
npx playwright install
```

### 3. Start the Development Server

```bash
npm run serve
```

The app will be available at: [http://localhost](http://localhost)

---

## 🧰 Tech Stack

- **Lit** – Lightweight and fast web component library
- **Vaadin Router** – Client-side routing
- **Redux Toolkit (custom)** – Basic store structure
- **localStorage** – Persistent caching
- **Web Dev Server** – For development and live reload

---

## 📦 Folder Structure

```
.
├── components/        → Reusable web components
├── pages/             → Route-driven views (List, Form)
├── store/             → Centralized state management
├── router/            → Routing setup
├── i18n/              → Internationalization (multi-language)
├── contants/          → Mock data and constants
├── index.js           → App entry point
├── index.html         → HTML shell
```

---

## 🌐 Features

- Add / Edit / Delete employees
- Inline form validation
- Multi-language support (EN/TR)
- Fully responsive layout
- Data persistence via `localStorage`

---

## 🧪 Testing

This project uses [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) with [@open-wc/testing](https://open-wc.org/docs/testing/) for unit testing.

### Run All Tests

```bash
npm run test
```

This will run all test files in the `src/tests/` directory that match the pattern `*.test.js`.
