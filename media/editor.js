// @ts-check

// Script run within the webview itself.
(function () {
	// @ts-ignore
	const vscode = acquireVsCodeApi()

	const textarea = document.querySelector('textarea')

	textarea.oninput = () => {
		console.log('Attempting update')
		vscode.postMessage({ 
			type: 'update',
			text: textarea.value
		})
	}

}())