# Google Drive Vocabulary Chrome Extension

This Chrome extension helps you build your vocabulary by translating English words to Korean and saving them to a Google Doc in your Google Drive.

## Features

- **Translate English to Korean:** Utilizes Google's translation capabilities to provide accurate translations.
- **Save to Google Drive:** Automatically saves translated words, their phonetic transcription, and meanings to a Google Doc.
- **Daily Vocabulary Lists:** Organizes your vocabulary by date, creating a new Google Doc for each day.
- **Append to Daily List:** Adds new words to the existing document for the day, creating a running list.

## How to Install

1.  **Download the Extension:** Download the latest release from the [GitHub Releases](https://github.com/your-username/your-repo/releases) page.
2.  **Unzip the File:** Unzip the downloaded file to a location of your choice.
3.  **Configure the Client ID:** Before loading the extension, you must configure your own Google OAuth 2.0 Client ID. Follow the steps in the **Configuration** section below.
4.  **Enable Developer Mode in Chrome:** Open Chrome and navigate to `chrome://extensions`.
5.  **Load the Extension:** Click on "Load unpacked" and select the unzipped directory.
6.  **Authenticate with Google:** The first time you use the extension, you will be prompted to authenticate with your Google account to grant access to Google Drive.

## Configuration: Setting up Google OAuth 2.0

To use the Google Drive integration, you need to create your own OAuth 2.0 Client ID.

1.  **Go to the Google Cloud Console:** Navigate to the [Google Cloud Console](https://console.cloud.google.com/).
2.  **Create a New Project:** If you don't have one already, create a new project.
3.  **Enable APIs:**
    *   Go to "APIs & Services" > "Library".
    *   Search for and enable the **Google Drive API**.
    *   Search for and enable the **Google Docs API**.
4.  **Configure OAuth Consent Screen:**
    *   Go to "APIs & Services" > "OAuth consent screen".
    *   Choose **External** and click "Create".
    *   Fill in the required fields (App name, User support email, Developer contact information).
    *   On the "Scopes" page, you don't need to add any scopes.
    *   On the "Test users" page, add the Google account(s) you will use to test the extension.
5.  **Create Credentials:**
    *   Go to "APIs & Services" > "Credentials".
    *   Click "Create Credentials" and select **OAuth client ID**.
    *   For "Application type", select **Chrome app**.
    *   Enter a name for your client ID.
    *   For **Application ID**, you first need to load the extension in Chrome to get its ID:
        *   Follow steps 4 and 5 in the "How to Install" section.
        *   Once the extension is loaded, you will see its ID on the extension card in `chrome://extensions`. Copy this ID.
    *   Paste the copied Application ID into the "Application ID" field in the Google Cloud Console and click "Create".
6.  **Update the Manifest File:**
    *   You will now see your Client ID. Copy it.
    *   Open the `chrome/manifest.json` file in this project.
    *   Replace `"YOUR_CLIENT_ID.apps.googleusercontent.com"` with the Client ID you just copied.
    *   Save the file.
7.  **Reload the Extension:** Go back to `chrome://extensions` and click the reload button on the extension card.

## How to Use

1.  **Translate a Word:** Highlight an English word on any webpage.
2.  **Right-click and Translate:** Right-click on the highlighted word and select "Translate and Save to Google Drive" from the context menu.
3.  **View Your Vocabulary List:** The translated word will be automatically added to a Google Doc in your Google Drive, named with the current date (e.g., "Vocabulary - YYYY-MM-DD").

## Development Plan

This project will be developed in the following phases:

1.  **Core Extension Setup:** Create the basic structure of the Chrome extension, including the `manifest.json`, background scripts, and content scripts.
2.  **Google Drive Integration:** Implement OAuth 2.0 to authenticate with the Google Drive API and add functionality to create and manage Google Docs.
3.  **Translation Functionality:** Integrate a translation service to translate English words to Korean.
4.  **CI/CD with GitHub Actions:** Set up a GitHub Actions workflow to automate the build and release process.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

This project is licensed under the terms of the MIT license.
