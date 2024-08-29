
import * as Paperless from './lib.paperless.js';



const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const context: Paperless.Context = new Paperless.Context({
	autosize: true, 
	dragging: {
		delay: 0
	}
});
const matter: Paperless.Matter = new Paperless.Matter({
	context: context, 
	norender: true,
	/*
	engine: {
		gravity: {
			scale: 0, 
			x: 0, 
			y: 0
		}
	}
	*/
});

context.attach(document.body);
context.loop();

context.canvas.style.position = 'absolute';
context.canvas.style.top = '0';
context.canvas.style.left = '0';

matter.Rectangle({point: {x: -8, y: window.innerHeight / 2}, size: {width: 16, height: window.innerHeight}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth + 8, y: window.innerHeight / 2}, size: {width: 16, height: window.innerHeight}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth / 2, y: -8}, size: {width: window.innerWidth, height: 16}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth / 2, y: window.innerHeight + 8}, size: {width: window.innerWidth, height: 16}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});

/*
for(let i: number = 0; i < 30; i++)
{
	const entity: {drawable: Paperless.Drawable, body: any } = matter.Rectangle(
		{
			point:{x: window.innerWidth / 2, 
			y: window.innerHeight / 2}, 
			size: {width: (Math.random() * 100) + 25,
			height: (Math.random() * 100) + 25},
			//radius: (Math.random() * 50) + 25,
			//maxsides: 16,
			options: {
				isStatic: false,
				//slop: 1, 
				//friction: 1,    
				//frictionStatic: 1,
				//density: 1,
				//stiffness: 1,
				//friction: 0,
				//frictionAir: 0,
				//frictionStatic: 0,
				//restitution: 1,
				//density: 0.005,
				//force: {
				//	x:	(Math.random() >= 0.5 ? 1 : -1) * (0.15 + Math.random()/10), 
				//	y: (Math.random() >= 0.5 ? 1 : -1) * Math.random()/6 
				//},
				//inertia: Infinity,
			}
		},
		{
			fillcolor: colors[Math.floor(Math.random() * 5)],
			nostroke: true
		}
	);

	Matter.Body.setVelocity(entity.body, {
		x: Math.cos(Math.random() * 6.28) * ((Math.random() * 4) + 5),
		y: Math.sin(Math.random() * 6.28) * ((Math.random() * 4) + 5)
	});

	new Paperless.Control({
		context: context,
		drawable: entity.drawable,
	});
}
*/

// rectangle
const rectangle: Paperless.Interfaces.IMatterEntity = matter.Rectangle(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		size: {width: (Math.random() * 100) + 25, height: (Math.random() * 100) + 25},
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true
	}
);

// smiley
const smiley: Paperless.Interfaces.IMatterEntity = matter.Smiley(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		radius: (Math.random() * 50) + 25,
		sides: 16,
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true
	}
);

// hexagon
const hexagon: Paperless.Interfaces.IMatterEntity = matter.Hexagon(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		outerRadius: (Math.random() * 50) + 25,
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true
	}
);

// arrow
const arrow: Paperless.Interfaces.IMatterEntity = matter.Arrow(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2},
		size: {width: (Math.random() * 100) + 25, height: (Math.random() * 100) + 25},
		baseHeight: 20,
		baseWidth: 20,
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true
	}
);

// circle
const circle: Paperless.Interfaces.IMatterEntity = matter.Circle(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		outerRadius: (Math.random() * 50) + 25,
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true
	}
);

// polygon
const polygon: Paperless.Interfaces.IMatterEntity = matter.Polygon(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		outerRadius: 400,
		innerRadius: 380,
		sides: 6,
		options: {
			isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	}
);

context.fx.add({
	duration: 5000,
	drawable: polygon.drawable,
	loop: true,
	smuggler: { 
		ease: Paperless.Fx.easeLinear, 
		angle: Math.random() < 0.5 ? -1 : 1 
	},
	effect: (fx: Paperless.Interfaces.IFx) => {
		const rad: number = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
	
		(<Paperless.Drawable>fx.drawable).rad = rad;
		matter.MatterJS.Body.setAngle(polygon.body, rad)
	},
});


// *** CHECK NORENDER

