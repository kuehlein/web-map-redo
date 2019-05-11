const createHistory = require("history").createBrowserHistory;
const { createMemoryHistory } = require("history");

const history =
  process.env.NODE_ENV === "test" ? createMemoryHistory() : createHistory();

export default history;
