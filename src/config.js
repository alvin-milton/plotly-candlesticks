if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

module.exports = {
  PLOTLY_USER_NAME: process.env.PLOTLY_USER_NAME,
  PLOTLY_KEY: process.env.PLOTLY_KEY,
  ALPHA_VANTAGE_KEY: process.env.ALPHA_VANTAGE_KEY
};
