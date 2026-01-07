# LernApp Frontend AI Instructions

## Architecture Overview

**LernApp** is an Angular 20+ standalone-component learning application with a mono-repo structure:

- **`src/app/`** - Main application with route-based pages and core services
- **`projects/api/`** - Auto-generated OpenAPI Angular service library (do not edit manually)
- **`src/assets/i18n/`** - Internationalization files (English/German)

### Key Components & Data Flow

1. **Authentication**: `AuthService` manages user sessions via `LoginResponse` stored in localStorage
2. **API Services**: Generated from OpenAPI (CardService, DeckService, IdentityService, ProgressService, TestService)
3. **Routing**: Uses Angular standalone routing with `AuthGuard` protecting most routes
4. **State**: Angular signals (`signal()`, `toObservable()`) for reactive UI updates

### Service Architecture Pattern

All API services follow a consistent pattern:
- Injected `HttpClient` for HTTP communication
- Configuration via `BASE_PATH` provider (routes to proxy in dev)
- Interface-based contracts (e.g., `CardServiceInterface`)
- Auto-generated from OpenAPI spec using `generate-api.sh`

**Do not edit API service files** - they are auto-generated. Modify via OpenAPI spec instead.

## Critical Developer Workflows

### Starting Development
```bash
npm start  # Runs ng serve with proxy-config.json (proxies /api to localhost:5001)
```

### Building & Testing
```bash
npm run build       # Production build (1MB max bundle, strict budgets)
npm run watch       # Development watch mode
npm test            # Karma + Jasmine unit tests
npm run lint        # ESLint auto-fix
npm run gen-api     # Regenerate API services from OpenAPI spec
```

### API Configuration
- **Proxy**: `proxy.conf.json` routes `/api` requests to backend (`http://localhost:5001`)
- **BASE_PATH**: Provided in `app.config.ts` as empty string to use proxy
- **Backend URL**: Update proxy config OR `BASE_PATH` provider value when deploying

## Project-Specific Conventions

### Component Structure
- All components are **standalone** (no `NgModule` decorator)
- CSS: **SCSS** (configured in `angular.json`)
- Routing: Lazy-loaded via `loadComponent` in `app.routes.ts`
- Example: `src/app/home/home.ts`

### Authentication Pattern
- **Guard**: `AuthGuard` checks `AuthService.currentUser$` before route activation
- **Persistence**: User session stored in `localStorage` under key `lernapp_currentUser`
- **Logout**: Clears localStorage and redirects to `/login`

### Internationalization (i18n)
- Uses `@ngx-translate` with JSON files
- Supported languages: English (`en.json`), German (`de.json`)
- Browser language auto-detected on app init (fallback: `en`)
- Example usage: Inject `TranslateService` and call `translate.use('de')`

### Material Design
- Uses Angular Material with SCSS theming in `src/theme/material-vars.scss`
- Variables applied globally in `src/styles.scss`

## Integration Points

### With API Services
```typescript
// Inject service interface, not concrete class
constructor(cardService: CardService) {}

// Services return Observables - use async pipe or subscribe
this.cardService.apiCardsDeckIdGet(deckId).subscribe(cards => {...});
```

### Authentication Headers
- **Automatic**: API services inherit auth credentials via shared `HttpClient`
- **Manual interceptor needed**: Add HTTP interceptor in `app.config.ts` to inject bearer tokens if required

### Error Handling
- No global error handler configured - handle errors at subscription level
- Consider adding HTTP error interceptor for centralized error management

## Testing Conventions

- **Unit tests**: Alongside components (e.g., `home.spec.ts`)
- **Framework**: Karma + Jasmine
- **Test services**: Mock injected services via `TestBed.overrideProvider()`
- **Example pattern**: See `app.spec.ts` for component testing baseline

## Build & Deployment Notes

- **Bundle budgets**: 500KB initial (warning), 1MB (error); 4KB style component (warning), 8KB (error)
- **Standalone app**: No NgModule bootstrap - uses `app.ts` as root component
- **Serving**: Configure `ng serve` proxy or update `BASE_PATH` provider for backend URL
- **Production**: All components lazy-loaded on routes to optimize bundle splitting

## Common Tasks

**Adding a new page**: Create component in `src/app/<page-name>/`, add route in `app.routes.ts`, protect with `AuthGuard` if needed.

**Calling an API service**: Import service, inject in component, call method returning Observable, use async pipe or subscribe.

**Adding translations**: Add keys to `src/assets/i18n/en.json` and `de.json`, use `translate` pipe in templates.

**Regenerating API services**: Run `npm run gen-api` when OpenAPI spec changes (reads `openapitools.json` config).
