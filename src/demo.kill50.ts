import * as Paperless from './lib.paperless.js';



const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({
	autosize: true, 
	features: { 
		nolinehover: true 
	}
});

let count: number = 0;

const number: Paperless.Drawables.Label = new Paperless.Drawables.Label({
	context: context,
	point: {x: 150, y: 55}, 
	autosize: true, 
	content: count.toString(), 
	font: '60px bold system-ui', 
	fillcolor: '#ffffff', 
	sticky: true
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: new Paperless.Drawables.Triangle({
		context: context,
		point: {x: 250, y: 50}, 
		outerRadius: 30, 
		nostroke: false, 
		linewidth: 2, 
		strokecolor: '#151515', 
		fillcolor: '#ffffff', 
		sticky: true, 
		angle: 0
	}),
	callbackLeftClick: () => {
		for(let i: number = 0; i < 50; i++)
		{
			const radius: number = Math.floor(Math.random() * 30 + 20);
			const x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
			const y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;

			new Paperless.Control({
				context: context,
				drawable: new Paperless.Drawables.Circle({
					context: context,
					point: {x: x, y: y}, 
					outerRadius: radius,
					fillcolor: colors[Math.floor(Math.random() * 5)],
					nostroke: true
				}),
				onInside: (self?: Paperless.Control) => {
					context.detach([self.drawable.guid, self.guid]);
					
					count -= 1;
					number.content = count.toString();
					number.generate();
				}
			});
		}

		count += 50;
		number.content = count.toString();
		number.generate();
	},
	onInside: (self?: Paperless.Control) => { 
		self.drawable.fillcolor = '#c8af55'; 
	},
	onOutside: (self?: Paperless.Control) => { 
		self.drawable.fillcolor = '#ffffff'; 
	},
	onDrawable: (self?: Paperless.Controls.Button) => {
		self.leftClick();
		self.leftClick();
	}
});

context.attach(document.body);



