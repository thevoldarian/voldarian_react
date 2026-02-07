# Voldarian React Website

[![CI](https://github.com/thevoldarian/voldarian_react/actions/workflows/ci.yml/badge.svg)](https://github.com/thevoldarian/voldarian_react/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb.svg)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Personal portfolio website built with React and TypeScript, deployed on AWS.

## Features

- ⚛️ React 19 with TypeScript
- 🎨 Modern CSS styling
- ✅ Vitest for testing
- 🔍 ESLint + Prettier for code quality
- 🚀 Deployed via AWS CDK to CloudFront + S3

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Available Scripts

### Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### Testing

```bash
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Run tests with coverage
```

### Code Quality

```bash
npm run lint          # Check linting
npm run lint:fix      # Fix linting issues
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```

### Production Build

```bash
npm run build
```

Builds the app for production to the `build` folder.

## Deployment

This site is deployed using [AWS CDK infrastructure](https://github.com/thevoldarian/voldarian_cdk).

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality
- **React Scripts** - Build tooling

## License

MIT
