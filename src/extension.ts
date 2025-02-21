import * as vscode from 'vscode';

import { MapOpenDocument } from './commands/OpenDocument';
import { MapAllOpenDocuments } from './commands/AllOpenDocument';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "emoji-mapper" is now active!');

	registerCommand(context, 'emoji-mapper.mapOpenDocument', MapOpenDocument);
	registerCommand(context, 'emoji-mapper.mapAllOpenDocuments', MapAllOpenDocuments);
}

function registerCommand(context: vscode.ExtensionContext, command: string, callback: (result: void) => void){
	const disposable = vscode.commands.registerCommand(command, callback);
	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
