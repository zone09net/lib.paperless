

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true});
context.attach(document.body);


for(let i: number = 0; i < 500; i++)
{
	let drawable: Paperless.Drawable;
	let control: Paperless.Control;
	let radius: number = Math.floor(Math.random() * 30 + 20);
	let x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
	let y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;

	drawable = context.attach(new Paperless.Drawables.Smiley(new Paperless.Point(x, y), radius));
	control = context.attach(new Paperless.Controls.Blank());

	control.attach(drawable);
	control.onInside = () => {
		context.detach([drawable.guid, control.guid]);
	}
}

