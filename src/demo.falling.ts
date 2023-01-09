

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true});
context.attach(document.body);


for(let i: number = 0; i < 50; i++)
{
	let radius: number = Math.floor(Math.random() * 30 + 20);
	let x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
	let y: number = (Math.random() * (window.innerHeight - (radius * 2))) + radius;

	let drawable: Paperless.Drawable = context.attach(new Paperless.Drawables.Smiley(new Paperless.Point(x, y), radius));
	let control: Paperless.Control = context.attach(new Paperless.Controls.Button(() => {
		let guids: Array<string> = [];
		
		Paperless.Context.near(drawable.context.getDrawables(), new Paperless.Point(drawable.matrix.e, drawable.matrix.f), 100, guids)

		for(let guid of guids)
		{
			let drawable: Paperless.Drawable = context.get(guid);
			let distance: number = Math.floor(window.innerHeight - drawable.y - (drawable.size.height / 2));

			context.fx.add({
				duration: distance * 2,
				drawable: drawable,
				effect: context.fx.translate,
				smuggler: { 
					ease: Paperless.Fx.easeOutBounce, 
					angle: 90, 
					distance: distance
				},
			});
		}
	}))

	control.attach(drawable);
}
