###Steps to run project:

(1) clone from GitHub
(2) navigate to the top-level directory and run `npm install` in the terminal
(3) run `npm run buildProd`
(4) open `index.html` in the top-level directory

NOTE: This project uses an API that publishes events via the JavaScript EventSource API. This feature is available in all major browsers EXCEPT Microsoft Edge - further work would include an AJAX API fallback, but I didn't have time to add this.


#### required features
- [ x ] Should be built with Javascript, as single page application or isomorphic app
- [ x ] The ability to see a list of symbols with Name, Price, Market Time, Intraday High/Low
- [ x ] Tickers shouldn't be hardcoded, you can pull from a JSON file, Use a 3rd party API or Craft your own API
- [ x ] Should be able to sort the page by Gainers/Losers
- [ x ] Should be able to click on a symbol and view it on it's own page

## Clear Street Evaluation
- How much time did you spend on the exercise, what parts took longer?
  Significantly longer than two hours. Styling probably took the longest, but I also ran into a snag with state. I'm not using Redux because the boilerplate is hefty and my fetches need to do different things. For instance, when I'm first adding a component, I need to set up an SSE feed and register a callback. All of this can be done with Redux thunk, but I think the file structure would have gotten bloated very quickly. Now I'm handling all of this with a few storage objects that get passed around, which each have a pub/sub architecture. API fetches register EventSources and request responses with those state objects. When a component mounts, it subscribes to the symbol it needs, which gives it a fresh copy of whatever was in that storage object. It also gets registered in the subscriber list for that symbol, so that SSE events can publish to it. Promise.all() implementation makes sure initialization fetches don't trigger tons of rerenders, and also allows me to prevent component updates until all data has been fetched and is safely in the storage object. This prevents flickering and obviates the need for some null checks.

- What were the hard parts, what parts did you enjoy most?
  I love managing state without Redux. It's always been my opinion that Redux is verbose, bloated, and a bit of a black box on the React end (whenever you pass invisible props by cloning the React.children of a wrapper component, your users have no idea what's going on under the hood). That said, I recognize that it provides a common framework for developers and a predictable tool for state management, and is indespensable in large projects. I enjoy doing projects like this with my own state management in the hopes that I might be able to parlay that knowledge into a library that improves upon Redux (soon!).

  I built my own zoomable graphs for this. Didn't have time to add data labels, but I love working with SVG in React. I also spent a lot of time on various UX consideration (How should a blur event effect the contents of an input? How should search results be presented? How should responsive design be implemented for small screens? Can animations improve the clarity or experience of the UI?).

- What parts of the code are you proud of, were there any novel solutions you created?

  State management and SSE feed integration, general design and UX implementation.

- Is your code tested? Why/why not? How would you test it (or test it better)?

  The code is heavily tested for UX, but NOT for API compatibility. This version uses free test data :) from IEX, and was coded after market hours. It's hard to say how this will perform during the day today so bear with me. The API is still a bit buggy too, so there may be some instances where an unexpected `null` entry breaks something.
