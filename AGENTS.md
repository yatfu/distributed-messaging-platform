# Response Gudielines
Keep responses concise
Answer only the current question
Give one recommended approach rather than many alternatives

# Editing Guidelines
Do not edit files unless I explicitly ask
when editing files, only perform changes mentioned in the request asking for the change

# Language Guidelines
Keep language simple enough for a reader uneducated in the topic to understand

# Engineering Rules
Use TypeScript.
Always validate external inputs.
Use parameterized SQL queries.
Keep database logic outside route handlers.
Avoid changing database schemas unless absolutely necessary
ask before changing database schemas
avoid adding dependencies unless absolutely necessary
ask before changing dependencies

## Verification

Before considering a task complete:

Run TypeScript compilation.
Run linting.
Review the final git diff.
Report any errors or failing checks.

## Agent Behavior

For substantial architectural changes:
  Inspect the existing implementation.
  Explain the proposed approach.
  Wait for approval before implementation.

For small, well-defined changes:
- Implement directly.
- Run relevant verification.
- Summarize what changed.

## Scripts
Development: `npm run dev`

Type checking: `npm run typecheck`

Production build: `npm run build`

Production server: `npm start`