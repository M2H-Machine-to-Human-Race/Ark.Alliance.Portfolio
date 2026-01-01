# Contributing to Ark.Alliance.Portfolio

Thank you for your interest in contributing to Ark.Alliance.Portfolio! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Style Guidelines](#code-style-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)

---

## 📜 Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. We expect contributors to:

- **Be respectful** of differing viewpoints and experiences
- **Give and gracefully accept** constructive feedback
- **Focus on what is best** for the community and the project
- **Show empathy** towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or offensive comments
- Publishing others' private information without consent
- Any conduct that could reasonably be considered inappropriate

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Git
- A code editor (VS Code recommended)

### Setting Up Your Development Environment

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ark-portfolio.git
   cd ark-portfolio
   ```

3. **Add the upstream remote**
   ```bash
   git remote add upstream https://github.com/ark-alliance/ark-portfolio.git
   ```

4. **Install dependencies**
   ```bash
   # Shared library (required first)
   cd Ark.Portfolio.Share && npm install && npm run build
   
   # Backend
   cd ../Ark.Portfolio.Backend && npm install
   
   # Frontend
   cd ../Ark.Portfolio.UI && npm install
   
   # Tests
   cd ../Ark.Portfolio.Tests && npm install
   ```

5. **Run the development servers**
   ```bash
   # Terminal 1: Backend
   cd Ark.Portfolio.Backend && npm run dev
   
   # Terminal 2: Frontend
   cd Ark.Portfolio.UI && npm run dev
   ```

---

## 🔄 Development Workflow

### Branch Naming Convention

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/ai-image-generation` |
| Bug Fix | `fix/description` | `fix/login-redirect-loop` |
| Documentation | `docs/description` | `docs/api-endpoints` |
| Refactor | `refactor/description` | `refactor/auth-service` |
| Test | `test/description` | `test/project-service` |

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(ui): add dark mode toggle to header
fix(backend): resolve JWT token expiration issue
docs(readme): update deployment instructions
test(share): add DTO validation tests
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout develop
git merge upstream/develop
```

---

## 📤 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   cd Ark.Portfolio.Tests && npm test
   ```

2. **Update documentation** if your changes affect public APIs or usage

3. **Rebase on the latest develop**
   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

### Creating the Pull Request

1. Push your branch to your fork
   ```bash
   git push origin feature/your-feature
   ```

2. Open a Pull Request on GitHub against `develop` (for features) or `main` (for hotfixes)

3. Fill out the PR template completely:
   - **Description**: What does this PR do?
   - **Related Issues**: Link any related issues
   - **Testing**: How was this tested?
   - **Screenshots**: Include if UI changes

### Review Process

1. At least one maintainer review is required
2. All CI checks must pass
3. No merge conflicts
4. Documentation updated if needed

---

## 📝 Code Style Guidelines

### TypeScript

- Use TypeScript strict mode
- Prefer interfaces over type aliases for object shapes
- Export interfaces from `.model.ts` files
- Use `readonly` for immutable properties

```typescript
// ✅ Good
export interface ProjectDto {
    readonly id: string;
    title: string;
    status: ProjectStatus;
}

// ❌ Avoid
export type ProjectDto = {
    id: string;
    title: string;
}
```

### React Components

- Follow MVVM pattern for V2 components
- Separate View (`.tsx`), Model (`.model.ts`), and Styles (`.styles.css`)
- Use functional components with hooks

```
ComponentName/
├── ComponentName.tsx        # View (presentation only)
├── ComponentName.model.ts   # ViewModel (state & logic)
├── ComponentName.styles.css # Styles
└── index.ts                 # Barrel export
```

### CSS

- Use CSS custom properties (variables) from the design system
- Prefix component-specific classes with the component name
- Follow BEM-like naming: `component__element--modifier`

```css
/* ✅ Good */
.header__nav-link--active { }

/* ❌ Avoid */
.active { }
.navLink { }
```

---

## 🧪 Testing Requirements

### All PRs Must Include Tests

- **New features**: Add unit and integration tests
- **Bug fixes**: Add regression tests
- **UI components**: Add RTL (React Testing Library) tests

### Test File Naming

```
Feature.test.tsx      # React component tests
Feature.spec.ts       # Unit/integration tests
```

### Running Tests

```bash
# Run all tests
cd Ark.Portfolio.Tests && npm test

# Run specific test file
npm test -- --testPathPattern="ComponentName"

# Run with coverage
npm run test:coverage
```

### Minimum Coverage

- New code should have **80% coverage** minimum
- Critical paths (auth, payments) should have **95% coverage**

---

## 📚 Documentation

### Code Documentation

- Use JSDoc comments for public APIs
- Include `@param`, `@returns`, and `@throws` where applicable

```typescript
/**
 * Authenticates a user and returns a JWT token.
 * 
 * @param username - The user's username
 * @param password - The user's password
 * @returns Authentication result with token
 * @throws {AuthenticationError} If credentials are invalid
 */
async function login(username: string, password: string): Promise<AuthResult> {
    // ...
}
```

### README Updates

If your changes affect:
- Installation process
- Configuration options
- API endpoints
- Feature capabilities

Please update the relevant README file(s).

---

## 🎉 Thank You!

Your contributions make Ark.Alliance.Portfolio better for everyone. We appreciate your time and effort!

If you have questions, feel free to:
- Open a GitHub Discussion
- Reach out on our community channels

---

<div align="center">
  <sub>Ark Alliance Ecosystem | © M2H.IO</sub>
</div>
