###Steps to run project:

(1) clone from GitHub
(2) navigate to the top-level directory and run `npm install` in the terminal
(3) run `npm run buildProd`
(4) open `index.html` in the top-level directory

NOTE: This project uses an API that publishes events via the JavaScript EventSource API. This feature is available in all major browsers EXCEPT Microsoft Edge - further work would include an AJAX API fallback, but I didn't have time to add this.