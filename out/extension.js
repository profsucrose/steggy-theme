"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const steggyEditor_1 = require("./steggyEditor");
function activate(context) {
    // Register our custom editor provider
    context.subscriptions.push(steggyEditor_1.SteggyEditorProvider.register(context));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map