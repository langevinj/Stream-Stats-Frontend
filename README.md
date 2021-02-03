# Stream Stats :bar_chart: :musical_note:
A data visualization tool for streaming data. Try it out: [Stream Stats](https://stream-stats-frontend.herokuapp.com/).

## Table of Contents
* [Introduction](#introduction)
* [Supported Platforms](#supported-platforms)
* [Technologies](#technologies)
* [Using the App](#using-the-app)
* [Testing](#testing)
* [Backend](#backend)

## Introduction
Streams Stats was built with the goal of helping artists, record labels, and musicians compare data from a variety of streaming services in one central location. For the backend repository, which includes details on the API created for this project, [follow this link](https://github.com/langevinj/Stream-Stats-Backend).

At this time Stream Stats will generate charts for users based on the data they provide. These charts will display information from multiple streaming services.

## Supported Platforms :loud_sound:

In its current form, this application can accept data from [Distrokid](https://distrokid.com/), [Spotify for Artists](https://artists.spotify.com/), and [Bandcamp](https://bandcamp.com/).

The services this app can currently compare are:
* Bandcamp
* Spotify
* Apple Music
* Amazon
* Deezer
* iTunes
* Google
* Tidal
* TikTok
* Youtube

## Technologies :open_file_folder::
* Node.js
* React.js
* Puppeteer
* Jest
* PostgreSQL
* ApexCharts
* Bootstrap

## Using the App:
### Importing Data
[![](Import-Data.gif)](https://www.youtube.com/embed/5bGsiBzUQ5U)

Users paste data from the platforms they choose into the inputs of the data input page. There is also an option to login to your Spotify for Artists account through the application account and allow it to scrape the statistics.

### Viewing Your Data
![](Chart-Example.gif)

## Testing :white_check_mark::
Enter the correct directory:
```
cd src
```

Then run all tests like so:
```
npm test a 
```

Or individually:
```
npm test NAME_OF_FILE
```

## Backend:arrows_counterclockwise:: 
For information concerning the API created for this app or any other information regarding the backend. You can [find the repository here](https://github.com/langevinj/Stream-Stats-Backend).


