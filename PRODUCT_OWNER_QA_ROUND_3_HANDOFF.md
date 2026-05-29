# Tech Magazine Product Owner QA Resume - Round 3

Date prepared: May 26, 2026  
Platform: Tech Magazine staging through Cloudflare Tunnel  
Purpose: Product Owner retest after Round 2 fixes

## 1. Staging Links

Use these links for Round 3 testing:

- Public website: https://abc-biological-graphical-ant.trycloudflare.com/?cache=round3
- Public search: https://abc-biological-graphical-ant.trycloudflare.com/search?page=1&limit=6
- Public videos: https://abc-biological-graphical-ant.trycloudflare.com/videos
- Public podcasts: https://abc-biological-graphical-ant.trycloudflare.com/podcasts
- Public reviews: https://abc-biological-graphical-ant.trycloudflare.com/reviews
- Public events: https://abc-biological-graphical-ant.trycloudflare.com/events
- Public jobs: https://abc-biological-graphical-ant.trycloudflare.com/jobs
- Public startups: https://abc-biological-graphical-ant.trycloudflare.com/startups
- Public devices: https://abc-biological-graphical-ant.trycloudflare.com/devices
- Public feed: https://abc-biological-graphical-ant.trycloudflare.com/feed
- Public IT rooms: https://abc-biological-graphical-ant.trycloudflare.com/it-rooms
- Reader sign in/register: https://abc-biological-graphical-ant.trycloudflare.com/account
- Admin login: https://abc-biological-graphical-ant.trycloudflare.com/admin/login
- Admin dashboard: https://abc-biological-graphical-ant.trycloudflare.com/admin
- Health check: https://abc-biological-graphical-ant.trycloudflare.com/api/health

Important: this Cloudflare tunnel works only while the developer laptop, local server, and tunnel process are running. For permanent testing, the project still needs deployment to a VPS or managed host with a real domain and SSL.

Admin note: direct admin pages such as /admin, /admin/users, and /admin/articles are protected. They open only after signing in through /admin/login. If opened while logged out, they should redirect to the login page.

Emergency fallback if the Cloudflare URL is blocked on a tester network:

- Fallback public website: https://ripe-months-remain.loca.lt
- Fallback admin login: https://ripe-months-remain.loca.lt/admin/login
- If LocalTunnel shows a safety page, enter tunnel password: 185.104.70.187

## 2. Test Credentials

These are temporary Round 3 staging credentials only.

### Admin

- Email: admin@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Use for: full admin dashboard, users, roles, articles, workflow, imports, media, newsletter, analytics, security, operations.

### Editor

- Email: editor@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Use for: editorial and content workflow checks.
- Expected restriction: should not access high-risk admin-only areas such as users, roles, and security administration.

### Reporter

- Email: po.reporter@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Use for: reporter workflow checks.
- Expected restriction: should only access limited newsroom/content areas.

### Second Reporter

- Email: qa.reporter@techmag.local
- Password: stored privately in `.qa-admin-credentials.json`; request from project owner.
- Use for: assignment, collaboration, and workflow retesting.

### Reader Account

The public reader account can be created directly from:

https://abc-biological-graphical-ant.trycloudflare.com/account

Recommended reader test account:

- Name: Round 3 Reader
- Email: round3.reader@example.com
- Password: create from the public reader account screen or request the current QA reader account from the project owner.

If the email already exists, create another email such as round3.reader.2@example.com.

## 3. Round 2 Issues Retest Checklist

### 1. P0 - Admin Credentials Exposed on /admin

Test:

1. Open a private/incognito browser window.
2. Go directly to https://abc-biological-graphical-ant.trycloudflare.com/admin
3. Do not log in first.

Expected result:

- The page redirects to the admin login page.
- No admin email, password, helper credentials, reset token, or secret token is visible.
- The public site must not expose admin links or admin preview panels.

Current developer QA result:

- Passed in automated smoke test.
- Passed in client/admin separation audit.

### 2. P0 - Admin Cannot Create New User

Test:

1. Log in as Admin.
2. Open Admin > Users.
3. Create a new user with a unique email.
4. Assign a role.
5. Save the user.
6. Try creating the same email again.

Expected result:

- First user creation succeeds.
- Duplicate email does not crash the page.
- Duplicate email shows a clean validation message.
- Admin remains on a functional Users page.

Current developer QA result:

- Passed in automated smoke test.
- Passed in separated admin audit.
- Duplicate email validation is handled without a critical error.

### 3. P1 - Internal Newsroom Message Missing

Test:

1. Log in as Admin.
2. Open Admin > Workflow.
3. Find the Internal newsroom chat and Editorial notes section.
4. Post a message/note tied to an article or workflow.
5. Refresh the page.

Expected result:

- Internal newsroom message form is visible.
- Message/note can be posted.
- The workflow page remains stable.
- Real-time workflow channel is active.

Current developer QA result:

- Passed in automated smoke test.
- WebSocket workflow event passed.

### 4. P1 - Language Selector Does Not Translate or Switch RTL

Test:

1. Open the public website.
2. Use the language selector in the top navigation.
3. Change from English to Arabic.
4. Open an article page.

Expected result:

- The document switches to RTL direction for Arabic.
- Arabic language mode activates.
- Translated article content can load when translation exists.
- Switching back to English returns to LTR.

Current developer QA result:

- Arabic translation API passed.
- RTL language behavior passed in smoke test.

### 5. P1/P2 - Public Dark/Light Mode Toggle Not Visible

Test:

1. Open the public website.
2. Look at the top navigation.
3. Click the Dark/Light toggle.
4. Refresh the page.

Expected result:

- Theme toggle is visible to public readers.
- Theme changes between dark and light.
- Selected theme remains after refresh.

Current developer QA result:

- Theme toggle is present in public navigation.
- Public client audit passed.

### 6. P2 - Published Admin Article Does Not Appear on Public Site

Test:

1. Log in as Admin.
2. Open Admin > Articles.
3. Create a new article with a unique title, category, and content.
4. Publish it.
5. Open the public site.
6. Search for the article title.
7. Open the article from search results.

Expected result:

- Published article appears in public search.
- Article page opens publicly.
- Public page shows title, author, date, reading time, hero image area, sharing, comments, and related articles.

Current developer QA result:

- Passed in smoke test.
- Public article API and search confirm published articles are visible.

### 7. P2 - Editorial Note Missing in Workflow

Test:

1. Log in as Admin or Editor.
2. Open Admin > Workflow.
3. Find Internal newsroom chat and Editorial notes.
4. Add a note for an article/workflow item.

Expected result:

- Editorial notes are explicitly visible in the workflow section.
- The form posts internal notes/messages.
- The workflow dashboard keeps the note history visible.

Current developer QA result:

- UI label was adjusted after Round 2.
- Workflow post test passes.

## 4. Public Website QA Flow

### Homepage

Test:

1. Open the public website.
2. Check the top navigation.
3. Check breaking news banner.
4. Check live ticker.
5. Check featured stories.
6. Check trending area.
7. Check latest news and pagination/infinite-load areas.
8. Check sponsored/advertising blocks.
9. Check footer links.

Expected result:

- No empty or broken large sections.
- No overlapping text.
- Navigation stays usable on desktop and mobile widths.
- Cards, images, and buttons look consistent.

### Navigation

Test all public nav links:

- Home
- Search
- Sections
- Video
- Podcasts
- Reviews
- Live
- Newsletter
- Membership
- Community
- Leaderboard
- Alerts
- Profile
- Jobs
- Devices
- Events
- Startups

Expected result:

- Each link opens the correct section.
- No route shows a blank screen.
- No admin-only surface appears on the public client.

### Search

Test:

1. Search for AI.
2. Filter by category.
3. Filter by author.
4. Filter by tag.
5. Filter by date.
6. Sort by popularity.
7. Use pagination.

Expected result:

- Search results load.
- Filters change results.
- Pagination works.
- No duplicated audit/test category clutter should appear.

### Article Pages

Test:

1. Open multiple articles.
2. Check title, subtitle, category, author, publish date, reading time, and hero image.
3. Use share buttons.
4. Scroll and check reading progress bar.
5. Add a comment as reader.
6. Check related articles.
7. Try bookmarking after reader login.

Expected result:

- Article layout is readable and polished.
- Comments submit to moderation.
- Bookmark works for logged-in reader.

### Reader Account

Test:

1. Create a reader account.
2. Sign in.
3. Edit profile.
4. Save an article.
5. Follow an author.
6. Open notifications.
7. Log out and sign in again.

Expected result:

- Account creation and sign-in work.
- Profile page is polished.
- Saved articles, followed authors, notifications, and reader progress update correctly.

## 5. Admin QA Flow

### Admin Login and Security

Test:

1. Open /admin without login.
2. Confirm redirect to /admin/login.
3. Log in as Admin.
4. Log out.
5. Try back button to protected admin pages.

Expected result:

- Protected pages redirect when logged out.
- No credentials are displayed.
- No signup exists on admin login.
- Admin is sign-in only.

### Users and Roles

Test:

1. Open Users.
2. Create user.
3. Assign role.
4. Search/filter users if available.
5. Open Roles.
6. Create a new role.
7. Select multiple privileges.
8. Save role.
9. Search for the role.
10. Attempt duplicate role name.

Expected result:

- User creation works.
- Duplicate user email does not crash.
- Role creation works.
- Privileges save correctly.
- Duplicate role name is handled cleanly.

### Articles CMS

Test:

1. Create article.
2. Save draft.
3. Add SEO title and description.
4. Add category, tags, image URL, and content blocks.
5. Schedule article.
6. Publish article.
7. Duplicate article.
8. Archive article.
9. Restore article.
10. Confirm public search visibility after publish.

Expected result:

- CMS actions work without critical errors.
- Published content appears publicly.
- Draft/archived content does not appear as normal published content unless intended.

### Editorial Workflow

Test:

1. Create assignment.
2. Add task.
3. Add deadline/calendar item.
4. Submit article to review.
5. Approve/reject item.
6. Add editorial note.
7. Send internal newsroom message.
8. Check workflow overview.

Expected result:

- Workflow items save.
- Approval queue works.
- Editorial note and internal message are visible and usable.

### News Imports

Test:

1. Open News Imports.
2. Check sources.
3. Enable/disable a source.
4. Open Inspection Queue.
5. Approve/reject imported story.
6. Open Source Performance Dashboard.

Expected result:

- Source controls are usable.
- Risk/inspection workflow is visible.
- Source performance shows imported count, rejected count, pending inspection count, duplicate rate, and average risk score.

### Media

Test:

1. Open Media.
2. Upload or add media.
3. Rebuild variants.
4. Check media list.

Expected result:

- Media library remains stable.
- Image/video/audio areas load.
- Variant rebuild does not crash.

### Newsletter

Test:

1. Subscribe from public site.
2. Verify subscriber appears in admin.
3. Create a campaign.
4. Check email outbox.

Expected result:

- Subscription flow works.
- Campaign creation works in dummy/manual email mode.
- No real sending is expected until a production email provider/domain is configured.

### Monetization

Test:

1. Open Monetization.
2. Create sponsor campaign.
3. Create ad placement.
4. Create affiliate item.
5. Check memberships.
6. Check revenue dashboard.

Expected result:

- Manual monetization mode works.
- No payment gateway is expected yet.
- Revenue and sponsor pages remain stable.

### Analytics, SEO, Security, Operations

Test:

1. Open Analytics.
2. Open SEO.
3. Open Security.
4. Open Operations.
5. Open Database.
6. Open Infrastructure.
7. Open Launch.

Expected result:

- Dashboards load.
- Charts/cards are visible.
- Audit logs, sessions, backups, and system checks are visible.
- No sensitive credentials are exposed.

## 6. Role-Based QA Flow

### Admin Role

Expected:

- Can access all dashboard areas.
- Can create users and roles.
- Can manage system/security/operations.

### Editor Role

Expected:

- Can access editorial/content areas.
- Cannot access admin-only users, roles, or security operations.

### Reporter Role

Expected:

- Can access limited newsroom/content creation areas.
- Cannot access system, security, users, roles, or infrastructure controls.

## 7. APIs to Spot Check

Open these in the browser:

- https://abc-biological-graphical-ant.trycloudflare.com/api/health
- https://abc-biological-graphical-ant.trycloudflare.com/api/bootstrap?page=1&limit=5
- https://abc-biological-graphical-ant.trycloudflare.com/api/search?query=ai&page=1&limit=5
- https://abc-biological-graphical-ant.trycloudflare.com/api/events?page=1&limit=3
- https://abc-biological-graphical-ant.trycloudflare.com/api/jobs?page=1&limit=3
- https://abc-biological-graphical-ant.trycloudflare.com/api/videos

Expected result:

- APIs return JSON.
- Health check returns ok true.
- Pagination parameters return limited results.
- Protected admin APIs should require authentication.

## 8. Mobile and Responsive QA

Test:

1. Open public site at mobile width.
2. Open admin at tablet/desktop width.
3. Test navigation, search, article, reader profile, videos, podcasts, jobs, and events.
4. Toggle dark/light mode.
5. Switch to Arabic.

Expected result:

- Public site should be mobile-friendly.
- Admin is mainly desktop/tablet oriented but should remain usable.
- No text overlap, clipped buttons, or inaccessible controls.

## 9. Current Developer QA Evidence

Latest automated QA completed before this handoff:

- Smoke test: 243/243 passed.
- Client/admin separation audit:
  - Client: 79/79 passed.
  - Admin: 168/168 passed.
- Tunnel health check: passed.

These tests covered:

- Admin auth and protected redirects.
- No admin credential exposure on login/root.
- No secret token leak on public/admin pages.
- Public API health and content APIs.
- Reader account flow.
- Newsletter flow.
- Bookmarks, follows, comments, community, jobs, events.
- Admin articles, workflow, news imports, source performance, media, newsletter, monetization, roles, users, SEO, analytics, security, operations.
- WebSocket workflow message event.
- Language translation API and Arabic article endpoint.

## 10. Known Non-Functional / Deployment Items Still Pending

These are not product UI bugs, but they remain before real launch:

1. Deploy to a permanent VPS or managed host.
2. Attach real domain and SSL.
3. Configure production email provider and verified sender domain.
4. Configure real push notification production credentials.
5. Configure real analytics providers if required.
6. Configure production storage/CDN for media.
7. Configure production Redis/PostgreSQL if moving beyond local SQLite staging.
8. Rotate any real external credentials that were ever shared outside the private environment.

## 11. Product Owner Reporting Template

For every issue found, please report:

- Severity: P0, P1, P2, P3
- Area: Public, Admin, Reader, Workflow, API, Mobile, Security, Design
- URL:
- Login used:
- Steps to reproduce:
- Expected result:
- Actual result:
- Screenshot or screen recording:
- Browser and device:

Severity guidance:

- P0: security issue, crash, cannot log in, cannot create critical records.
- P1: major user journey broken, content not visible, role restriction wrong.
- P2: important feature missing, confusing UI, workflow friction.
- P3: polish, copy, spacing, low-risk visual issue.

## 12. Final Round 3 Focus

Please focus this QA round on:

1. Confirming the seven Round 2 issues are fixed.
2. Testing real journeys instead of only page loading.
3. Testing public and admin as separate systems.
4. Testing role restrictions with Admin, Editor, and Reporter.
5. Checking the visual polish of major pages.
6. Reporting only reproducible issues with steps and screenshots.


