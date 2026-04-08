# Summary

## HTTP Endpoints

- `/cmd/execute` - Execute a command with an API key.
  - Example: Infer the largest planet in the solar system.
  - Requires a valid general or group API key.

## Usage

1. Install the API client:
   ```bash
   npm install @agent-smith/apicli
   ```

2. Configure your API key in the client.

3. Use the `executeCmd` method to send commands.

4. Abort a running command using `abortController.abort()`.