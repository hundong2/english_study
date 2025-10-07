// background.js

// When the extension is installed, create a context menu item.
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translateAndSave",
    title: "Translate and Save to Google Drive",
    contexts: ["selection"]
  });
});

// When the context menu item is clicked, this event listener will be triggered.
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translateAndSave") {
    const selectedText = info.selectionText;

    // 1. Get word data (phonetics, definition, etc.)
    getWordData(selectedText, (wordData) => {
      if (!wordData) {
        console.error("Could not retrieve data for the word:", selectedText);
        // Even if dictionary fails, try to translate
        wordData = { word: selectedText, phonetic: "", definition: "" };
      }

      // 2. Translate the word to Korean
      translateToKorean(selectedText, (translatedText) => {
        if (!translatedText) {
          console.error("Could not translate the word:", selectedText);
          return; // Stop if translation fails
        }

        // 3. Authenticate with Google and save to Drive
        chrome.identity.getAuthToken({ interactive: true }, (token) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            return;
          }

          getOrCreateFileId(token, (fileId) => {
            const formattedText = `${wordData.word} ${wordData.phonetic || ''}\n- ${translatedText}\n- ${wordData.definition || ''}`;
            appendToFile(token, fileId, formattedText);
          });
        });
      });
    });
  }
});

/**
 * Translates text from English to Korean using the MyMemory API.
 * @param {string} text - The text to translate.
 * @param {function} callback - The callback function to execute with the translated text.
 */
function translateToKorean(text, callback) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|ko`;
  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data && data.responseData && data.responseData.translatedText) {
        callback(data.responseData.translatedText);
      } else {
        callback(null);
      }
    })
    .catch(error => {
      console.error("Error during translation:", error);
      callback(null);
    });
}


/**
 * Fetches word data from the dictionaryapi.dev API.
 * @param {string} word - The word to look up.
 * @param {function} callback - The callback function to execute with the word data.
 */
function getWordData(word, callback) {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        const phonetic = data[0].phonetics.find(p => p.text)?.text || "";
        const definition = data[0].meanings[0]?.definitions[0]?.definition || "";
        callback({
          word: data[0].word,
          phonetic: phonetic,
          definition: definition
        });
      } else {
        callback(null);
      }
    })
    .catch(error => {
      console.error("Error fetching word data:", error);
      callback(null);
    });
}


/**
 * Searches for the daily vocabulary file. If it doesn't exist, it creates one.
 * @param {string} token - The OAuth 2.0 token.
 * @param {function} callback - The callback function to execute with the file ID.
 */
function getOrCreateFileId(token, callback) {
  const today = new Date().toISOString().slice(0, 10);
  const fileName = `Vocabulary - ${today}`;
  const query = `name='${fileName}' and mimeType='application/vnd.google-apps.document' and trashed=false`;

  // Search for the file.
  fetch(`https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data.files.length > 0) {
      // File exists, return the ID.
      callback(data.files[0].id);
    } else {
      // File doesn't exist, create it.
      const metadata = {
        name: fileName,
        mimeType: 'application/vnd.google-apps.document',
        parents: ['root']
      };
      fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(metadata)
      })
      .then(response => response.json())
      .then(file => {
        callback(file.id);
      });
    }
  });
}

/**
 * Appends text to a Google Doc.
 * @param {string} token - The OAuth 2.0 token.
 * @param {string} fileId - The ID of the file to append to.
 * @param {string} text - The text to append.
 */
function appendToFile(token, fileId, text) {
    const url = `https://docs.googleapis.com/v1/documents/${fileId}:batchUpdate`;
    const requests = [
        {
          insertText: {
            text: text + '\n\n', // Add extra newline for spacing
            endOfSegmentLocation: {}
          }
        }
    ];

    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requests })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Successfully appended to the document:', data);
    })
    .catch(error => {
        console.error('Error appending to document:', error);
    });
}
