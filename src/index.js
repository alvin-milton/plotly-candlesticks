const config = require('./config');
const fs = require('fs');
const axios = require('axios');
const plotly = require('plotly')(config.PLOTLY_USER_NAME, config.PLOTLY_KEY);

const CHARTIT = {}

const ENDPOINT = (FROMCURRENCY, TOCURRENCY) => {
  let jsobjpath = 'https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=' + FROMCURRENCY + '&to_symbol=' + TOCURRENCY + '&apikey=' + config.ALPHA_VANTAGE_KEY;
  return jsobjpath;
}
const getData = function (response) {
  return response.data;
}
const getImageOpts = {
  format: 'png',
  width: 1000,
  height: 500
};
const getTrace = (c, h, l, o, d) => {
  let trace = {};
  trace.close = c;
  trace.decreasing = {
    line: {
      color: '#7F7F7F'
    }
  };
  trace.high = h;
  trace.increasing = {
    line: {
      color: '#17BECF'
    }
  };
  trace.low = l;
  trace.open = o;
  trace.type = 'candlestick';
  trace.x = d;
  trace.xaxis = 'x';
  trace.yaxis = 'y';

  return trace;
};
const getLayout = (d, t, l, h) => {
  let marginSize = 10;
  let layout = {};
  layout.dragmode = 'zoom';
  layout.margin = {
    r: marginSize,
    l: marginSize,
    t: marginSize,
    b: marginSize
  };
  layout.showlegend = false;
  layout.xaxis = {
    autorange: true,
    domain: [0, 1],
    range: [d[0].toString(), d[d.length - 1].toString()],
    rangeslider: [d[0].toString(), d[d.length - 1].toString()],
    title: t,
    type: 'date'
  };
  layout.yaxis = {
    autorange: true,
    domain: [0, 1],
    range: [Math.min.apply(null, l), Math.max.apply(null, h)],
    type: 'linear'
  };

  return layout;
};
const getGraphOptions = (f, t, l) => {
  let graphOptions = {};
  graphOptions.filename = 'PriceChart' + '_' + f + '_' + t;
  graphOptions.fileopt = 'overwrite';
  graphOptions.layout = l;
  return graphOptions;
};

let dateArr = [];
let dateTimeArr = [];
let openArr = [];
let highArr = [];
let lowArr = [];
let closeArr = [];

CHARTIT.createChart = (FROMCURRENCY, TOCURRENCY) => {
  return axios.get(ENDPOINT(FROMCURRENCY, TOCURRENCY))
    .then((response) => {
      return response.data;
    })
    .then(function (data) {
      let arr = Object.keys(data).map(function (key) {
        return [key, data[key]];
      });
      let timeSeriesMeta = arr[0];
      let timeSeriesTitle = arr[1][0];
      let timeSeriesObj = arr[1][1];

      // have to reverse array, data returns with recent at 0 index
      let timeSeries = Object.keys(timeSeriesObj)
        .slice(0)
        .reverse()
        .map(function (key) {
          return [key, timeSeriesObj[key]];
        })
        .map(function (item) {
          let date = item[0].split(' ');
          dateTimeArr.push(item[0]);
          dateArr.push(date[0]);
          openArr.push(parseFloat(item[1]['1. open'], 10));
          highArr.push(parseFloat(item[1]['2. high'], 10));
          lowArr.push(parseFloat(item[1]['3. low'], 10));
          closeArr.push(parseFloat(item[1]['4. close'], 10));
        });

      let t = getTrace(closeArr, highArr, lowArr, openArr, dateArr);
      let d = [t];
      let l = getLayout(dateTimeArr, timeSeriesTitle, lowArr, highArr);
      let go = getGraphOptions(FROMCURRENCY, TOCURRENCY, l);

      // create graph
      plotly.plot(d, go, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
};

CHARTIT.getPic = (FROMCURRENCY, TOCURRENCY) => {
  return axios.get(ENDPOINT(FROMCURRENCY, TOCURRENCY))
    .then((response) => {
      return response.data;
    })
    .then(function (data) {
      let arr = Object.keys(data).map(function (key) {
        return [key, data[key]];
      });
      let timeSeriesMeta = arr[0];
      let timeSeriesTitle = arr[1][0];
      let timeSeriesObj = arr[1][1];
      
      // have to reverse array, data returns with recent at 0 index
      let timeSeries = Object.keys(timeSeriesObj)
        .slice(0)
        .reverse()
        .map(function (key) {
          return [key, timeSeriesObj[key]];
        })
        .map(function (item) {
          let date = item[0].split(' ');
          dateTimeArr.push(item[0]);
          dateArr.push(date[0]);
          openArr.push(parseFloat(item[1]['1. open'], 10));
          highArr.push(parseFloat(item[1]['2. high'], 10));
          lowArr.push(parseFloat(item[1]['3. low'], 10));
          closeArr.push(parseFloat(item[1]['4. close'], 10));
        });

      let t = getTrace(closeArr, highArr, lowArr, openArr, dateArr);
      let l = getLayout(dateTimeArr, timeSeriesTitle, lowArr, highArr);
      let go = getGraphOptions(FROMCURRENCY, TOCURRENCY, l);
      let figure = { 'data': [t] };
      let imgOpts = getImageOpts;

      // create image
      plotly.getImage(figure, imgOpts, function (err, imgStream) {
        if (err) return console.log(err);
        let fileStream = fs.createWriteStream(go.filename + '.' + imgOpts.format);
        imgStream.pipe(fileStream);
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

module.exports = CHARTIT;
