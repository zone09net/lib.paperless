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


/*
let icons = {
	close: 
	[
		{
			d: 'M 15.264998,8.0000583 A 7.2649985,7.2650519 0 0 1 7.9999993,15.26511 7.2649985,7.2650519 0 0 1 0.73500063,8.0000583 7.2649985,7.2650519 0 0 1 7.9999993,0.7350062 7.2649985,7.2650519 0 0 1 15.264998,8.0000583 Z',
			style: 'fill:#color1;'
		},	
		{
			d: 'm 8.0000217,-2.9653146e-4 c -4.4095659,0 -8.00052750779,3.59098053146 -8.00052750779,8.00058633146 0,4.4095982 3.59096160779,7.9991222 8.00052750779,7.9991222 4.4095663,0 8.0005273,-3.589524 8.0005273,-7.9991222 0,-4.4096058 -3.590961,-8.00058633146 -8.0005273,-8.00058633146 z m 0,1.47029923146 c 3.6151213,0 6.5302393,2.9151395 6.5302393,6.5302871 0,3.6151402 -2.915118,6.5302872 -6.5302393,6.5302872 -3.615121,0 -6.530239,-2.915147 -6.530239,-6.5302872 0,-3.6151476 2.915118,-6.5302871 6.530239,-6.5302871 z',
			style: 'fill:#000000;fill-opacity:0.5;'
		},	
		{
			d: 'M 12.314384,4.0341747 9.6962791,7.8761278 12.2989,11.965946 H 9.4793941 L 8.3330129,9.8280833 Q 8.1935875,9.5724782 7.9999384,9.1077204 H 7.9689703 Q 7.8527808,9.4330529 7.6513896,9.8048474 L 6.4972566,11.965946 H 3.6855029 L 6.3655733,8.0155532 3.8481643,4.0341747 H 6.6831539 L 7.814051,6.257237 q 0.2246369,0.4415219 0.3175806,0.7436086 h 0.030968 Q 8.2865313,6.6367834 8.4956743,6.2417529 l 1.154133,-2.2075782 z',
			style: 'fill:#000000;fill-opacity:0.5;'
		},	
	],

}


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


let svg: string = toSVG('#815556', '', icons.close, new Paperless.Size(16, 16));

let drawable: Paperless.Drawable = context.attach(new Paperless.Drawables.Artwork(new Paperless.Point(500, 500), new Paperless.Size(16, 16), {content: toBase64(svg)}));
context.attach(drawable)
*/


/*
// label
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





