import * as Paperless from './lib.paperless.js';



let context: Paperless.Context = new Paperless.Context({autosize: true, dragging: {delay: 0}});
context.attach(document.body);


/*
let drawable1: Paperless.Drawable;
let drawable2: Paperless.Drawable;
let control: Paperless.Control;

drawable1 = context.attach(new Smiley(new Paperless.Point(300, 300), 100));
drawable2 = context.attach(new Smiley(new Paperless.Point(600, 600), 100, {offset: {x: 100, y: 100}}));
drawable2.matrix = drawable1.matrix;

control = context.attach(new Paperless.Controls.Button(() => {
	drawable1.x = 600;
	console.log(drawable1.matrix, drawable2.matrix)
}))

control.attach(drawable1);
*/

//let gaga: Paperless.Drawables.Rectangle = context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(200, 100), new Paperless.Size(100, 100), {rotation: 0, scale: {x:1, y:1}}));
//gaga.scaley = 0.5;


/*
let drawable: Paperless.Drawables.Rectangle = context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(100, 100), new Paperless.Size(50, 100), {angle: 0, scale: {x:1, y:1}}));
let control: Paperless.Control =  context.attach(new Paperless.Controls.Button(() => {
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
}));
control.attach(drawable);
*/





/*
context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(225, 600), new Paperless.Size(450, 1200), {fillcolor: '#323232', nostroke: true}));
context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(448, 600), new Paperless.Size(0, 0), '/separator.png', {nostroke: true, autosize: true}));
//context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(435, 181), new Paperless.Size(0, 0), '/hac.png', {nostroke: true, autosize: true}));
context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(219, 91), new Paperless.Size(0, 0), '/paperless.png', {nostroke: true, autosize: true}));
//context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(260, 142), new Paperless.Size(0, 0), '/hook.png', {nostroke: true, autosize: true}));
*/



let icon = 
	[
		{
			d: 'm 15.545623,20.254616 c -1.997262,-0.299726 -4.27111,-1.780348 -4.59765,-2.993768 -0.18747,-0.696642 0.08663,-1.388163 0.700769,-1.767956 0.307549,-0.190193 0.503092,-0.229653 0.953025,-0.192318 0.505365,0.04194 0.650986,0.118305 1.357653,0.712013 0.891204,0.748749 1.58226,1.035053 2.502984,1.036984 0.766329,0.0016 1.354884,-0.170131 1.956176,-0.570805 0.264513,-0.17626 2.118216,-1.96896 4.119342,-3.983777 4.209404,-4.2382033 4.159005,-4.1682054 4.159005,-5.7764074 0,-0.9385739 -0.02836,-1.0806947 -0.321242,-1.6097949 C 25.681699,3.855081 24.489367,3.1944927 23.068963,3.2767628 21.785399,3.3511068 21.433204,3.5879957 18.862274,6.1062089 L 16.625265,8.2973497 16.029629,8.0831234 C 15.240631,7.7993522 13.392765,7.783971 12.672408,8.0551795 12.233541,8.2204089 12.540533,7.8847995 15.758885,4.6809799 19.079183,1.3756762 19.390318,1.0955037 20.144932,0.7314173 21.232392,0.2067405 22.100063,0 23.214636,0 c 1.16933,0 1.868927,0.146944 2.857428,0.6001752 1.509898,0.6922935 2.635813,1.8184318 3.326937,3.3275986 C 29.853137,4.919443 30,5.6187552 30,6.7895472 c 0,1.1128897 -0.205958,1.9806985 -0.728984,3.0715968 -0.367581,0.766679 -0.629509,1.052626 -4.6225,5.046373 -4.569219,4.570085 -4.672701,4.654362 -6.290492,5.123074 -0.932997,0.27031 -1.959245,0.352058 -2.812401,0.224025 z',
			style: 'fill:#color2;'
		},	
		{
			d: 'M 5.0883939,29.852682 C 3.2270509,29.345315 1.6134289,28.076005 0.77167893,26.457056 0.21665193,25.389567 0.00206493,24.494806 1.3926757e-5,23.239451 -0.00188607,22.063849 0.19038593,21.243532 0.72295593,20.155395 1.0943069,19.396658 1.3982279,19.064549 5.2975859,15.156475 c 2.647923,-2.653839 4.370324,-4.296886 4.7053921,-4.488604 2.334011,-1.3354631 5.101649,-1.2683141 7.259959,0.176142 1.41559,0.947388 2.036091,1.862898 1.806209,2.664945 -0.155434,0.5423 -0.311485,0.762381 -0.719475,1.014689 -0.307549,0.190193 -0.503092,0.229653 -0.953025,0.192318 -0.505365,-0.04194 -0.650986,-0.118305 -1.357653,-0.712014 -0.9364,-0.786721 -1.593871,-1.043863 -2.63414,-1.030238 -1.391356,0.01822 -1.506472,0.105737 -5.7832371,4.39651 -4.390192,4.404572 -4.32013,4.308439 -4.32013,5.927734 0,0.938574 0.02836,1.080695 0.321242,1.609795 0.693986,1.253706 1.886318,1.914294 3.306722,1.832024 1.283564,-0.07435 1.63576,-0.311233 4.2066891,-2.829446 l 2.237009,-2.191141 0.595636,0.204332 c 0.911563,0.312711 2.172356,0.350175 3.075843,0.0914 l 0.747446,-0.214082 -3.346585,3.352449 c -3.538576,3.544774 -4.132874,4.034005 -5.4793101,4.510603 -0.998882,0.353574 -2.928594,0.447524 -3.877784,0.188791 z',
			style: 'fill:#color1;'
		},	

	];


function toSVG(color1: string, color2: string, paths: Array<{d: string, style: string}>, size: Paperless.Size): string
{
	let svg: string;

	svg = '<svg width="' + size.width + '" height="' + size.height + '" viewBox="0 0 ' + size.width + ' ' + size.height + '" xmlns="http://www.w3.org/2000/svg">';

	for(let path of paths)
	{ 
		svg += '<path d="' + path.d.replace(/(\.[\d]{2})\d+/g, '$1') + '" style="' + path.style.replace('#color1', color1).replace('#color2', color2) + '" />';
		console.log('{\n\td: \'' + path.d.replace(/(\.[\d]{2})\d+/g, '$1') + '\',\n\tstyle: \'' + path.style + '\'\n},\t');
	}

	svg += '</svg>';

	return svg;
}

function toBase64(svg: string)
{
	return 'data:image/svg+xml;base64,' + btoa(svg);
}

let svg: string = toSVG('#c8af55', '#769050', icon, new Paperless.Size(182, 128));
let drawable: Paperless.Drawable = context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), new Paperless.Size(182, 128), {content: toBase64(svg)}));
context.attach(drawable)




// label
/*
let point: Paperless.Point = new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2);
let zone09net: Paperless.Drawable = context.attach(new Paperless.Drawables.Label(point, new Paperless.Size(100, 100), {
	content: '( zone09.net )',
	fillcolor: '#ffffff', 
	fillbackground: '#777777',
	font: '24px SegoeUI-Bold', 
	//corner: true, 
	//autosize: true, 
	wrapping: false, 
	multiline: true, 
	autosize: true,
	filter: {
		0: {
			6: {fillcolor: '#deaf2f'}, 
			8: {fillcolor: '#ffffff'}
		}
	} 
}));

context.attach(new Paperless.Drawables.Cross(point, new Paperless.Size(100, 100), {strokecolor: '#666666'}));
*/

//context.attach(new Paperless.Drawables.Cross(new Paperless.Point(zone09net.boundaries.topleft.x, zone09net.boundaries.topleft.y), new Paperless.Size(10, 10), {nofill: true, strokecolor: '#deaf2f'}));
//context.attach(new Paperless.Drawables.Cross(new Paperless.Point(zone09net.boundaries.bottomright.x, zone09net.boundaries.bottomright.y), new Paperless.Size(10, 10), {nofill: true, strokecolor: '#deaf2f'}));





/*
import * as HaC from './lib.hac.js';

let selector1: HaC.Controls.Selector.Selector = context.attach(new HaC.Controls.Selector.Selector());
let selector2: HaC.Controls.Selector.Selector = context.attach(new HaC.Controls.Selector.Selector());

selector1.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#87172f'})));
selector2.attach(context.attach(new Paperless.Drawables.Circle(new Paperless.Point(0, 0), 15, 0, {fillcolor: '#87aa2f'})));

let relay: HaC.Controls.Selector.Relay = new HaC.Controls.Selector.Relay(HaC.Controls.Selector.Manipulator, [selector1, selector2]);
let slider: HaC.Components.Slider = new HaC.Components.Slider(new Paperless.Point(200, 200), relay);
context.attach(slider)
*/







/*
let t1: number;
let t2: number;

t1 = new Date().getTime();
for(let i: number = 0; i < 1000; i++)
	context.getGuidGenerator().create('1', 'b');
t2 = new Date().getTime();
console.log((t2 - t1) + ' ms');

t1 = new Date().getTime();
for(let k: number = 0; k < 1000; k++)
{
	//let pattern: string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
	let random: string = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
	let splitted: Array<string> = random.substring(0, 36).split('');
	splitted[8] = '-';
	splitted[13] = '-';
	splitted[14] = 'V'
	splitted[18] = '-';
	splitted[19] = 'V'
	splitted[23] = '-';
	random = splitted.join('');
}

t2 = new Date().getTime();
console.log((t2 - t1) + ' ms');


let random: string = Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2);
let splitted: Array<string> = random.substring(0, 36).split('');
splitted[8] = '-';
splitted[13] = '-';
splitted[18] = '-';
splitted[23] = '-';
random = splitted.join('');

console.log(random)
*/


/*

let label: Paperless.Drawables.Label = new Paperless.Drawables.Label(new Paperless.Point(20, 220), new Paperless.Size(200, 100), 'This is a huge test for the sake of the label because I want this to be perfect!!!', {
	font: '14px CPMono_v07_Light',
	fillcolor: '#999999',
	middlepoint: true,
	multiline: true,
	wrap: true,
	autosize: false,
	monofont: true
});
context.attach(label);

*/





