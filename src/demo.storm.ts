import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context( {features: { nohover: false }});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const step: number = 250;
const max: number = 3000;
let count: number = 1000;

const virus: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
	outerRadius: 20, 
	nostroke: true, 
	hoverable: false 
});

const number: Paperless.Drawables.Label = new Paperless.Drawables.Label({
	context: context,
	point: {x: 150, y: 55}, 
	autosize: true, 
	content: count.toString(), 
	font: '60px CPMono-v07-Bold', 
	fillcolor: '#ffffff', 
	sticky: true
});

const less: Paperless.Drawables.Triangle = new Paperless.Drawables.Triangle({
	context: context,
	point: {x: 50, y: 50}, 
	outerRadius: 30, 
	nostroke: false, 
	linewidth: 2, 
	strokecolor: '#151515', 
	fillcolor: '#ffffff', 
	sticky: true, 
	angle: 180
});

const more: Paperless.Drawables.Triangle = less.clone({
	context: context,
	point: {x: 250, y: 50}, 
	angle: 0
});

const limit: {left: number, top: number, right: number, bottom: number} = {
	left: virus.outerRadius,
	top: virus.outerRadius,
	right: window.innerWidth - virus.outerRadius, 
	bottom: window.innerHeight - virus.outerRadius
}

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: more,
	callbackLeftClick: () => {
		if(count < max)
		{
			count += step;
			number.content = count.toString();
			number.generate();
			polygons();
		}
	},
	onInside: () => { more.fillcolor = '#c8af55'; },
	onOutside: () => { more.fillcolor = '#ffffff'; }
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: less,
	callbackLeftClick: () => {
		if(count > 0)
		{
			const filtered: Paperless.Drawable[] = context.getDrawables().filter((drawable: Paperless.Drawable) =>
				drawable.constructor.name == 'Circle'
			);

			for(let i: number = 0; i < step; i++)
				context.detach(filtered[i].guid);

			count -= step;
			number.content = count.toString();
			number.generate();
		}
	},
	onInside: () => { less.fillcolor = '#c8af55'; },
	onOutside: () => { less.fillcolor = '#ffffff'; }
});


context.attach(document.body);

polygons();
polygons();
polygons();
polygons();


function polygons(): void
{
	context.states.norefresh = true;

	for(let i: number = 0; i < step; i++)
	{
		const rad: number = Math.random() * 6.28;
		const drawable: Paperless.Drawables.Circle = virus.clone({
			context: context,
			fillcolor: colors[Math.floor(Math.random() * 5)],
			point: {
				x: (Math.random() * (limit.right - limit.left)) + limit.left,
				y: (Math.random() * (limit.bottom - limit.top)) + limit.top,
			},
			hoverable: false
		});

		context.fx.add({
			duration: (Math.random() * 500) + 100,
			drawable: drawable, 
			effect: heretic,
			loop: true,
			smuggler: { 
				ease: Paperless.Fx.easeLinear, 
				distance: (Math.random() * 60) + 10,
				data: {
					limit: limit,
					delta: 0,
					distance: 0,
					sin: Math.sin(rad),
					cos: Math.cos(rad)
				}
			},
		});
	}

	context.states.norefresh = true;
	context.refresh();
}


function heretic(fx: Paperless.Interfaces.IFx): void
{
	const drawable: Paperless.Drawables.Circle = <Paperless.Drawables.Circle>fx.drawable;
	const distance: number = fx.t * fx.smuggler.distance;
	
	fx.smuggler.data.delta = distance - fx.smuggler.data.distance;
	fx.smuggler.data.distance = distance;

	if(drawable.point.isInCircle(context.states.pointer.current, 200))
	{
		let rad = Math.atan2(drawable.x - context.states.pointer.current.x, drawable.y - context.states.pointer.current.y);

		fx.smuggler.data.cos = Math.cos(rad);
		fx.smuggler.data.sin = -Math.sin(rad);
		fx.smuggler.data.delta *= 20;
	}
	
	if(drawable.x < fx.smuggler.data.limit.left || drawable.x > fx.smuggler.data.limit.right || drawable.y < fx.smuggler.data.limit.top || drawable.y > fx.smuggler.data.limit.bottom) 
	{
		let rad = Math.atan2(drawable.y - (fx.smuggler.data.limit.bottom / 2), drawable.x - (fx.smuggler.data.limit.right / 2));

		fx.smuggler.data.cos = -Math.cos(rad);
		fx.smuggler.data.sin = -Math.sin(rad);
	}

	drawable.x += fx.smuggler.data.cos * fx.smuggler.data.delta;
	drawable.y += fx.smuggler.data.sin * fx.smuggler.data.delta;

	if(fx.t9)
	{
		const rad: number = Math.random() * 6.28;

		fx.smuggler.data.sin = Math.sin(rad);
		fx.smuggler.data.cos = Math.cos(rad);
		fx.smuggler.data.delta = 0;
		fx.smuggler.data.distance = 0;

		fx.t9 = false;
	}
}


