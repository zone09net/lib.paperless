

import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({
	strokecolor: '#151515',
	autosize: true, 
	dragging: {
		delay: 0, 
		grid: {x: 100, y:0}, 
		restrict: Paperless.Enums.Restrict.onrelease
	}, 
	features: {
		nosnapping: false}
});
context.attach(document.body);

let step: number = 250
let count: number = 250;
let colors: Array<string> = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let triangle1: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(50, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 180}));
let triangle2: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(250, 50), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 0}));
let triangle3: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(250, 110), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 0}));
let triangle4: Paperless.Drawables.Triangle = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(250, 170), 30, {nostroke: false, linewidth: 2, strokecolor: '#151515', fillcolor: '#ffffff', sticky: true, angle: 0}));
let label1: Paperless.Drawables.Label = context.attach(new Paperless.Drawables.Label(new Paperless.Point(150, 55), new Paperless.Size(0, 0), {autosize: true, content: '250', font: '60px bold system-ui', fillcolor: '#ffffff', sticky: true}));
let label2: Paperless.Drawables.Label = context.attach(new Paperless.Drawables.Label(new Paperless.Point(150, 115), new Paperless.Size(0, 0), {autosize: true, content: 'line', font: '60px bold system-ui', fillcolor: '#ffffff', sticky: true}));
let label3: Paperless.Drawables.Label = context.attach(new Paperless.Drawables.Label(new Paperless.Point(150, 175), new Paperless.Size(0, 0), {autosize: true, content: 'fx', font: '60px bold system-ui', fillcolor: '#ffffff', sticky: true}));
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

control = context.attach(new Paperless.Controls.Button(() => {
	let filtered: Array<{guid: string, map: Map<string, any>}> = context.getDrawables().filter(([guid, map]: any) =>
		map.object.constructor.name == 'Triangle' ||
		map.object.constructor.name == 'Hexagon' ||
		map.object.constructor.name == 'Rectangle' ||
		map.object.constructor.name == 'Cross'
	);

	if(label2.content == 'line')
	{
		for(let i: number = 0; i < filtered.length; i++)
			(<any>filtered[i])[1].object.nostroke = true;

		label2.content = 'noline';
	}
	else
	{
		for(let i: number = 0; i < filtered.length; i++)
		(<any>filtered[i])[1].object.nostroke = false;

		label2.content = 'line';
	}

	label2.generate();
}));
control.onInside = () => { context.dragging.delay = 180; triangle3.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle3.fillcolor = '#ffffff'; };
control.attach(triangle3);
control.movable = false;

control = context.attach(new Paperless.Controls.Button(() => {
	if(label3.content == 'fx')
		label3.content = 'nofx';
	else
		label3.content = 'fx';
	label3.generate();
}));
control.onInside = () => { context.dragging.delay = 180; triangle4.fillcolor = '#c8af55'; };
control.onOutside = () => { context.dragging.delay = 0; triangle4.fillcolor = '#ffffff'; };
control.attach(triangle4);
control.movable = false;

polygons();


function polygons(): void
{
	for(let i: number = 0; i < step; i++)
	{
		let random: number = Math.floor((Math.random() * (label2.content == 'line' ? 4 : 3)));
		let color: string = '#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16);
		let linewidth: number = Math.floor(Math.random() * 20 + 5);
		let radius1: number = Math.floor(Math.random() * 30 + 20);
		let radius2: number = Math.floor(Math.random() * 30 + 5);
		let width: number = Math.floor(Math.random() * 60 + 20);
		let height: number = Math.floor(Math.random() * 60 + 20);
		let x: number = (Math.random() * (window.innerWidth - width)) + (width / 2);
		let y: number = (Math.random() * (window.innerHeight - height)) + (height / 2);
		let rx: number = (Math.random() * (window.innerWidth - (radius1 * 2))) + radius1;
		let ry: number = (Math.random() * (window.innerHeight - (radius1 * 2))) + radius1;
		let drawable: Paperless.Drawable;
		let control: Paperless.Control;

		switch(random)
		{
			case 0:
				drawable = context.attach(new Paperless.Drawables.Triangle(new Paperless.Point(rx, ry), radius1, {nostroke: (label2.content == 'line' ? false : true), linewidth: 2, strokecolor: '#151515', fillcolor: colors[3]}));
				break;
			case 1:
				drawable = context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(rx, ry), radius1, {nostroke: (label2.content == 'line' ? false : true), linewidth: 2, strokecolor: '#151515', fillcolor: colors[1]}));
				break;
			case 2:
				drawable = context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(x, y), new Paperless.Size(width, height), {nostroke: (label2.content == 'line' ? false : true), linewidth: 2, strokecolor: '#151515', fillcolor: colors[2]}));
				break;
			case 3:
				drawable = context.attach(new Paperless.Drawables.Cross(new Paperless.Point(x, y), new Paperless.Size(width, height), {nostroke: false, linewidth: linewidth, strokecolor: colors[0], fillcolor: colors[0]}));
				if(label3.content == 'fx')
				{
					context.fx.add({
						duration: 1500,
						drawable: drawable, 
						effect: context.fx.rotate,
						loop: true,
						smuggler: { 
							ease: Paperless.Fx.easeLinear, 
							angle: 360, 
						},
					});
				}			
				break;
		}

		control = context.attach(new Paperless.Controls.Blank());
		control.attach(drawable);
		control.onInside = () => {
			drawable.strokecolor = '#ffffff';
		}
		control.onOutside = () => {
			if(drawable.constructor.name == 'Cross')
				drawable.strokecolor = colors[0];
			else
				drawable.strokecolor = '#151515';
		}
	}
}



