import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];

const horizontal = new Paperless.Drawables.Line({
	context: context,
	point0: {x: window.innerWidth / 2, y: 0},
	point1: {x: window.innerWidth / 2, y: window.innerHeight},
	alpha: 0.3,
	linewidth: 1,
	strokecolor: colors[0]
});

const vertical = horizontal.clone({
	context: context,
	point0: {x: 0, y: window.innerHeight / 2},
	point1: {x: window.innerWidth, y: window.innerHeight / 2},
});

const origin = new Paperless.Drawables.Rectangle({
	context: context,
	size: {width: 25, height: 200},
	nofill: true,
	rounded: {topLeft: 13, bottomLeft: 13, bottomRight: 13},
	linewidth: 5,
	alpha: 0.3,
	strokecolor: colors[0]
});

const clone = origin.clone({
	context: context,
	alpha: 1,
	linewidth: 1,
	strokecolor: colors[4]
});



context.attach(document.body);

clone
	.translate({x: 100, y: 100})	
	.rotate({angle: 90})
	.reflect({angle: 90})
	

	









