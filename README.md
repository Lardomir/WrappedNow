# WrappedNow  WrappedNow

> ### Spotify Wrapped, but whenever and wherever you want it.

WrappedNow is a mobile application that gives you on-demand access to your Spotify listening statistics. Instead of waiting for the end of the year, you can view your top tracks, top artists, and listening history at any time, enriched with unique visualizations and location-based data.

## ✨ Features

* **On-Demand Stats**: Instantly view your most-listened-to tracks and artists from various timeframes.
* **Listening History**: Browse your recently played songs.
* **Secure Spotify Login**: Authenticates directly and securely with your Spotify account using the official OAuth flow.
* **Cross-Platform**: Built with Apache Cordova to run on both Android and iOS devices from a single codebase.

*(More features like location and activity-based insights are coming soon!)*

## 💻 Tech Stack

* **Framework**: [Apache Cordova](https://cordova.apache.org/)
* **Backend & Database**: [Firebase](https://firebase.google.com/) (using Firestore for cloud sync)
* **Authentication**: [Spotify Web API](https://developer.spotify.com/documentation/web-api) (Authorization Code Flow with PKCE)
* **Build Tool**: [esbuild](https://esbuild.github.io/) for fast JavaScript bundling.

## 🚀 Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) (which includes npm)
* [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/)
* [Android Studio](https://developer.android.com/studio) (for the Android SDK and emulator)
* A globally installed Cordova CLI:
    ```bash
    npm install -g cordova
    ```

### Setup

1.  **Clone the repository:**
    ```bash
    git clone [URL_TO_YOUR_REPOSITORY]
    cd wrappednow
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Spotify Credentials:**
    * Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
    * Create an app and copy your **Client ID**.
    * In the app settings, add `ch.example.wrappednow://callback` as a **Redirect URI**.
    * Paste your Client ID into the `spotifyConfig` object in the `src/app.js` file.

4.  **Add the Android Platform:**
    ```bash
    cordova platform add android
    ```
    *(This will also run the hook to apply necessary Gradle fixes).*

### Running the App

1.  **Start the development server:**
    This command will watch for changes in `src/app.js` and automatically rebuild `www/js/bundle.js`.
    ```bash
    npm run dev
    ```

2.  **Run on an Android Emulator:**
    Open a **new terminal window** and run:
    ```bash
    cordova emulate android
    ```
