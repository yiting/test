const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const router = express.Router();
//依赖文件下载包
const archiver = require("archiver");
//网络包
let requestHttp = require("request");

module.exports = {
  fs,
  path,
  express,
  multer,
  router,
  archiver,
  requestHttp
};
