import cookieParser from 'cookie-parser';
import Express from 'express';
import http from 'http';

/*  ========================
    Express Setup
========================  */
const {
  COOKIE_SECRET,
  PORT,
} = process.env;
const app = new Express();
app.use(cookieParser(COOKIE_SECRET));

/*  ========================
    WEBPACK SETUP
========================  */
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from 'webpack.config.babel'; // eslint-disable-line import/no-unresolved

const compiler = webpack(webpackConfig);
app.use(webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

/*  ========================
    Routing
========================  */
import token from './token';
import render from './render';

app.use('/token', token);
app.use(render);

/*  ========================
    SERVER OPERATIONS
========================  */
let server;
export function start() {
  server = http.createServer(app).listen(PORT, (err) => {
    if (err) {
      server.close();
      console.error(err);
      process.exit(1);
    }

    console.info(`==> 🌎  Listening on port ${PORT}. Open up http://localhost:${PORT}/ in your browser.`);
  });
}

export function close() {
  if (server) {
    server.close();
  }
}
