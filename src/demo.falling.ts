import * as Paperless from './lib.paperless.js';


const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

context.attach(document.body);

for(let i: number = 0; i < 100; i++)
{
	const radius: number = Math.floor(Math.random() * 30 + 20);
	const x: number = (Math.random() * (context.canvas.width - (radius * 2))) + radius;
	const y: number = (Math.random() * (context.canvas.height - (radius * 2))) + radius;

	const drawable: Paperless.Drawable = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: x, y: y},
		outerRadius: radius,
		fillcolor: colors[Math.floor(Math.random() * 5)],
	});
	
	new Paperless.Controls.Button({
		context: context,
		drawable: drawable,
		callbackLeftClick: () => {
			for(let near of drawable.near(100))
			{
				const distance: number = Math.floor(window.innerHeight - near.y - (near.height / 2));

				context.fx.add({
					duration: distance * 2,
					drawable: near,
					effect: context.fx.translate,
					smuggler: { 
						ease: Paperless.Fx.easeOutBounce, 
						angle: Paperless.Enums.Direction.down, 
						distance: distance
					},
				});
			}
		}
	});
}

