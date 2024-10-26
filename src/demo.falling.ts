import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
let radius: number = 100;

const proximity: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
	context: context,
	outerRadius: radius,
	nostroke: true,
	fillcolor: '#151515',
	visible: false,
});

const number: Paperless.Drawables.Label = new Paperless.Drawables.Label({
	context: context,
	point: {x: 150, y: 55}, 
	autosize: true, 
	content: radius.toString(), 
	font: '60px CPMono-v07-Bold', 
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
		nostroke: true, 
		fillcolor: '#ffffff', 
		sticky: true, 
		angle: 0
	}),
	callbackLeftClick: () => {
		radius += 50;

		number.content = radius.toString();
		number.generate();

		proximity.outerRadius = radius;
		proximity.generate();
	},
	onInside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#c8af55'; },
	onOutside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#ffffff'; }
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: new Paperless.Drawables.Triangle({
		context: context,
		point: {x: 50, y: 50}, 
		outerRadius: 30, 
		nostroke: true, 
		fillcolor: '#ffffff', 
		sticky: true, 
		angle: 180
	}),
	callbackLeftClick: () => {
		if(radius >= 150)
		{
			radius -= 50;

			number.content = radius.toString();
			number.generate();
	
			proximity.outerRadius = radius;
			proximity.generate();
		}
	},
	onInside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#c8af55'; },
	onOutside: (self?: Paperless.Control) => { self.drawable.fillcolor = '#ffffff'; }
});

for(let i: number = 0; i < 100; i++)
{
	const outerRradius: number = Math.floor(Math.random() * 30 + 20);
	const x: number = (Math.random() * (context.canvas.width - (outerRradius * 2))) + outerRradius;
	const y: number = (Math.random() * (context.canvas.height - (outerRradius * 2))) + outerRradius;

	const drawable: Paperless.Drawable = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: x, y: y},
		outerRadius: outerRradius,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	});
	
	new Paperless.Controls.Button({
		context: context,
		drawable: drawable,
		movable: false,
		callbackLeftClick: () => {
			const near: Paperless.Drawable[] = drawable.near(radius * 2);
			const filtered: Paperless.Drawable[] = near.filter((drawable: Paperless.Drawables.Smiley | Paperless.Drawables.Circle) => 
				(
					Paperless.Drawable.isCircleInsideCircle(drawable, proximity) ||
					Paperless.Intersects.isCircleIntersectCircle(drawable, proximity)
				) &&
				drawable.constructor.name != 'Triangle' &&
				drawable.constructor.name != 'Label' &&
				drawable.guid != proximity.guid
			)

			for(let drawable of filtered)
			{
				const distance: number = Math.floor(window.innerHeight - drawable.y - (drawable.height / 2));

				context.fx.add({
					duration: distance * 2,
					drawable: drawable,
					effect: context.fx.translate,
					smuggler: { 
						ease: Paperless.Fx.easeOutBounce, 
						angle: Paperless.Enums.Direction.down, 
						distance: distance
					},
				});
			}
		},
		onInside: (self?: Paperless.Control) => {
			proximity.x = self.drawable.x;
			proximity.y = self.drawable.y;
			proximity.visible = true;
		},
		onOutside: (self?: Paperless.Control) => {
			proximity.visible = false;
		}
	});
}

context.attach(document.body);
