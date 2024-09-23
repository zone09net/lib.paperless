import * as Paperless from './lib.paperless.js';



const colors: string[] = ['#815556', '#436665', '#9a6c27', '#769050', '#c8af55'];
const context: Paperless.Context = new Paperless.Context({autosize: true,});
let max: number = 20;
let count: number = 0;

const number: Paperless.Drawables.Label = new Paperless.Drawables.Label({
	context: context,
	layer: 1,
	point: {x: 150, y: 55}, 
	autosize: true, 
	content: max.toString(), 
	font: '60px bold system-ui', 
	fillcolor: '#ffffff', 
	sticky: true
});

const trail: Paperless.MouseAction = new Paperless.MouseAction({
	context: context,
	layer: 0,
	onMouseMove: () => {
		new Paperless.Drawables.Rectangle({
			context: context,
			layer: 0,
			point: {
				x: context.states.pointer.current.x, 
				y: context.states.pointer.current.y
			},
			size: {width: 10, height: 10},
			fillcolor: colors[Math.floor(Math.random() * 5)], 
			nostroke: true
		});

		count++;

		while(count >= max)
		{
			context.detach(context.getDrawables(0).map.entries().next().value[0]);
			count--;
		}

		context.refresh();
	}
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	layer: 1,
	drawable: new Paperless.Drawables.Triangle({
		context: context,
		layer: 1,
		point: {x: 50, y: 50}, 
		outerRadius: 30, 
		nostroke: false, 
		linewidth: 2, 
		strokecolor: '#151515', 
		fillcolor: '#ffffff', 
		sticky: true, 
		angle: 180
	}),
	callbackLeftClick: () => {
		if(max >= 10)
		{
			max -= 5;
			number.content = max.toString();
			number.generate();
		}
	},
	onInside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#c8af55'; },
	onOutside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#ffffff'; }
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	layer: 1,
	drawable: new Paperless.Drawables.Triangle({
		context: context,
		layer: 1,
		point: {x: 250, y: 50}, 
		outerRadius: 30,
		angle: 0,
		nostroke: false, 
		linewidth: 2, 
		strokecolor: '#151515', 
		fillcolor: '#ffffff', 
		sticky: true, 
	}),
	callbackLeftClick: () => {
		max += 5;
		number.content = max.toString();
		number.generate();
	},
	onInside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#c8af55'; },
	onOutside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#ffffff'; }
});

context.attach(document.body);

