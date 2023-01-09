

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true});
context.attach(document.body);


let count: number = 4;
let colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let triangle1: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(50, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 180}));
let triangle2: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(250, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 0}));
let label1: Paperless.Drawables.Label = context.attach(new Paperless.Drawables.Label(new Paperless.Point(150, 55), new Paperless.Size(0, 0), {autosize: true, content: '4', font: '60px bold system-ui', fillcolor: '#ffffff', sticky: true}));
let control: Paperless.Control;

control = context.attach(new Paperless.Controls.Button(() => {
	if(count < 20)
	{
		polygons();
		count++;
		label1.content = count.toString();
		label1.generate();
	}
}));
control.onInside = () => { context.dragging.delay = 180; triangle2.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle2.fillcolor = '#ffffff'; };
control.attach(triangle2);
control.movable = false;

control = context.attach(new Paperless.Controls.Button(() => {
	if(count > 2)
	{
		polygons();
		count--;
		label1.content = count.toString();
		label1.generate();
	}
}));
control.onInside = () => { context.dragging.delay = 180; triangle1.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle1.fillcolor = '#ffffff'; };
control.attach(triangle1);
control.movable = false;

polygons();


function polygons()
{

	let filtered: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) =>
		map.object.constructor.name == 'Circle'
	);

	for(let i: number = 0; i < filtered.length; i++)
		context.detach([(<any>filtered[i])[1].object.guid]);

	for(let adder: number = 4, space: number = count; adder < 460; adder+= space)
	{
		let drawable: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), adder + space, adder, {
			angleEnd: Math.floor(Math.random() * 90 + 15),
			fillcolor: colors[Math.floor(Math.random() * 5)], //'#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16),
			nostroke: true,
			hoverable: false
		}));
	
		context.fx.add({
			duration: Math.floor(Math.random() * 2000 + 2000),
			drawable: drawable,
			effect: fullRotate,
			loop: true,
			smuggler: { ease: Paperless.Fx.easeLinear, angle: Math.random() < 0.5 ? -1 : 1 }
		});
	}
	
}


function fullRotate(fx: Paperless.Interfaces.IFx)
{
	let rad: number = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
	let sin: number = Math.sin(rad);
	let cos: number = Math.cos(rad);

	(<Paperless.Drawable>fx.drawable).matrix.a = cos;
	(<Paperless.Drawable>fx.drawable).matrix.b = sin;
	(<Paperless.Drawable>fx.drawable).matrix.c = -sin;
	(<Paperless.Drawable>fx.drawable).matrix.d = cos;
}
