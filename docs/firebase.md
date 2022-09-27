# Firebase

Firebase provides authentication through GitHub SSO and a database through Firestore. It requires some configuration before getting started.

## Local development

When the repository is cloned the first time, we set up some default configuration that allows people to run the site locally without worrying about authentication.

### Using Firebase locally

1. Make sure the following environment variables are present (copy-paste from `.env.sample`):

```
FIREBASE_CLIENT_PROJECT_ID="demo-open-source-hub-8e6a5"
FIRESTORE_EMULATOR_HOST="localhost:8080"
FIREBASE_AUTH_EMULATOR_HOST="localhost:9099"
```

2. Run the Firebase emulator locally:

```
yarn run dev:firebase
```

3. In another terminal window, run the app as usual:

```
yarn run dev
```

You should now be able to use the Firebase authentication flow in the app.

#### Exporting data

By default, the Firebase emulator wipes all the data upon exit. Use the command below to export emulator data into the `seed` directory:

```
npx firebase emulators:export seed --project demo-open-source-hub-8e6a5
```

### Using Firebase locally against our production environment

## Credentials for production

On production, the following environment variables are required:

```
FIREBASE_SERVICE_ACCOUNT_KEY # This is a stringified JSON object
FIREBASE_CLIENT_API_KEY
FIREBASE_CLIENT_AUTH_DOMAIN
FIREBASE_CLIENT_PROJECT_ID
SESSION_COOKIE_SECRET
```

Make sure that the emulator variables are **not** present:

```
FIRESTORE_EMULATOR_HOST
FIREBASE_AUTH_EMULATOR_HOST
```

And disable the local env check in `firebase.server.ts`.

## Architecture

We use the following packages:

- `firebase-tools`: for local development. Gives users access to emulators that can fake authentication servers and databases.
- `firebase`: provides client-side authentication. When people log in, we open a popup through GitHub where they can link their account.
- `firebase-admin`: a set of tools that allows elevated access to Firebase functionality. For example, it allows us to access all the data in Firestore and verify session tokens on the server.
