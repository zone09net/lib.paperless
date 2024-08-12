import * as Paperless from './lib.paperless.js';




const context: Paperless.Context = new Paperless.Context({autosize: true, dragging: {delay: 0}});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

context.attach(document.body);



// --------------------------------------------------
// drawables + boundaries

const arrow: Paperless.Drawables.Arrow = new Paperless.Drawables.Arrow({
	context: context,
	point: {x: 50, y: 50},
	nostroke: true,
	angle: Paperless.Enums.Direction.right,
	baseWidth: 20,
	baseHeight: 20,
});

const artwork: Paperless.Drawables.Artwork = new Paperless.Drawables.Artwork({
	context: context,
	content: 'data:image/png;base64,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',
	point: {x: 125, y: 50},
});

const circle: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
	context: context,
	point: {x: 200, y: 50},
	innerRadius: 15,
	angleStart: 90,
});

const cross = new Paperless.Drawables.Cross({
	context: context,
	point: {x: 275, y: 50},
	angle: 0,
});

const hexagon = new Paperless.Drawables.Hexagon({
	context: context,
	point: {x: 350, y: 50},
});

const label = new Paperless.Drawables.Label({
	context: context,
	point: {x: 425, y: 50},
	content: 'hello world',
	fillbackground: '#a0a0a0',
	fillcolor: '#000000',
	autosize: false,
	corner: false,
	wrapping: true,
	multiline: true,
	padding: {left: 4, top: 4, right: 4},
	font: '15px impact'
});

const line = new Paperless.Drawables.Line({
	context: context,
	point0: {x: 25, y: 100},
	point1: {x: 825, y: 100},
});

const rectangle = new Paperless.Drawables.Rectangle({
	context: context,
	point: {x: 500, y: 50},
	size: {width: 40, height: 40},
	nofill: true,
	rounded: {topLeft: 10, bottomRight: 10},
	linewidth: 10
});

const smiley = new Paperless.Drawables.Smiley({
	context: context,
	point: {x: 575, y: 50},
});

const star = new Paperless.Drawables.Star({
	context: context,
	point: {x: 650, y: 50},
	innerRadius: 10,
	spikes: 10,
	nostroke: true
});

const triangle = new Paperless.Drawables.Triangle({
	context: context,
	point: {x: 725, y: 50},
	angle: 75,
});

const blade = new Paperless.Drawables.Blade({
	context: context,
	point: {x: 800, y: 50},
	spikes: 6,
	twist: 4
});


const polygon: Paperless.Drawable = blade;
const boundaries = new Paperless.Drawables.Rectangle({
	context: context,
	size: {width: polygon.boundaries.bottomright.x - polygon.boundaries.topleft.x, height: polygon.boundaries.bottomright.y - polygon.boundaries.topleft.y},
	strokecolor: '#ff0000',
	nofill: true,
	point: {x: polygon.x, y: polygon.y},
});



// --------------------------------------------------
// simple animation

/*
const drawable: Paperless.Drawables.Rectangle = new Paperless.Drawables.Rectangle({
	context: context,
	point: {x: 100, y: 100}, 
	size: {width: 50, height: 100}, 
	angle: 0, 
	scale: {x:1, y:1}
});

new Paperless.Controls.Button({
	movable: false,
	context: context,
	drawable: drawable,
	callbackLeftClick: () => {
		context.fx.add({
			duration: 1000,
			drawable: drawable, 
			effect: context.fx.translate,
			smuggler: { ease: Paperless.Fx.easeOutBounce, angle: 0, distance: 300 },
			complete: () => {  

			}
		});
		context.fx.add({
			duration: 1000,
			drawable: drawable,
			effect: context.fx.scale,
			//loop: true,
			smuggler: { ease: Paperless.Fx.easeOutBounce, scale: {x: -0.2, y: -0.2}, angle: 45, distance: 300 },
			complete: () => {  
			}
		});
		context.fx.add({
			duration: 250,
			drawable: drawable,
			effect: context.fx.rotate,
			//loop: true,
			smuggler: { ease: Paperless.Fx.easeLinear, scale: {x: 0.5, y: 0.5}, angle: 90, distance: 300 },
			complete: () => {  
			}
		});
	},
});
*/





