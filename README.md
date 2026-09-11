<<<<<<< HEAD
# Go Go Education — multi-page website

Unzip go-go-education-multipage.zip. Upload the entire folder containing index.html to your EXISTING Netlify project's manual deploy area. Include all HTML, CSS, JS and assets files. No build command or installation required. For repository deployment publish `.`.

Pages: index.html, about.html, programs.html, news.html, success.html, admissions.html, faq.html, portal.html. News details use article.html?slug=study-abroad-five-questions. Browser Back/Forward and direct URLs work normally.

EDIT CONTENT: content.js contains hero text/photos, programs, stories, contact details and news. Other headings, Admissions and FQ&A text are in the matching HTML files. Update header/footer in each HTML file when editing the menu. styles.css, home-layout.css and pages.css control styling.

BANNER: assets/web-banner.png is your original 2560 x 280 PNG, displayed at its original ratio. Replace this file to change the static banner. Photos load from Unsplash and fonts from Google Fonts, so they need internet access.

ADD NEWS: Add an object to the news array in content.js using an existing item as a template. Fields: slug, tag, title, image, meta, body. Use a unique slug and keep it unchanged after publication. Use assets/your-photo.jpg for local photos. Separate body paragraphs with \n\n. Put newest items first. Pagination automatically grows with article count; newsPageSize is currently 2. Upload changed files to Netlify after editing. No CMS or admin dashboard is included.

CONTACT: Set contact.email to your real inbox and update contact.note before launch. The consultation button opens the visitor's email application; there is no booking backend. Replace illustrative stories and unconfirmed event placeholders with approved agency information.

Verified: desktop/mobile navigation, pagination, news details, program dialogs, search, success carousel and contact setup message. This folder is the updated website; the live Netlify site changes only after you deploy it.

STUDENT PORTAL (portal.html): students sign in with Facebook (or Google) and see their application progress, visa status, document checklist and advisor notes. Staff sign in with the same page and get a dashboard to update every student. Powered by Firebase Authentication + Firestore (free tier). Until Firebase is connected the page runs in preview mode with sample data. Setup steps are at the top of firebase-config.js; security rules are in firestore.rules. Files: portal.html, portal.css, portal.js, firebase-config.js, firestore.rules.

DARK MODE & ANIMATIONS: theme.css holds the dark palette (toggle in the nav, remembered per visitor) and the scroll-reveal animations; both are wired up in app.js.
=======
# GoGoHankuk
>>>>>>> d29b4f2a5b994a241e39334c765622b1c53523ed

LANGUAGES: the site is available in English, Myanmar and Korean (switch in the nav; remembered per visitor). Translations live in translations.js — the English text on the page is the key, so to fix a translation find the English sentence there and edit the value. Structured content (hero, programs, benefits, stories, office captions, network) is translated in the "content" section of the same file, matching content.js by position. News articles are English-only; add a "news" array under content to translate them. Burmese/Korean line spacing and fonts are set in theme.css under html[lang="my"] / html[lang="ko"].
