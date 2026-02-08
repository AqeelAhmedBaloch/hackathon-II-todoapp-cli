# Implementation Plan: Phase 4 (AI & Mobile Integration)

I will implement AI-powered task management and PWA features by building on the Phase-3 foundation.

## Proposed Changes

### [NEW] AI Module (Backend)
- **Endpoint**: `POST /api/ai/suggest`
- **Logic**: Use a prompt template to ask an LLM (Gemini) for classification.
- **Fallback**: Simple keyword-based classification if AI is unavailable.

### [NEW] PWA Integration (Frontend)
- **Vite Plugin**: Install `vite-plugin-pwa`.
- **Manifest**: Configure icons, theme color, and installable status.
- **Service Worker**: cache-first strategy for static assets.

### UI Enhancements
- **TaskForm**: Add "AI Suggest" button.
- **Responsiveness**: Audit all components for mobile (spacing, font-sizes).

## Step-by-Step Execution
1.  **AI Setup**: Create AI service in backend and add route.
2.  **PWA Setup**: Configure Vite for PWA support.
3.  **Frontend Integration**: Update `TaskForm` to consume AI suggestions.
4.  **Verification**: Test "Install app" on mobile/desktop and verify AI responses.

## User Review Required
> [!IMPORTANT]
> To use real AI (Gemini), you will need to provide a `GEMINI_API_KEY`. Otherwise, I will implement a "Smart Mock" that uses keywords.

## Verification Plan
1.  **AI**: Curl the suggestion endpoint with various task titles.
2.  **PWA**: Run Lighthouse audit to verify PWA compliance.
3.  **Mobile**: Test UI in Chrome DevTools mobile emulator.
