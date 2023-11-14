import * as Paperless from './lib.paperless.js';



const context: Paperless.Context = new Paperless.Context({autosize: true, dragging: {delay: 0}});
const colors: string[] = ["#815556", "#436665", "#9a6c27", "#769050", "#c8af55"];
const vertical: Paperless.Group = context.attach(new Paperless.Group());
const horizontal: Paperless.Group = context.attach(new Paperless.Group());
const everyone: Paperless.Group = context.attach(new Paperless.Group());

const left: Paperless.Drawables.Arrow = new Paperless.Drawables.Arrow({
	context: context,
	point: {x: (window.innerWidth / 2) - 100, y: (window.innerHeight / 2) - 30},
	fillcolor: colors[3], 
	angle: 270,
	nostroke: true
});

const right: Paperless.Drawables.Arrow = new Paperless.Drawables.Arrow({
	context: context,
	point: {x: (window.innerWidth / 2) - 100, y: (window.innerHeight / 2) + 30},
	fillcolor: colors[3], 
	angle: 90,
	nostroke: true
});

const top: Paperless.Drawables.Arrow = new Paperless.Drawables.Arrow({
	context: context,
	point: {x: (window.innerWidth / 2) - 30, y: (window.innerHeight / 2) - 100},
	fillcolor: colors[4], 
	angle: 180,
	nostroke: true
});

const bottom: Paperless.Drawables.Arrow = new Paperless.Drawables.Arrow({
	context: context,
	point: {x: (window.innerWidth / 2) + 30, y: (window.innerHeight / 2) - 100},
	fillcolor: colors[4], 
	angle: 0,
	nostroke: true
});

const orange: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
	context: context,
	fillcolor: colors[2],
	nostroke: true
});

const blue: Paperless.Drawables.Circle = orange.clone({
	context: context,
	offset1: {x: 100, y: 100},
	fillcolor: colors[1]
});

const pink1: Paperless.Drawables.Circle = orange.clone({
	context: context,
	offset1: {x: -100, y: -100},
	fillcolor: colors[0]
});

const pink2: Paperless.Drawables.Circle = pink1.clone({
	context: context,
	offset1: {x:-100, y: 100}, 
	matrix: pink1.matrix
})

const pink3: Paperless.Drawables.Circle = pink1.clone({
	context: context,
	offset1: {x: 100, y: -100}, 
	matrix: pink1.matrix	
})

new Paperless.Control({
	context: context,
	drawable: left,
	restrict: Paperless.Enums.Restrict.vertical
});

new Paperless.Control({
	context: context,
	drawable: right,
	restrict: Paperless.Enums.Restrict.vertical
});

new Paperless.Control({
	context: context,
	drawable: top,
	restrict: Paperless.Enums.Restrict.horizontal
});

new Paperless.Control({
	context: context,
	drawable: bottom,
	restrict: Paperless.Enums.Restrict.horizontal
});

new Paperless.Control({
	context: context,
	drawable: pink1
});

new Paperless.Control({
	context: context,
	drawable: pink2
});

new Paperless.Control({
	context: context,
	drawable: pink3
});

new Paperless.Control({
	context: context,
	drawable: blue
});

new Paperless.Control({
	context: context,
	drawable: orange
});

context.attach(document.body);

horizontal.attach([left, right]);
vertical.attach([top, bottom]);

everyone.attach(orange);
everyone.enroll([left, right, top, bottom, pink1, pink2, pink3, blue])
