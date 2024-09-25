import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const max: number = 40;
const speed: number = 1500;
let count: number = 4;

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

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: more,
	callbackLeftClick: () => {
		if(count < max)
		{
			count++;
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
		if(count > 2)
		{
			count--;
			number.content = count.toString();
			number.generate();
			polygons();
		}
	},
	onInside: () => { less.fillcolor = '#c8af55'; },
	onOutside: () => { less.fillcolor = '#ffffff'; }
});


function polygons()
{
	const drawables: Paperless.Drawable[] = context.getDrawables().filter((drawable: Paperless.Drawable) =>
		drawable.constructor.name == 'Circle'
	);
	const length: number = drawables.length;

	for(let i: number = 0; i < length; i++)
		context.detach(drawables[i].guid);

	for(let adder: number = 4, space: number = count; adder < 460; adder+= space)
	{
		const drawable: Paperless.Drawables.Circle = context.attach(new Paperless.Drawables.Circle({
			point: {x: window.innerWidth / 2, y: window.innerHeight / 2},
			outerRadius: adder + space,
			innerRadius: adder,
			angleEnd: Math.floor(Math.random() * 90 + 15),
			fillcolor: colors[Math.floor(Math.random() * 5)],
			nostroke: true,
			hoverable: false
		}));
	
		context.fx.add({
			duration: Math.floor(Math.random() * 2000 + speed),
			drawable: drawable,
			effect: fullRotate,
			loop: true,
			smuggler: { 
				ease: Paperless.Fx.easeLinear, 
				angle: Math.random() < 0.5 ? -1 : 1 
			}
		});
	}
	
}

function fullRotate(fx: Paperless.Interfaces.IFx)
{
	(<Paperless.Drawable>fx.drawable).rad = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
}


context.attach(document.body);
polygons();

