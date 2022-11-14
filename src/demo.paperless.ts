

import * as Paperless from '@zone09.net/paperless';
import {Triangle} from './demo.paperless/drawables/Triangle.js'
import {Smiley} from './demo.paperless/drawables/Smiley.js'
import {Vortex} from './demo.paperless/drawables/Vortex.js'
import {Disappear} from './demo.paperless/controls/Disappear.js'
import {Effects} from './demo.paperless/fx/Effects.js'



let context: Paperless.Context = new Paperless.Context({stageOffset: 0, autosize: true});
context.attach(document.body);



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
// group
let group: Paperless.Group = context.attach(new Paperless.Group());
let smiley1: Smiley = context.attach(new Smiley(new Paperless.Point((window.innerWidth / 2) - 100, (window.innerHeight / 2) - 100), 50))
let smiley2: Smiley = context.attach(new Smiley(new Paperless.Point((window.innerWidth / 2) + 100, (window.innerHeight / 2) + 100), 50))
let smiley3: Smiley = context.attach(new Smiley(new Paperless.Point((window.innerWidth / 2) + 100, (window.innerHeight / 2) - 100), 50))
let smiley4: Smiley = context.attach(new Smiley(new Paperless.Point((window.innerWidth / 2) - 100, (window.innerHeight / 2) + 100), 50))
let control1: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank);
let control2: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank);
let control3: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank);
let control4: Paperless.Controls.Blank = context.attach(new Paperless.Controls.Blank);

control1.attach(smiley1);
control2.attach(smiley2);
control3.attach(smiley3);
control4.attach(smiley4);

group.attach([smiley1, smiley2])
*/


/*
// kill the 500
for(let i: number = 0; i < 500; i++)
{
	let drawable: Paperless.Drawable;
	let control: Paperless.Control;
	let radius: number = Math.floor(Math.random() * 30 + 20);
	let x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
	let y: number = (Math.random() * (window.innerHeight - (radius * 2) )) + radius;

	drawable = context.attach(new Smiley(new Paperless.Point(x, y), radius));
	control = context.attach(new Disappear())

	control.attach(drawable);
}
*/


/*
// vortex
for(let adder: number = 10, space: number = 4; adder < 400; adder+= space)
{
	context.fx.add({
		duration: Math.floor(Math.random() * 2000 + 2000),
		drawable: context.attach(new Vortex(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), adder + space, adder)),
		effect: Effects.fullRotate,
		loop: true,
		smuggler: { ease: Paperless.Fx.easeLinear, custom: {reverse: Math.round(Math.random())} },
	});
}
*/


/*
// bouncing smileys
for(let i: number = 0; i < 1; i++){
	context.fx.add({
		duration: 1,
		drawable: context.attach(new Smiley(new Paperless.Point(window.innerWidth / 2, window.innerHeight / 2), 50)),
		effect: Effects.bounce,
		loop: true,
		smuggler: { ease: Paperless.Fx.easeLinear, custom: {} },
	});
}
*/


/*
// falling smileys
for(let i: number = 0; i < 50; i++)
{
	let radius: number = Math.floor(Math.random() * 30 + 20);
	let x: number = (Math.random() * (window.innerWidth - (radius * 2))) + radius;
	let y: number = (Math.random() * (window.innerHeight - (radius * 2))) + radius;

	let drawable: Paperless.Drawable = context.attach(new Smiley(new Paperless.Point(x, y), radius));
	let control: Paperless.Control = context.attach(new Paperless.Controls.Button(() => {
		let guids: Array<string> = [];
		
		Paperless.Context.near(drawable.context.getDrawables(), drawable.point, 100, guids)

		for(let guid of guids)
		{
			let drawable: Paperless.Drawable = context.get(guid);
			let distance: number = Math.floor(window.innerHeight - drawable.point.y - (drawable.size.height / 2));

			context.fx.add({
				duration: distance * 2,
				drawable: drawable,
				effect: context.fx.move,
				smuggler: { ease: Paperless.Fx.easeOutBounce, angle: 90, distance: distance },
			});
		}
	}))

	control.attach(drawable);
}
*/



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






// polygon
// ----------

//context.attach(group1);
//context.attach(group2);

for(let i: number = 0; i < 20; i++)
{
	let random: number = Math.floor(Math.random() * 4);
	let color: string = '#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16);
	let radius: number = Math.floor(Math.random() * 30 + 20);
	let width: number = Math.floor(Math.random() * 60 + 20);
	let height: number = Math.floor(Math.random() * 60 + 20);
	let x: number = (Math.random() * (window.innerWidth - width - 486)) + (width / 2) + 486;
	let y: number = (Math.random() * (window.innerHeight - height - 300)) + (height / 2) + 300;
	let rx: number = (Math.random() * (window.innerWidth - (radius * 2) - 486)) + radius + 486;
	let ry: number = (Math.random() * (window.innerHeight - (radius * 2) - 300)) + radius + 300;
	let drawable: Paperless.Drawable;
	let control: Paperless.Control;

	switch(random)
	{
		case 0:
			drawable = context.attach(new Paperless.Drawables.Circle(new Paperless.Point(rx, ry), radius));
			control = context.attach(new Paperless.Controls.Button(() => {drawable.visible = false; console.log('hit')}));
			control.attach(drawable);
			drawable.fillcolor = color;
			//group1.attach(drawable);
			break;

		case 1:
			console.log('akjha')
			drawable = context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(rx, ry), radius));
			control = context.attach(new Paperless.Controls.Button(() => {
				//context.get(control.id).enabled = false;
				//context.get(control.id).movable = false;

				let scale: {x: number, y: number} = undefined;
				drawable.scale.x == 1 ? scale = {x: 0.5, y: 0.5} : scale = {x: 1, y: 1};

				context.fx.add({
					duration: 1000,
					drawable: drawable,
					effect: context.fx.scale,
					smuggler: { ease: Paperless.Fx.easeOutElastic, angle: 60, distance: 250, scale: scale },
					complete: () => {
						//context.get(control.id).enabled = true;
						//context.get(control.id).movable = true;
					}
				});

				context.fx.add({
					duration: 1000,
					loop: true,
					drawable: drawable,
					effect: context.fx.rotate,
					smuggler: { ease: Paperless.Fx.easeOutBounce, angle: 60},
					complete: undefined
				});
			}));

			control.attach(drawable);
			control.movement = 'horizontal';
			drawable.fillcolor = color;
			//group2.attach(drawable);
			break;

		case 2:
			drawable = context.attach(new Paperless.Drawables.Rectangle(new Paperless.Point(x, y), new Paperless.Size(width, height)));
			control = context.attach(new Paperless.Controls.Button(() => {
				let guids: Array<string> = [drawable.guid];
				Paperless.Context.near(drawable.context.getDrawables(), drawable.point, 100, guids)

				console.log(guids);
			}))

			control.attach(drawable);
			drawable.fillcolor = color;
			break;

		case 3:
			drawable = context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(rx, ry), radius, {sides: 3}));
			control = context.attach(new Paperless.Controls.Blank())

			control.attach(drawable);
			drawable.fillcolor = color;
			drawable.rotation = 30;
			break;
	}
}

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





