

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context( {features: { nohover: false }});
context.attach(document.body);


let count: number = 1000;
let step: number = 250;
let colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let radius: number = 20;
let limit: {left: number, top: number, right: number, bottom: number} = {
	left: radius,
	top: radius,
	right: window.innerWidth - radius, 
	bottom: window.innerHeight - radius
}
let triangle1: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(50, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 180}));
let triangle2: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(250, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 0}));
let label1: Paperless.Drawables.Label = context.attach(new Paperless.Drawables.Label(new Paperless.Point(150, 55), new Paperless.Size(0, 0), {autosize: true, content: '1000', font: '60px bold system-ui', fillcolor: '#ffffff', sticky: true}));
let control: Paperless.Control;

control = context.attach(new Paperless.Controls.Button(() => {
	if(count < 2000)
	{
		polygons();
		count += step;
		label1.content = count.toString();
		label1.generate();
	}
}));
control.onInside = () => { context.dragging.delay = 180; triangle2.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle2.fillcolor = '#ffffff'; };
control.attach(triangle2);
control.movable = false;

control = context.attach(new Paperless.Controls.Button(() => {
	if(count > 0)
	{
		let filtered: Array<{guid: string, map: Map<string, any>}> = context.getControls().filter(([guid, map]: any) =>
			map.object.constructor.name == 'Blank'
		);

		for(let i: number = 0; i < step; i++)
		{
			let control: Paperless.Control = (<any>filtered[i])[1].object;
			context.detach([control.drawable.guid, control.guid]);
		}

		count -= step;
		label1.content = count.toString();
		label1.generate();
	}
}));
control.onInside = () => { context.dragging.delay = 180; triangle1.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle1.fillcolor = '#ffffff'; };
control.attach(triangle1);
control.movable = false;

polygons();
polygons();
polygons();
polygons();


function polygons(): void
{
	for(let i: number = 0; i < step; i++)
	{
		let x: number = (Math.random() * (limit.right - limit.left)) + limit.left;
		let y: number = (Math.random() * (limit.bottom - limit.top)) + limit.top;
		let drawable: Paperless.Drawable = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(x, y), radius, 0, { fillcolor: colors[Math.floor(Math.random() * 5)], nostroke: true, hoverable: false }));
		let control: Paperless.Control = context.attach(new Paperless.Controls.Blank());

		control.attach(drawable);
		context.fx.add({
			duration: (Math.random() * 500) + 100,
			drawable: drawable, 
			effect: heretic,
			loop: true,
			smuggler: { 
				ease: Paperless.Fx.easeLinear, 
				data: {
					limit: limit
				}
			},
		});
	}
}


function heretic(fx: Paperless.Interfaces.IFx): void
{
	if(fx.t1)
	{
		let rad: number = Math.random() * 6.28;
		let sin: number = Math.sin(rad);
		let cos: number = Math.cos(rad);

		fx.t1 = false;
		fx.smuggler.data = {
			...fx.smuggler.data,
			...{
				delta: 0,
				distance: 0,
				sin: sin,
				cos: cos
			},
		};
		fx.smuggler.distance = (Math.random() * 60) + 5;
	}

	let distance: number = fx.t * fx.smuggler.distance;
	let matrix: DOMMatrix = (<Paperless.Drawable>fx.drawable).matrix;
	let point: Paperless.Point = new Paperless.Point(matrix.e, matrix.f);

	fx.smuggler.data.delta = distance - fx.smuggler.data.distance;
	fx.smuggler.data.distance = distance;
	
	if(point.isInCircle(context.states.pointer.current, 200))
	{
		let rad = Math.atan2(matrix.e - context.states.pointer.current.x, matrix.f - context.states.pointer.current.y);

		fx.smuggler.data.cos = Math.cos(rad);
		fx.smuggler.data.sin = -Math.sin(rad);
		fx.smuggler.data.delta *= 20;
	}

	if(matrix.e < fx.smuggler.data.limit.left || matrix.e > fx.smuggler.data.limit.right || matrix.f < fx.smuggler.data.limit.top || matrix.f > fx.smuggler.data.limit.bottom) 
	{
		let rad = Math.atan2(matrix.f - (fx.smuggler.data.limit.bottom / 2), matrix.e - (fx.smuggler.data.limit.right / 2));

		fx.smuggler.data.cos = -Math.cos(rad);
		fx.smuggler.data.sin = -Math.sin(rad);
	}

	matrix.e += fx.smuggler.data.cos * fx.smuggler.data.delta;
	matrix.f += fx.smuggler.data.sin * fx.smuggler.data.delta;
}


