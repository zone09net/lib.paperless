

import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

for(let i: number = 0; i < 500; i++)
{
	const radius: number = Math.floor(Math.random() * 30 + 20);
	const x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
	const y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;

	const smiley: Paperless.Drawables.Smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: x, y: y}, 
		outerRadius: radius,
		fillcolor: colors[Math.floor(Math.random() * 5)],
	});

	const control: Paperless.Control = new Paperless.Control({
		context: context,
		drawable: smiley,
		onInside: () => {
			context.detach([smiley.guid, control.guid]);
		}
	});
}

context.attach(document.body);
