

import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const physic: Paperless.Physic = new Paperless.Physic();
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

context.attach(document.body);
context.attach(physic);


for(let i: number = 1; i < 100; i += 1)
{
	const smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight},
		outerRadius: 10,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		hoverable: false
	});

	smiley.physic = {
		mass: 10,
		velocity: new Paperless.Vector({magnitude: 0.1, rad: Math.random() * 6.28})
	}

	context.fx.add({
		duration: 1,
		drawable: smiley,
		effect: bounce,
		loop: true,
		smuggler: { 
			ease: Paperless.Fx.easeLinear, 
		},
	});
}

/*
context.getDrawables().map.forEach((data) => {
	console.log(data)
})
*/
/*
for(let x: number = 1; x < 60; x += 1)
{
	const smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: 15 + (x * 15), y: 15 + (x * 15)},
		outerRadius: 10,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		hoverable: false
	});

	smiley.physic = {
		mass: 10,
		velocity: new Paperless.Vector({magnitude: 0.2, rad: Math.random() * 6.28})
	}

	context.fx.add({
		duration: 1,
		drawable: smiley,
		effect: bounce,
		loop: true,
		smuggler: { 
			ease: Paperless.Fx.easeLinear, 
		},
	});
}

for(let x: number = 1; x < 16; x += 1)
{
	const smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: 30 + (x * 45), y: 200 + (x * 45)},
		outerRadius: 30,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		hoverable: false
	});

	smiley.physic = {
		mass: 20,
		velocity: new Paperless.Vector({magnitude: 0.2, rad: Math.random() * 6.28})
	}

	context.fx.add({
		duration: 1,
		drawable: smiley,
		effect: bounce,
		loop: true,
		smuggler: { 
			ease: Paperless.Fx.easeLinear, 
		},
	});
}

for(let x: number = 1; x < 6; x += 1)
{
	const smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: 250 * x, y: 100},
		outerRadius: 50,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		hoverable: false
	});

	smiley.physic = {
		mass: 30,
		velocity: new Paperless.Vector({magnitude: 0.2, rad: Math.random() * 6.28})
	}

	context.fx.add({
		duration: 1,
		drawable: smiley,
		effect: bounce,
		loop: true,
		smuggler: { 
			ease: Paperless.Fx.easeLinear, 
		},
	});
}

for(let x: number = 1; x < 4; x += 1)
{
	const smiley = new Paperless.Drawables.Smiley({
		context: context,
		point: {x: 600 + (x * 200), y: 400},
		outerRadius: 70,
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		hoverable: false
	});

	smiley.physic = {
		mass: 50,
		velocity: new Paperless.Vector({magnitude: 0.2, rad: Math.random() * 6.28})
	}

	context.fx.add({
		duration: 1,
		drawable: smiley,
		effect: bounce,
		loop: true,
		smuggler: { 
			ease: Paperless.Fx.easeLinear, 
		},
	});
}
*/

/*
for(let x: number = 100; x < 1500; x += (radius * 3))
{
	for(let y: number = 150; y < 600; y += (radius * 3))
	{
		const smiley = new Paperless.Drawables.Smiley({
			context: context,
			point: {x: x, y: y},
			outerRadius: Math.floor(Math.random() * radius) + 20,
			fillcolor: colors[Math.floor(Math.random() * 5)],
			nostroke: true
		});

		smiley.physic.mass = smiley.outerRadius * smiley.outerRadius * smiley.outerRadius;
		smiley.physic.acceleration = 1;
		smiley.physic.velocity = new Paperless.Vector(3, 3);
		smiley.physic.rad = Math.random() * 6.28;
		smiley.physic.vector.x = Math.floor(Math.random() * 7) + 1;
		smiley.physic.vector.y = Math.floor(Math.random() * 7) + 1;

		
		context.fx.add({
			duration: 1,
			drawable: smiley,
			effect: bounce,
			loop: true,
			smuggler: { 
				ease: Paperless.Fx.easeLinear, 
			},
		});
		
	}
}
*/


const smiley1 = new Paperless.Drawables.Smiley({
	context: context,
	point: {x: 150, y: 300},
	outerRadius: 10,
	fillcolor: colors[Math.floor(Math.random() * 5)],
	nostroke: true,
	hoverable: false
});

const smiley2 = new Paperless.Drawables.Smiley({
	context: context,
	point: {x: 500, y: 300},
	outerRadius: 60,
	fillcolor: colors[Math.floor(Math.random() * 5)],
	nostroke: true,
	hoverable: false
})

smiley1.physic = {
	mass: 10,
	velocity: new Paperless.Vector({magnitude: 0.1, rad: 6.28})
}

smiley2.physic = {
	mass: 1000,
	velocity: new Paperless.Vector({magnitude: 0.1, rad: 3.14})
}

context.fx.add({
	duration: 1,
	drawable: [smiley1, smiley2],
	effect: bounce,
	loop: true,
	smuggler: { 
		ease: Paperless.Fx.easeLinear,
		data: {
			lastPoint: smiley1.point
		} 
	},
});


function bounce(fx: Paperless.Interfaces.IFx) 
{
	const currentSmiley: Paperless.Drawables.Smiley = <Paperless.Drawables.Smiley>fx.drawable;
	const drawables: Paperless.Drawable[] = context.getDrawables().filter((drawable: Paperless.Drawable) =>
		drawable.guid != currentSmiley.guid &&
		(drawable instanceof Paperless.Drawables.Smiley || drawable instanceof Paperless.Drawables.Circle)
	);
	
	currentSmiley.x += Math.cos(currentSmiley.physic.velocity.components.rad) * currentSmiley.physic.velocity.components.magnitude * fx.tdelta;
	currentSmiley.y += Math.sin(currentSmiley.physic.velocity.components.rad) * currentSmiley.physic.velocity.components.magnitude * fx.tdelta;

	if(currentSmiley.x < currentSmiley.outerRadius)
	{
		currentSmiley.x = currentSmiley.outerRadius;
		currentSmiley.physic.velocity.rad(3.14 - currentSmiley.physic.velocity.components.rad); 
	}

	else if(currentSmiley.x > context.canvas.width - currentSmiley.outerRadius)
	{
		currentSmiley.x = context.canvas.width - currentSmiley.outerRadius;
		currentSmiley.physic.velocity.rad(3.14 - currentSmiley.physic.velocity.components.rad); 
	}

	if(currentSmiley.y < currentSmiley.outerRadius)
	{
		currentSmiley.y = currentSmiley.outerRadius;
		currentSmiley.physic.velocity.rad(6.28 - currentSmiley.physic.velocity.components.rad); 
	}

	else if(currentSmiley.y > context.canvas.height - currentSmiley.outerRadius)
	{
		currentSmiley.y = context.canvas.height - currentSmiley.outerRadius;
		currentSmiley.physic.velocity.rad(6.28 - currentSmiley.physic.velocity.components.rad);
	}

	else
	{
		drawables.forEach((otherSmiley: Paperless.Drawable) => {
			if(currentSmiley.intersectCircle(otherSmiley))
				physic.addCollision(currentSmiley, otherSmiley);
		});
	}
}
