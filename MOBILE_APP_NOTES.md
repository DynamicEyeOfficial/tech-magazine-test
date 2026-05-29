# Mobile App Notes

This client build is API-first and now has a dedicated mobile API layer. The Expo/React Native app consumes the same account, content, notification, podcast, video, and analytics systems as the web client instead of duplicating content logic.

## Shared Content Model

Core objects to expose from the backend API:

- `Article`: id, slug, title, subtitle, excerpt, body, category, channel, author, tags, hero image, status, published date, reading time, views, SEO fields
- `Category`: id, slug, name, color, icon, description
- `Channel`: news, articles, interviews, top-10, videos, events, reports
- `Author`: id, name, role, avatar, bio, social links
- `Comment`: id, article id, parent id, author display name, body, status, created date
- `Subscriber`: id, email, segment, status
- `Media`: id, URL, type, caption, alt text

## Implemented Mobile Screens

- Personalized home feed
- Article reader
- Video detail
- Podcast detail
- Live event detail
- Saved/offline library
- Alerts and push registration
- Reader login/register/profile
- Favorite category preferences
- Voice narration controls
- Pull-to-refresh and swipe-back gesture

## Dedicated Mobile APIs

- `/api/mobile/config`
- `/api/mobile/home`
- `/api/mobile/offline`
- `/api/mobile/device`
- `/api/mobile/analytics`
- `/api/mobile/widgets`
- `/api/mobile/deep-link`

## Run The Mobile Shell

Install Expo dependencies inside `mobile/`, then run:

```bash
npm install
npm run start
```

For a device build, set:

```bash
EXPO_PUBLIC_API_BASE_URL=https://your-domain.com
```

Production app-store release still needs Apple/Google developer accounts, signing, real push credentials, and physical-device QA.

## Backend Decisions To Keep Mobile-Friendly

- Use stable slugs and IDs.
- Return JSON from every public content endpoint.
- Keep images responsive with multiple sizes.
- Keep article body structured enough for a native renderer.
- Add pagination/cursors for feeds.
- Add authentication tokens that can be used by web and mobile.
