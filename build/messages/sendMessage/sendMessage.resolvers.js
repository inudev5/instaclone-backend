"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var users_utils_1 = require("../../users/users.utils");
var constants_1 = __importDefault(require("../../constants"));
var pubsub_1 = __importDefault(require("../../pubsub"));
var resolvers = {
    Mutation: {
        sendMessage: (0, users_utils_1.protectResolver)(function (_, _a, _b) {
            var payload = _a.payload, roomId = _a.roomId, userId = _a.userId;
            var loggedInUser = _b.loggedInUser, client = _b.client;
            return __awaiter(void 0, void 0, void 0, function () {
                var room, user, existRoom, _c, message;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            room = null;
                            if (!userId) return [3 /*break*/, 6];
                            return [4 /*yield*/, client.user.findUnique({
                                    where: { id: userId }, select: { id: true }
                                })];
                        case 1:
                            user = _d.sent();
                            if (!user) {
                                return [2 /*return*/, {
                                        ok: false,
                                        error: "This user does not exist."
                                    }];
                            }
                            return [4 /*yield*/, client.room.findFirst({
                                    where: { users: { some: { id: userId } } },
                                    select: { id: true }
                                })];
                        case 2:
                            existRoom = _d.sent();
                            if (!existRoom) return [3 /*break*/, 3];
                            _c = existRoom;
                            return [3 /*break*/, 5];
                        case 3: return [4 /*yield*/, client.room.create({
                                data: {
                                    users: {
                                        connect: [{ id: userId }, { id: loggedInUser.id }]
                                    }
                                }
                            })];
                        case 4:
                            _c = _d.sent();
                            _d.label = 5;
                        case 5:
                            room = _c;
                            return [3 /*break*/, 8];
                        case 6:
                            if (!roomId) return [3 /*break*/, 8];
                            return [4 /*yield*/, client.room.findUnique({ where: { id: roomId }, select: { id: true } })];
                        case 7:
                            room = _d.sent();
                            if (!room) {
                                return [2 /*return*/, {
                                        ok: false,
                                        error: "Room not found."
                                    }];
                            }
                            _d.label = 8;
                        case 8: return [4 /*yield*/, client.message.create({
                                data: {
                                    payload: payload,
                                    room: {
                                        connect: {
                                            id: room.id
                                        }
                                    },
                                    user: {
                                        connect: {
                                            id: loggedInUser.id
                                        }
                                    }
                                }
                            })];
                        case 9:
                            message = _d.sent();
                            return [4 /*yield*/, pubsub_1.default.publish(constants_1.default, { roomUpdates: __assign({}, message) })];
                        case 10:
                            _d.sent();
                            return [2 /*return*/, {
                                    ok: true,
                                    id: message.id
                                }];
                    }
                });
            });
        })
    }
};
exports.default = resolvers;
