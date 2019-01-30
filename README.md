# Plotly Candlestick Charts

Node script that takes currency pairs and returns a chart using Plotly charts and AlphaVantage data

## Example output
![Example output Plotly Candlestick chart](https://i.imgur.com/X7ZlMlul.png)

### HOW TO RUN

- go to: [AlphaVantage](https://www.alphavantage.co/) and sign up for an api key
- go to: [Plotly](https://plot.ly/) and sign up for an api key
- create a .env file in the root and add the keys there
- run `npm i`
- run `npm start`

## Goals

- Using free data...
- Create a candlestick chart for FOREX assets
- Then save an image of that chart for later usage ie BOT

### TODO

- commonJS all the thing(s)
- Parameterize the currency Pairs
- return other types of assets

### DEPENDENCIES

- axios
- dotenv
- fs
- plotly
