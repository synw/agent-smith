# AGENTS.md

## Build, Lint, and Test Commands

### Build
```bash
npm run build
```

### Lint
```bash
# No explicit lint command found
```

### Test
```bash
npm test
# For running a single test:
# Note: No test framework configured in package.json
```

### Development
```bash
npm run start
```

## Code Style Guidelines

### General
- Use TypeScript for type safety
- Follow TypeScript naming conventions
- Use ES Modules (`import`/`export`) instead of CommonJS
- All files use UTF-8 encoding

### Imports
- Group imports by type (external, internal, sibling)
- Sort imports alphabetically within each group
- Use relative paths for local imports

### Formatting
- Use Prettier for code formatting (not explicitly configured)
- Follow TypeScript/JavaScript conventions
- Maintain consistent indentation (2 spaces recommended)
- Use camelCase for variable and function names
- Use PascalCase for class names
- Use UPPER_CASE for constants

### Types
- Use TypeScript interfaces for object shapes
- Prefer interfaces over types when possible
- Use explicit typing for all function parameters and return values
- Use readonly for immutable properties when possible
- Use strict null checks

### Naming Conventions
- Use descriptive names for functions and variables
- Use camelCase for functions, variables, and properties
- Use PascalCase for classes and interfaces
- Use UPPER_CASE for constants
- Use `is` prefix for boolean variables (e.g., `isLoaded`)
- Use `has` prefix for boolean checks (e.g., `hasError`)

### Error Handling
- Handle errors gracefully using try/catch blocks
- Log errors appropriately with context
- Don't suppress errors silently
- Use specific error types when possible

### Documentation
- Add JSDoc comments for public APIs
- Document complex functions with parameters and return values
- Use clear, concise documentation

### Database
- Use better-sqlite3 for database operations
- Implement deduplication for job offers
- Handle database connections properly
- Use prepared statements to prevent SQL injection
- Use transactions for batch operations

### Configuration
- Use YAML configuration files
- Load configuration files with proper error handling
- Separate configuration from code

### Code Organization
- Keep files modular and focused on single responsibilities
- Group related functionality together
- Use clear directory structure
- Separate business logic from data access logic

### Security
- Never log sensitive information
- Validate and sanitize inputs
- Use parameterized queries for database operations
- Follow secure coding practices

### Testing
- No test framework configured in this project
- Tests should be written following standard testing patterns if added
- Focus on testing core business logic and database interactions

### Cursor/Copilot Rules
- No specific cursor or copilot rules found in this repository