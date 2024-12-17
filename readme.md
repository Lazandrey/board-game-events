added games to database
adeded routes for games with url parameters
http://localhost:3002/game?title=War&sortField=rating&start=10&gamesOnPage=2
http://localhost:3002/game?title=&sortField=rating&start=40&gamesOnPage=20

title - find by title
sortField - sort by field  
start - start index
gamesOnPage - offset by gamesOnPage

So will be possible to find games by title and sort them by rating and divide them into pages
