/* EDIT THIS FILE to connect the Student Portal (portal.html) to your Firebase project.
   Until real values are entered the portal runs in "preview mode" with sample data.

   Setup (about 20 minutes, no coding):
   1. https://console.firebase.google.com → Add project → name it "gogo-portal".
   2. Project settings → General → "Your apps" → Web app (</>) → register → copy the
      firebaseConfig values into FIREBASE_CONFIG below.
   3. Build → Authentication → Get started → Sign-in method → enable "Facebook"
      (paste the App ID and App Secret from step 5) and optionally "Google".
      Under Settings → Authorized domains add your Netlify domain (e.g. gogohankuk.netlify.app).
   4. Build → Firestore Database → Create database (production mode) → Rules tab →
      paste the contents of firestore.rules → Publish.
   5. https://developers.facebook.com → My Apps → Create App → "Authenticate and request data
      from users with Facebook Login" → add the "Facebook Login" product.
      Facebook Login → Settings → Valid OAuth Redirect URIs → paste the redirect URI shown in
      the Firebase Facebook sign-in dialog (https://<project>.firebaseapp.com/__/auth/handler).
      App settings → Basic → add a Privacy Policy URL, then switch the app to "Live" mode so
      people other than the app's developers can log in.
   6. Make yourself (and any staff) an admin: log in to the portal once, then in Firestore
      create a document  admins/<your user UID>  with any field (e.g. role: "staff").
      Your UID is shown under Authentication → Users. Admins see every student and can
      update their progress; students only ever see their own record.
*/
window.FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000'
};

/* Sign-in providers to show. Facebook is the main option; Google is a handy fallback for
   students who don't use Facebook. Set google:false to hide it. */
window.PORTAL_PROVIDERS = { facebook: true, google: true };
