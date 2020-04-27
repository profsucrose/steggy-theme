import * as vscode from 'vscode'
import { SteggyEditorProvider } from './steggyEditor'

export function activate(context: vscode.ExtensionContext) {
	// Register our custom editor provider
	context.subscriptions.push(SteggyEditorProvider.register(context))
}
