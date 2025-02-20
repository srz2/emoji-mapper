import * as vscode from 'vscode';

import { MapOpenDocument } from './commands/OpenDocument';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "emoji-mapper" is now active!');

	const disposable = vscode.commands.registerCommand('emoji-mapper.openDocument', MapOpenDocument);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
