<h1 align="center">KinoZalla</h1>
<h3 align="center">Bring the cinema to your home, for free!</h4>

## <h4 align="center">[http://kinozalla.ml/](http://kinozalla.ml/ "Live View")</h4>

## Screenshots

![Home Page](https://i.imgur.com/tVEmoYe.png)
![Search Results](https://i.imgur.com/CkgobQV.png)
![Torrent Results](https://i.imgur.com/LAjoNz6.png)
![Trailer Preview](https://i.imgur.com/G9gLZnH.png)
![Watch Trailer](https://i.imgur.com/7qUN80n.png)
![Watch movie](https://i.imgur.com/qw0cbjq.png)

## Built With

- React
- JQuery
- SocketIO
- Node
- Express
- MongoDB
- Worker Threads

## What this offers

- [x] Automatically search for torrents supported by your browser.
- [x] Stream the torrent while being downloaded in real time.
- [x] Supports use of multiple free  API keys. 
- [x] Easy to use design.
- [x] Up-to-date IMDb support.
- [x] Trailers of movies included.
- [x] Can save your favorite movies.

## Prerequisites
- NodeJS & NPM Installed.
- MongoDB Installed.
- Git installed.
- [IMDB API key](https://imdb-api.com/Identity/Account/Register)

## Get it up and running on your local network

### Setup the project
```
git clone https://github.com/StiliyanKushev/home-cinema-provider.git
cd home-cinema-provider
cd backend && npm i && cd ../ && npm i
```

### Edit /home-cinema-provider/src/apiKeys.json
```
[
	"k_o5lh****",
	"k_2s7o****",
	"k_ypjh****",
	"k_l38v****",
	...
	"k_k337****"
]
```

### Start the project
```
npm run start
```
#### Open a new terminal window
```
cd home-cinema-provider/backend
npm start
```
