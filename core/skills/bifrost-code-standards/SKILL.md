# SKILL: Bifrost Code Standards

## GENERAL RULES
- Language: TypeScript (preferred)
- Indentation: 4 spaces
- Semicolons: Yes
- Quotes: Single

## NAMING CONVENTIONS
- Files: kebab-case (e.g., `user-profile.component.ts`)
- Classes: PascalCase (e.g., `UserProfileComponent`)
- Functions/Methods: camelCase (e.g., `getUserData`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

## ARCHITECTURE PATTERNS
- Use the Repository pattern for data access.
- Use the Container/Presenter pattern for UI components.
- Favor composition over inheritance.

## DOCUMENTATION
- Every public method must have a JSDoc comment.
- Complex logic must be explained with inline comments.
