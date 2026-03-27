import * as Paperless from '@zone09.net/paperless';
import CodeMirror from '@extlib/codemirror'
import {javascript} from '@extlib/codemirror.javascript';



export class Playground
{
	private _textarea1: HTMLTextAreaElement;
	private _textarea2: HTMLTextAreaElement;
	private _container1: HTMLDivElement;
	private _container2: HTMLDivElement;
	private _codemirror1: CodeMirror;
	private _codemirror2: CodeMirror;
	private _iframe: HTMLIFrameElement;
	//---

	public constructor() 
	{
		this.create();
	}

	public create(): void
	{	
		new javascript(CodeMirror);

		this._textarea1 = document.createElement('textarea');
		this._textarea2 = document.createElement('textarea');
		this._container1 = document.createElement('div');
		this._container2 = document.createElement('div');
		this._container1.appendChild(this._textarea1);
		this._container2.appendChild(this._textarea2);

		this._iframe = document.createElement('iframe');
		this._iframe.sandbox.add('allow-scripts');
		this._iframe.sandbox.add('allow-same-origin');
		this._iframe.setAttribute('scrolling', 'no');
		this._iframe.classList.add("cm-s-v2-1");
		this._iframe.id = 'sandbox';
		this._iframe.src = 'about:blank';

		document.body.appendChild(this._container1);
		document.body.appendChild(this._container2);
		document.body.appendChild(this._iframe);

		const sandbox: Window = (<HTMLIFrameElement>document.getElementById('sandbox')).contentWindow;

		this._codemirror1 = CodeMirror.fromTextArea(this._textarea1, {
			theme: 'v2-0-66',
			tabSize: 4,
			lineNumbers: true,
			indentWithTabs: true,
			smartIndent: true,
			matchBrackets: true, 
			autoCloseBrackets: true,
			lineWrapping: false,
			mode: 'text/javascript',
		});

		this._codemirror2 = CodeMirror.fromTextArea(this._textarea2, {
			theme: 'v2-0-33',
			tabSize: 4,
			lineNumbers: false,
			indentWithTabs: true,
			smartIndent: false,
			mode: 'text/text',
		});

		// @ts-ignore
		this._codemirror1.getDoc().setValue("// You can use the already created 'context' variable\n// To excute code press CTRL-ENTER");
	
		window.addEventListener("keydown", (event: HTMLElementEventMap['keydown']) => {
			if(event.ctrlKey && event.key === "Enter") 
			{
				// @ts-ignore
				const code: string = this._codemirror1.getValue();

				this._iframe.src = 'about:blank';

				try {
				sandbox.document.open();  
				sandbox.document.write(`  
					<meta charset="utf-8" />
					<meta name="msapplication-tap-highlight" content="no" />
					<meta name="viewport" content="user-scalable=no"/>
		
					<link rel="preload" href="/assets/fonts/CPMono-v07-Light.woff" as="font" type="font/woff" crossorigin>
					<link rel="preload" href="/assets/fonts/CPMono-v07-Bold.woff" as="font" type="font/woff" crossorigin>
		
					<link rel="stylesheet" type="text/css" href="/css/fonts.css" />
					<!--<link rel="stylesheet" type="text/css" href="/css/z09.css" />-->
		
					<script language="JavaScript" type="module">
						import * as Foundation from '/js/dev/lib.foundation/src/lib.foundation.js';
						import * as Paperless from '/js/dev/lib.paperless/src/lib.paperless.js';
		
						const context = new Paperless.Context({
							autosize: true, 
							dragging: {delay: 0}
						});
		
						context.attach(document.body);
		
						window.console.log = (...args) => {  
							parent.postMessage({type: 'output', data: args.join(' ') + '\\n' }, 'https://www.zone09.net');  
						};  
		
						try 
						{  
							${code}  
						}
						catch(error)
						{  
							console.log('error');
							parent.postMessage({type: 'error', data: error.message}, 'https://www.zone09.net');  
						}  
					</script>
				`);  
				sandbox.document.close();
					}
					catch(error)
					{
						console.log(error);
					}
			}
		});

		window.addEventListener('message', (event) => {  
			if(event.source !== sandbox)
				return;

			// @ts-ignore
			this._codemirror2.getDoc().setValue(event.data.data);

			if(event.data.type === 'output') {  
				console.log(event.data.data);  
			} else if (event.data.type === 'error') {  
				console.log(event.data.data);  
			}  
	  });  
	}

	public destroy(): void
	{
		// @ts-ignore
		this._codemirror1.toTextArea();
		this._container1.removeChild(this._textarea1);
	}

	private extractLineNumber(error: any, stack: any, code: any) {  
		// Error stack example: "SyntaxError: Unexpected token ( at eval (eval at runCode (app.js:20:15), <anonymous>:2:10)"  
		const match = stack.match(/<anonymous>:(\d+):(\d+)/);  
		if (match) return match[1]; // Return line number  
	
		// Fallback: count lines in the error message  
		const lines = code.split('\n');  
		for (let i = 0; i < lines.length; i++) {  
			 if (error.message.includes(lines[i].trim())) return i + 1;  
		}  
		return 'unknown';  
  } 
}
