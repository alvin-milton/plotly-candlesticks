const config = require('./config');
const fs = require('fs');
const axios = require('axios');
const plotly = require('plotly')(config.PLOTLY_USER_NAME, config.PLOTLY_KEY);

const CHARTIT = (FROMCURRENCY, TOCURRENCY) => {
  let jsobjpath = 'https://www.alphavantage.co/query?function=FX_DAILY&from_symbol=' + FROMCURRENCY + '&to_symbol=' + TOCURRENCY + '&apikey=' + config.ALPHA_VANTAGE_KEY;

  return axios.get(jsobjpath)
    .then(function (response) {
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
      let timeSeries = Object.keys(timeSeriesObj).slice(0).reverse().map(function (key) {
        return [key, timeSeriesObj[key]];
      });
      let dateArr = [];
      let dateTimeArr = [];
      let openArr = [];
      let highArr = [];
      let lowArr = [];
      let closeArr = [];

      timeSeries.map(function (item) {
        let date = item[0].split(' ');
        dateTimeArr.push(item[0]);
        dateArr.push(date[0]);
        openArr.push(parseFloat(item[1]['1. open'], 10));
        highArr.push(parseFloat(item[1]['2. high'], 10));
        lowArr.push(parseFloat(item[1]['3. low'], 10));
        closeArr.push(parseFloat(item[1]['4. close'], 10));
      });
      // console.log('dateTimeArr', dateTimeArr)
      // console.log('dateArr', dateArr)
      // console.log('openArr', openArr)
      // console.log('highArr', highArr)
      // console.log('lowArr', lowArr)
      // console.log('closeArr', closeArr)

      let trace = {};
      trace.close = closeArr;
      trace.decreasing = {
        line: {
          color: '#7F7F7F'
        }
      };
      trace.high = highArr;
      trace.increasing = {
        line: {
          color: '#17BECF'
        }
      };
      trace.low = lowArr;
      trace.open = openArr;
      trace.type = 'candlestick';
      trace.x = dateArr;
      trace.xaxis = 'x';
      trace.yaxis = 'y';

      let d = [trace];
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
        range: [dateTimeArr[0].toString(), dateTimeArr[dateTimeArr.length - 1].toString()],
        rangeslider: [dateTimeArr[0].toString(), dateTimeArr[dateTimeArr.length - 1].toString()],
        title: timeSeriesTitle,
        type: 'date'
      };
      layout.yaxis = {
        autorange: true,
        domain: [0, 1],
        range: [Math.min.apply(null, lowArr), Math.max.apply(null, highArr)],
        type: 'linear'
      };

      let graphOptions = {};
      graphOptions.filename = 'PriceChart' + '_' + FROMCURRENCY + '_' + TOCURRENCY;
      graphOptions.fileopt = 'overwrite';
      graphOptions.layout = layout;

      // create graph
      plotly.plot(d, graphOptions, function (err, msg) {
        if (err) return console.log(err);
        console.log(msg);
      });

      let figure = { 'data': [trace] };
      let imgOpts = {
        format: 'png',
        width: 1000,
        height: 500
      };
      // create image
      plotly.getImage(figure, imgOpts, function (err, imgStream) {
        if (err) return console.log(err);
        var fileStream = fs.createWriteStream(graphOptions.filename + '.png');
        imgStream.pipe(fileStream);
      });

    })
    .catch(function (error) {
      console.log(error);
    });
};

module.exports = CHARTIT;