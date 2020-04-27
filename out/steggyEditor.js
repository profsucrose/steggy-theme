"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode = require("vscode");
const util_1 = require("./util");
/**
 * Provider for cat scratch editors.
 *
 * Cat scratch editors are used for `.cscratch` files, which are just json files.
 * To get started, run this extension and open an empty `.cscratch` file in VS Code.
 *
 * This provider demonstrates:
 *
 * - Setting up the initial webview for a custom editor.
 * - Loading scripts and styles in a custom editor.
 * - Synchronizing changes between a text document and a custom editor.
 */
class SteggyEditorProvider {
    constructor(context) {
        this.context = context;
    }
    static register(context) {
        const provider = new SteggyEditorProvider(context);
        const providerRegistration = vscode.window.registerCustomEditorProvider(SteggyEditorProvider.viewType, provider);
        return providerRegistration;
    }
    /**
     * Called when our custom editor is opened.
     *
     *
     */
    resolveCustomTextEditor(document, webviewPanel, _token) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('resolveCustomTextEditor');
            // Setup initial content for the webview
            webviewPanel.webview.options = {
                enableScripts: true,
            };
            webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, document.getText());
            function updateWebview() {
                webviewPanel.webview.postMessage({
                    type: 'update',
                    text: document.getText(),
                });
            }
            webviewPanel.webview.onDidReceiveMessage((e) => {
                switch (e.type) {
                    case 'update':
                        this.updateTextDocument(document, e.text);
                        return;
                }
            });
            // Hook up event handlers so that we can synchronize the webview with the text document.
            //
            // The text document acts as our model, so we have to sync change in the document to our
            // editor and sync changes in the editor back to the document.
            // 
            // Remember that a single text document can also be shared between multiple custom
            // editors (this happens for example when you split a custom editor)
            const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
                if (e.document.uri.toString() === document.uri.toString()) {
                    updateWebview();
                }
            });
            // Make sure we get rid of the listener when our editor is closed.
            webviewPanel.onDidDispose(() => {
                changeDocumentSubscription.dispose();
            });
            updateWebview();
        });
    }
    /**
     * Get the static html used for the editor webviews.
     */
    getHtmlForWebview(webview, text) {
        // Local path to script and css for the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'editor.js')));
        const styleUri = webview.asWebviewUri(vscode.Uri.file(path.join(this.context.extensionPath, 'media', 'editor.css')));
        // Use a nonce to whitelist which scripts can be run
        const nonce = util_1.getNonce();
        return /* html */ `
			<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none' img-src ${webview.cspSource} style-src ${webview.cspSource} script-src 'nonce-${nonce}'">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${styleUri}" rel="stylesheet" />

				<title>Steggy Editor</title>
			</head>
			<body>
				<textarea>${text}</textarea>

				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
    updateTextDocument(document, text) {
        const edit = new vscode.WorkspaceEdit();
        // Just replace the entire document every time for this example extension.
        // A more complete extension should compute minimal edits instead.
        edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), text);
        console.log('Attempted to update document with text:', text);
        return vscode.workspace.applyEdit(edit);
    }
}
exports.SteggyEditorProvider = SteggyEditorProvider;
SteggyEditorProvider.viewType = 'steggyTheme.editor';
SteggyEditorProvider.scratchCharacters = ['😸', '😹', '😺', '😻', '😼', '😽', '😾', '🙀', '😿', '🐱'];
//# sourceMappingURL=steggyEditor.js.map