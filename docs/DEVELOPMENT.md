# Development Guide

## Quick Start

1. Install dependencies: `yarn install`
2. Set up MySQL database
3. Configure `.env` in `apps/server`
4. Run migrations: `cd apps/server && yarn db:generate && yarn db:migrate`
5. Start server: `yarn server`
6. Start mobile: `yarn mobile`

## Project Structure

- `apps/mobile` - React Native + Expo app
- `apps/server` - Express + tRPC backend
- `packages/shared` - Shared types

For detailed instructions, see README.md
