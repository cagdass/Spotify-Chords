See [Abdullah Wali](https://github.com/AbdullahWali)'s [Spotify-Lyrics](https://github.com/AbdullahWali/Spotify-Lyrics) for the original project.

# Spotify Chords
Hello musicians, this tool will fetch the chords/tabs for the song you're currently playing on Spotify and display it on a webpage. Once you change the song you're currently playing, simply refresh the page and you'll instantly get the chords/tabs of the new song being played. You don't have to use your PC to play the music, you can use Spotify on your phone and the tool will still detect the song as long as your device is connected to the internet.

## Installation
Follow those (hopefully) simple steps to set up Spotify Lyrics:

1. Install [NodeJS](https://nodejs.org/en/).
2. [Register a new application](https://developer.spotify.com/my-applications) on Spotify using your login details:
   Choose a silly name and description for the application. Notice the fields ClientID and Client Secret. We will need those soon. 
3. While in the same window (Spotify Application), add the following url to Redirect URIs: `http://localhost:3005/callback`
4. [Download](https://github.com/cagdass/Spotify-Chords/archive/master.zip) and extract this repository.
5. Open the config.js file and change ClientID and ClientSecret to the values obtained earlier. (keep them in quotes).
6. Open the terminal in the root directory of this project and run this command:
`npm install`.
7. Run `npm start` on the terminal to run Spotify Lyrics.

## Usage
After setting it up for the first time, you only need to use `npm start` to run the tool.

## Enjoy!!
Open an issue in github if you encounter any bug!


