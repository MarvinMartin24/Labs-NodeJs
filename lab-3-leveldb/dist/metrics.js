"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var Metric = /** @class */ (function () {
    function Metric(ts, v) {
        this.timestamp = ts;
        this.value = v;
    }
    return Metric;
}());
exports.Metric = Metric;
var MetricsHandler = /** @class */ (function () {
    function MetricsHandler(dbPath) {
        this.db = leveldb_1.LevelDB.open(dbPath);
    }
    MetricsHandler.prototype.save = function (key, metrics, callback) {
        var stream = level_ws_1.default(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach(function (m) {
            stream.write({ key: "metric:" + key + ":" + m.timestamp, value: m.value });
        });
        stream.end();
    };
    MetricsHandler.prototype.getAll = function (callback) {
        var metrics = [];
        var rs = this.db.createReadStream();
        rs.on('data', function (data) {
            console.log(data.key, '=', data.value);
            metrics.push(data);
        });
        rs.on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        });
        rs.on('close', function () {
            console.log('Stream closed');
        });
        rs.on('end', function () {
            console.log('Stream ended');
            callback(null, metrics);
        });
    };
    MetricsHandler.prototype.getOne = function (key, callback) {
        //let metrics: Metric = []
        var rs = this.db.createReadStream();
        rs.on('data', function (data) {
            console.log(data.key, '=', data.value);
        });
        rs.on('error', function (err) {
            console.log('Oh my!', err);
            callback(err, null);
        });
        rs.on('close', function () {
            console.log('Stream closed');
        });
        rs.on('end', function () {
            console.log('Stream ended');
        });
    };
    return MetricsHandler;
}());
exports.MetricsHandler = MetricsHandler;
