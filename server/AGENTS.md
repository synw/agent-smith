# AGENTS.md

## Build Commands

### Build the application
```bash
go build -o server
```

### Build for Windows (amd64)
```bash
GOOS=windows GOARCH=amd64 go build -o server.exe
```

### Build with custom output
```bash
go build -o myapp
```

### Clean build artifacts
```bash
go clean
```

## Lint Commands

### Run go vet
```bash
go vet ./...
```

### Run golint (if installed)
```bash
golint ./...
```

### Run staticcheck (if installed)
```bash
staticcheck ./...
```

### Run all linters
```bash
golangci-lint run
```

## Test Commands

### Run all tests
```bash
go test ./...
```

### Run tests with verbose output
```bash
go test -v ./...
```

### Run a specific test
```bash
go test -run TestFunctionName ./...
```

### Run tests with coverage
```bash
go test -cover ./...
```

### Run tests with race detection
```bash
go test -race ./...
```

## Code Style Guidelines

### Go Style
- Use Go standard formatting (gofmt)
- Follow Go naming conventions (PascalCase for exported names, camelCase for unexported)
- Use descriptive variable names
- Keep functions short and focused
- Use error handling with proper error wrapping

### Imports
- Group imports in order: standard library, external libraries, internal packages
- Use goimports to format imports automatically
- Avoid unused imports

### Formatting
- Use gofmt for code formatting
- Maximum line length: 120 characters
- Use spaces, not tabs
- Use 4-space indentation

### Types and Naming
- Use meaningful type names
- Use camelCase for field names
- Use PascalCase for exported types and methods
- Use descriptive function names
- Use short, descriptive variable names

### Error Handling
- Always handle errors appropriately
- Use error wrapping for context
- Don't ignore errors
- Prefer explicit error checking over panic

### Comments
- Document exported functions, types, and methods
- Use godoc-style comments
- Comment complex logic
- Keep comments up to date with code changes

### Testing
- Write tests for all exported functions
- Use table-driven tests for multiple cases
- Test edge cases
- Use testify for assertions if needed

### Configuration
- Use viper for configuration management
- Default values should be defined in code
- Configuration files should be in YAML format
- Environment variables can override config values

### Security
- Don't expose sensitive information in logs
- Validate input parameters
- Sanitize user input
- Use secure defaults

### Performance
- Avoid unnecessary allocations
- Use sync.Pool for frequently allocated objects
- Be mindful of memory usage in loops
- Consider using slices instead of arrays when size is dynamic

## Cursor/Copilot Rules

No specific Cursor or Copilot rules found in this repository.