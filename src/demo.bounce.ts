

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true});
context.attach(document.body);


let radius: number = 75;
for(let x: number = 200; x < 1000; x += (radius * 3))
{
	for(let y: number = 200; y < 600; y += (radius * 3))
	{
		context.fx.add({
			duration: 1,
			drawable: context.attach(new Paperless.Drawables.Smiley(new Paperless.Point(x, y), radius)),
			effect: bounce,
			loop: true,
			smuggler: { ease: Paperless.Fx.easeLinear},
		});
	}
}


function bounce(fx: Paperless.Interfaces.IFx) 
{
	if(fx.t1)
	{
		fx.t1 = false;
		
		if(!fx.smuggler.data)
		{
			let rad: number = Math.random() * 6.28;
			let sin: number = Math.sin(rad);
			let cos: number = Math.cos(rad);		

			fx.smuggler.data = {
				direction: new Paperless.Point(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2)),
				velocity: Math.floor(Math.random() * 5) + 5,
				rad: rad,
				cos: cos,
				sin: sin
			}
		}
	}

	let drawable: Paperless.Drawable = <Paperless.Drawable>fx.drawable;
	let point: Paperless.Point = new Paperless.Point(drawable.matrix.e, drawable.matrix.f);
	let drawables: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) =>
		map.object.guid != drawable.guid
	);

	drawables.forEach((map: any) => {
		let smiley: Paperless.Drawable = map[1].object;

		if(point.isInCircle(new Paperless.Point(smiley.matrix.e, smiley.matrix.f), radius * 2))
			fx.smuggler.data.rad = Math.atan2(drawable.matrix.f - smiley.matrix.f, drawable.matrix.e - smiley.matrix.e);
	});

	if(drawable.matrix.e - radius <= 0 || drawable.matrix.e + radius >= window.innerWidth)
		fx.smuggler.data.rad = 3.14 - fx.smuggler.data.rad;

	if(drawable.matrix.f - radius <= 0 || drawable.matrix.f + radius >= window.innerHeight)
		fx.smuggler.data.rad = 6.28 - fx.smuggler.data.rad;

	drawable.matrix.e += Math.cos(fx.smuggler.data.rad) * fx.smuggler.data.velocity;
	drawable.matrix.f += Math.sin(fx.smuggler.data.rad) * fx.smuggler.data.velocity;
}