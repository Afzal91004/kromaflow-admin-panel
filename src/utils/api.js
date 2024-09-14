const { default: axios } = require("axios");

export const api = axios.create({
  baseURL: "https://kroma-flow-backend.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});
