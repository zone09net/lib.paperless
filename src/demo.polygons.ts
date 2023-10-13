

import * as Paperless from './lib.paperless.js';


const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const step: number = 100
let count: number = 100;

const context: Paperless.Context = new Paperless.Context({
	strokecolor: '#151515',
	autosize: true, 
	dragging: {
		delay: 0, 
		grid: {x: 20, y: 20}, 
		restrict: Paperless.Enums.Restrict.onrelease
	}, 
	features: {
		nosnapping: false
	},
});

const label: Paperless.Drawables.Label = new Paperless.Drawables.Label({
	autosize: true, 
	content: count.toString(), 
	font: '60px bold system-ui', 
	fillcolor: '#ffffff', 
	sticky: true
});

const triangle: Paperless.Drawables.Triangle = new Paperless.Drawables.Triangle({
	radius: 30, 
	nostroke: false, 
	linewidth: 2, 
	strokecolor: '#151515', 
	fillcolor: '#ffffff', 
	sticky: true, 
	angle: 0
});

const labelCount: Paperless.Drawables.Label = label.clone({
	context: context,
	content: count.toString(), 
	point: {x: 150, y: 55},
});

const labelLine: Paperless.Drawables.Label = label.clone({
	context: context,
	content: 'line', 
	point: {x: 150, y: 115},
});

const labelFx: Paperless.Drawables.Label = label.clone({
	context: context,
	content: 'fx', 
	point: {x: 150, y: 175},
});

const less: Paperless.Drawables.Triangle = triangle.clone({
	context: context,
	point: {x: 50, y: 50}, 
	angle: 180
});

const more: Paperless.Drawables.Triangle = triangle.clone({
	context: context,
	point: {x: 250, y: 50}, 
	angle: 0
});

const line: Paperless.Drawables.Triangle = triangle.clone({
	context: context,
	point: {x: 250, y: 110}, 
});

const fx: Paperless.Drawables.Triangle = triangle.clone({
	context: context,
	point: {x: 250, y: 170}, 
});

// more
new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: more,
	callbackLeftClick: () => {
		if(count < 2000)
		{
			count += step;
			labelCount.content = count.toString();
			labelCount.generate();
			polygons();
		}
	},
	onInside: () => { more.fillcolor = '#c8af55'; },
	onOutside: () => { more.fillcolor = '#ffffff'; }
});

// less
new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: less,
	callbackLeftClick: () => {
		if(count > 0)
		{
			const controls: Paperless.Control[] = context.getControls().filter((control: Paperless.Control) =>
				control.drawable.constructor.name != 'Label' && control.drawable.constructor.name != 'Triangle'
			);
	
			for(let i: number = 0; i < step; i++)
				context.detach([controls[i].drawable.guid, controls[i].guid]);
	
			count -= step;
			labelCount.content = count.toString();
			labelCount.generate();
		}
	},
	onInside: () => { less.fillcolor = '#c8af55'; },
	onOutside: () => { less.fillcolor = '#ffffff'; }
});


// line
new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: line,
	callbackLeftClick: () => {
		const drawables: Paperless.Drawable[] = context.getDrawables().filter((drawable: Paperless.Drawable) =>
			drawable.constructor.name == 'Blade' ||
			drawable.constructor.name == 'Hexagon' ||
			drawable.constructor.name == 'Rectangle' ||
			drawable.constructor.name == 'Cross'
		);
		const length: number = drawables.length

		if(labelLine.content == 'line')
		{
			for(let i: number = 0; i < length; i++)
				drawables[i].nostroke = true;

			labelLine.content = 'noline';
		}
		else
		{
			for(let i: number = 0; i < length; i++)
				drawables[i].nostroke = false;

			labelLine.content = 'line';
		}

		labelLine.generate();
	},
	onInside: () => { line.fillcolor = '#c8af55'; },
	onOutside: () => { line.fillcolor = '#ffffff'; }
});

// fx
new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: fx,
	callbackLeftClick: () => {
		if(labelFx.content == 'fx')
			labelFx.content = 'nofx';
		else
			labelFx.content = 'fx';
		labelFx.generate();
	},
	onInside: () => { fx.fillcolor = '#c8af55'; },
	onOutside: () => { fx.fillcolor = '#ffffff'; }
});


context.attach(document.body);
polygons();


function polygons(): void
{
	for(let i: number = 0; i < step; i++)
	{
		const random: number = Math.floor((Math.random() * (labelLine.content == 'line' ? 4 : 3)));
		const linewidth: number = Math.floor(Math.random() * 20 + 5);
		const radius: number = Math.floor(Math.random() * 30 + 20);
		const width: number = Math.floor(Math.random() * 60 + 20);
		const height: number = Math.floor(Math.random() * 60 + 20);
		const x: number = (Math.random() * (context.canvas.width - width)) + (width / 2);
		const y: number = (Math.random() * (context.canvas.height - height)) + (height / 2);
		const rx: number = (Math.random() * (context.canvas.width - (radius * 2))) + radius;
		const ry: number = (Math.random() * (context.canvas.height - (radius * 2))) + radius;
		let drawable: Paperless.Drawable;

		switch(random)
		{
			case 0:
				drawable = new Paperless.Drawables.Blade({
					context: context,
					point: {x: rx, y: ry},
					outerRadius: radius,
					spikes: Math.round(((Math.random() * 8) + 6) / 2) * 2,
					nostroke: (labelLine.content == 'line' ? false : true), 
					linewidth: 2, 
					strokecolor: '#151515', 
					fillcolor: colors[3],
					hoverable: true
				});

				if(labelFx.content == 'fx')
				{
					context.fx.add({
						duration: 1500,
						drawable: drawable, 
						effect: fullRotate,
						loop: true,
						smuggler: { 
							ease: Paperless.Fx.easeLinear, 
							angle: 360, 
						},
					});
				}		
				break;

			case 1:
				drawable = new Paperless.Drawables.Hexagon({
					context: context,
					point: {x: rx, y: ry},
					radius: radius,
					nostroke: (labelLine.content == 'line' ? false : true), 
					linewidth: 2, 
					strokecolor: '#151515', 
					fillcolor: colors[1],
					hoverable: true
				});
				break;

			case 2:
				drawable = new Paperless.Drawables.Rectangle({
					context: context,
					point: {x: x, y: y},
					size: {width: width, height: height},
					nostroke: (labelLine.content == 'line' ? false : true), 
					linewidth: 2, 
					strokecolor: '#151515', 
					fillcolor: colors[2],
					hoverable: true
				});
				break;

			case 3:
				drawable = new Paperless.Drawables.Cross({
					context: context,
					point: {x: x, y: y},
					size: {width: width, height: height},
					nostroke: false, 
					linewidth: linewidth, 
					strokecolor: colors[0], 
					fillcolor: colors[0],
					hoverable: true
				});

				if(labelFx.content == 'fx')
				{
					context.fx.add({
						duration: 1500,
						drawable: drawable, 
						effect: fullRotate,
						loop: true,
						smuggler: { 
							ease: Paperless.Fx.easeLinear, 
							angle: 360, 
						},
					});
				}			
				break;
		}

		new Paperless.Control({
			context: context,
			drawable: drawable,
			onInside: () => {
				drawable.strokecolor = '#ffffff';
			},
			onOutside: () => {
				if(drawable.constructor.name == 'Cross')
					drawable.strokecolor = colors[0];
				else
					drawable.strokecolor = '#151515';
			}
		});
	}
}

function fullRotate(fx: Paperless.Interfaces.IFx)
{
	(<Paperless.Drawable>fx.drawable).rad = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
}

