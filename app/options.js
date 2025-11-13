"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const hasyx_1 = require("hasyx"); // Import Client and apollo creator
require("next-auth");
require("next-auth/jwt");
const auth_options_1 = require("hasyx/lib/users/auth-options");
const credentials_1 = require("hasyx/lib/credentials");
const telegram_miniapp_server_1 = require("hasyx/lib/telegram/telegram-miniapp-server");
const hasura_schema_json_1 = __importDefault(require("../public/hasura-schema.json"));
let authOptions = { providers: [] }, client;
if (((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NEXT_PUBLIC_HASURA_GRAPHQL_URL) && ((_b = process === null || process === void 0 ? void 0 : process.env) === null || _b === void 0 ? void 0 : _b.HASURA_ADMIN_SECRET)) {
    client = new hasyx_1.Hasyx((0, hasyx_1.createApolloClient)({
        secret: process.env.HASURA_ADMIN_SECRET,
    }), (0, hasyx_1.Generator)(hasura_schema_json_1.default));
    authOptions = (0, auth_options_1.createAuthOptions)([
        (0, credentials_1.AppCredentialsProvider)({ hasyx: client }),
        (0, telegram_miniapp_server_1.TelegramMiniappCredentialsProvider)({ hasyx: client }),
    ], client);
}
exports.default = authOptions;
