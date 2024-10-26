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

const zone09: any = {
	z: {
		path: undefined,
		points: [
			{x: 18, y: 20},
			{x: -18, y: 20},
			{x: -18, y: 11.587},
			{x: 3.483, y: -10.627},
			{x: -16.827, y: -10.627},
			{x: -16.827, y: -20},
			{x: 17.340, y: -20},
			{x: 17.340, y: -11.587},
			{x: -3.923, y: 10.480},
			{x: 18, y: 10.627},
		]
	},
	o: {
		path: 'M4.519 20c2.13 0 4.037-.217 5.7-.67 1.663-.453 3.082-1.143 4.235-2.088 1.152-.946 2.04-2.147 2.637-3.625.599-1.477.909-3.23.909-5.278V-8.339c0-2.048-.31-3.801-.909-5.278-.598-1.478-1.485-2.68-2.637-3.625-1.153-.945-2.572-1.635-4.235-2.088-1.663-.453-3.57-.67-5.7-.67H-4.52c-2.13 0-4.037.217-5.7.67-1.663.453-3.082 1.143-4.235 2.088-1.152.946-2.04 2.147-2.637 3.625C-17.69-12.14-18-10.387-18-8.34V8.339c0 2.048.31 3.801.909 5.278.598 1.478 1.485 2.68 2.637 3.625 1.153.945 2.572 1.635 4.235 2.088 1.663.453 3.57.67 5.7.67zm-7.63-9.668c-.833 0-1.533-.078-2.112-.239-.58-.16-1.04-.402-1.397-.73-.357-.327-.61-.74-.772-1.241-.164-.502-.238-1.092-.238-1.775V-6.494c0-.683.074-1.274.238-1.775.163-.502.415-.915.772-1.242.356-.328.817-.57 1.397-.73.58-.16 1.279-.239 2.112-.239H3.11c.833 0 1.533.079 2.112.239.58.16 1.04.402 1.397.73.357.327.61.74.772 1.242.164.501.238 1.092.238 1.775V6.273c0 .701-.074 1.305-.238 1.817-.163.512-.415.932-.772 1.264-.356.332-.817.577-1.397.738-.58.162-1.279.24-2.112.24z',
		points: [
			{x: 18, y: 8.339},
			{x: 17.091, y: 13.617},
			{x: 14.454, y: 17.242},
			{x: 10.219, y: 19.330},
			{x: 4.519, y: 20},
			{x: -4.519, y: 20},
			{x: -10.219, y: 19.330},
			{x: -14.454, y: 17.242},
			{x: -17.091, y: 13.617},
			{x: -18, y: 8.339},
			{x: -18, y: -8.339},
			{x: -17.091, y: -13.617},
			{x: -14.454, y: -17.242},
			{x: -10.219, y: -19.330},
			{x: -4.519, y: -20},
			{x: 4.519, y: -20},
			{x: 10.219, y: -19.330},
			{x: 14.454, y: -17.242},
			{x: 17.091, y: -13.617},
			{x: 18, y: -8.339},
		]
	},
	n: {
		path: undefined,
		points: [
			{x: 18, y: 20},
			{x: 7.641, y: 20},
			{x: 7.641, y: -5.018},
			{x: 7.355, y: -7.460},
			{x: 6.456, y: -9.161},
			{x: 4.882, y: -10.156},
			{x: 2.571, y: -10.480},
			{x: -0.735, y: -10.480},
			{x: -3.406, y: -10.126},
			{x: -5.630, y: -9.031},
			{x: -7.151, y: -7.148},
			{x: -7.714, y: -4.428},
			{x: -7.714, y: 20},
			{x: -18, y: 20},
			{x: -18, y: -20},
			{x: -7.714, y: -20},
			{x: -7.714, y: -16.531},
			{x: -6.044, y: -17.883},
			{x: -3.995, y: -18.985},
			{x: -1.326, y: -19.728},
			{x: 1.984, y: -20},
			{x: 6.539, y: -20},
			{x: 11.398, y: -19.272},
			{x: 14.997, y: -17.057},
			{x: 17.232, y: -13.306},
			{x: 18, y: -7.970},
		],
	},
	e: {
		path: 'M18-7.601c0-2.048-.321-3.847-.941-5.394-.62-1.546-1.54-2.84-2.734-3.878-1.194-1.038-2.665-1.82-4.388-2.342C8.213-19.737 6.237-20 4.03-20h-8.06c-2.207 0-4.183.217-5.907.67-1.723.453-3.194 1.143-4.388 2.088a8.965 8.965 0 0 0-2.734 3.625c-.62 1.477-.941 3.23-.941 5.278V8.339c0 2.048.321 3.801.941 5.278a8.965 8.965 0 0 0 2.734 3.625c1.194.945 2.665 1.635 4.388 2.088 1.724.453 3.7.67 5.907.67h7.446c2.187 0 4.193-.152 5.97-.505 1.778-.353 3.327-.906 4.603-1.709 1.276-.803 2.28-1.854 2.963-3.203.683-1.35 1.048-2.996 1.048-4.989V7.97L7.791 6.125V7.97c0 2.51-1.458 3.47-4.913 3.47h-5.987c-3.454 0-4.682-1.33-4.682-4.134V3.47H18zm-25.791.073c0-2.583.69-4.059 4.682-4.059H3.11c3.991 0 4.682 1.55 4.682 4.207v2.952H-7.79z',
		points: [
			{x: 18, y: 7.970},
			{x: 18, y: 9.594},
			{x: 16.952, y: 14.583},
			{x: 13.989, y: 17.786},
			{x: 9.386, y: 19.495},
			{x: 3.416, y: 20},
			{x: -4.030, y: 20},
			{x: -9.937, y: 19.330},
			{x: -14.325, y: 17.242},
			{x: -17.059, y: 13.617},
			{x: -18, y: 8.339},
			{x: -18, y: -8.339},
			{x: -17.059, y: -13.617},
			{x: -14.325, y: -17.242},
			{x: -9.937, y: -19.330},
			{x: -4.030, y: -20},
			{x: 4.030, y: -20},
			{x: 9.937, y: -19.215},
			{x: 14.325, y: -16.873},
			{x: 17.059, y: -12.995},
			{x: 18, y: -7.601},
			{x: 18, y: 3.469},
			{x: 9.104, y: 3.469},
			{x: 9.791, y: 6.125},
		],
	},
	zero: {
		path: 'M7.906-13.012-7.976 2.632v9.941L7.906-2.924zM5.153 25c2.03 0 3.847-.215 5.432-.664 1.585-.448 2.937-1.132 4.036-2.068 1.098-.937 1.943-2.127 2.513-3.59.57-1.463.866-3.2.866-5.228v-26.9c0-2.029-.296-3.765-.866-5.228-.57-1.463-1.415-2.653-2.513-3.59-1.099-.936-2.451-1.62-4.036-2.068C9-24.786 7.182-25 5.153-25H-5.153c-2.03 0-3.847.215-5.432.664-1.585.448-2.937 1.132-4.036 2.068-1.098.937-1.943 2.127-2.513 3.59-.57 1.463-.866 3.2-.866 5.228v26.9c0 2.029.296 3.765.866 5.228.57 1.463 1.415 2.653 2.513 3.59 1.099.936 2.451 1.62 4.036 2.068C-9 24.786-7.182 25-5.153 25zm-8.965-9.576c-3.176 0-4.306-1.243-4.306-3.947v-23.1c0-2.704 1.13-3.947 4.306-3.947h7.624c3.176 0 4.235 1.243 4.235 3.947v23.1c0 2.704-1.059 3.947-4.235 3.947z',
		points: [
			{x: 18, y: 13.450},
			{x: 17.134, y: 18.678},
			{x: 14.621, y: 22.268},
			{x: 10.585, y: 24.336},
			{x: 5.153, y: 25},

			{x: -5.153, y: 25},
			{x: -10.585, y: 24.336},
			{x: -14.621, y: 22.268},
			{x: -17.134, y: 18.678},
			{x: -18, y: 13.450},

			{x: -18, y: -13.450},
			{x: -17.134, y: -18.678},
			{x: -14.621, y: -22.268},
			{x: -10.585, y: -24.336},
			{x: -5.153, y: -25},

			{x: 5.153, y: -25},
			{x: 10.585, y: -24.336},
			{x: 14.621, y: -22.268},
			{x: 17.134, y: -18.678},
			{x: 18, y: -13.450},
		]
	},
	nine: {
		path: 'M-18-6.067c0 2.047.207 3.796.654 5.27.447 1.473 1.133 2.67 2.09 3.611.957.941 2.186 1.627 3.718 2.077 1.532.45 3.367.665 5.538.665H.141c4.447 0 7.2-.805 7.906-1.682v7.603c0 2.704-1.13 3.947-4.235 3.947h-7.624c-3.176 0-4.306-1.243-4.306-3.947V9.868L-18 12.646v.804c0 2.029.296 3.765.865 5.228.569 1.463 1.411 2.653 2.506 3.59 1.094.936 2.44 1.62 4.014 2.068 1.575.45 3.38.664 5.391.664H5.153c2.03 0 3.847-.215 5.432-.664 1.585-.448 2.937-1.132 4.036-2.068 1.098-.937 1.943-2.127 2.513-3.59.57-1.463.866-3.2.866-5.228v-26.9c0-2.029-.296-3.765-.866-5.228-.57-1.463-1.415-2.653-2.513-3.59-1.099-.936-2.451-1.62-4.036-2.068C9-24.786 7.182-25 5.153-25H-5.153c-2.03 0-3.847.215-5.432.664-1.585.448-2.937 1.132-4.036 2.068-1.098.937-1.943 2.127-2.513 3.59-.57 1.463-.866 3.2-.866 5.228zm9.882-5.556c0-2.704 1.13-3.947 4.306-3.947h7.624c3.106 0 4.235 1.243 4.235 3.947v4.313c0 2.34-1.27 3.655-4.235 3.655h-7.624c-3.176 0-4.306-1.243-4.306-4.02z',
		points: [
			{x: -18, y: 12.646},
			{x: -18, y: 13.450},
			{x: -17.135, y: 18.678},
			{x: -14.629, y: 22.268},
			{x: -10.615, y: 24.336},
			{x: -5.224, y: 25},
			{x: 5.153, y: 25},
			{x: 10.585, y: 24.336},
			{x: 14.621, y: 22.268},
			{x: 17.134, y: 18.678},
			{x: 18, y: 13.450},

			{x: 18, y: -13.450},
			{x: 17.134, y: -18.678},
			{x: 14.621, y: -22.268},
			{x: 10.585, y: -24.336},
			{x: 5.153, y: -25},

			{x: -5.153, y: -25},
			{x: -10.585, y: -24.336},
			{x: -14.621, y: -22.268},
			{x: -17.134, y: -18.678},
			{x: -18, y: -13.450},

			{x: -18, y: -6.067},
			{x: -17.346, y: -0.797},
			{x: -15.256, y: 2.814},
			{x: -11.538, y: 4.891},
			{x: -6, y: 5.556},
			{x: -8.118, y: 9.868},
		]
	},
}

context.attach(document.body);
context.loop();

context.canvas.style.position = 'absolute';
context.canvas.style.top = '0';
context.canvas.style.left = '0';

matter.Rectangle({point: {x: -8, y: window.innerHeight / 2}, size: {width: 16, height: window.innerHeight}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth + 8, y: window.innerHeight / 2}, size: {width: 16, height: window.innerHeight}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth / 2, y: -8}, size: {width: window.innerWidth, height: 16}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});
matter.Rectangle({point: {x: window.innerWidth / 2, y: window.innerHeight + 8}, size: {width: window.innerWidth, height: 16}, options: {isStatic: true}}, {fillcolor: '#191919', nostroke: true});

const polygon: Paperless.Interfaces.IMatterEntity = matter.Polygon(
	{
		point: {x: window.innerWidth / 2, y: window.innerHeight / 2}, 
		outerRadius: 200,
		innerRadius: 185,
		sides: 4,
		options: {
			isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	}
);

const platform: Paperless.Interfaces.IMatterEntity = matter.Rectangle(
	{
		point: {x: window.innerWidth / 2, y: (window.innerHeight / 2) + 25}, 
		size: {width: 240, height: 10},
		options: {
			isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	}
);

const z: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) - (40 * 2) - 20, y: window.innerHeight / 2}, 
		points: zone09.z.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	}
);

const o: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) - (40 * 1) - 20, y: window.innerHeight / 2}, 
		points: zone09.o.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		path: new Path2D(zone09.o.path)
	}
);

const n: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) - (40 * 0) - 20, y: window.innerHeight / 2}, 
		points: zone09.n.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
	}
);

const e: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) + (40 * 0) + 20, y: window.innerHeight / 2}, 
		points: zone09.e.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		path: new Path2D(zone09.e.path)
	}
);

const zero: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) + (40 * 1) + 20, y: (window.innerHeight / 2) - 5}, 
		points: zone09.zero.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		path: new Path2D(zone09.zero.path)
	}
);

const nine: Paperless.Interfaces.IMatterEntity = matter.Points(
	{
		point: {x: (window.innerWidth / 2) + (40 * 2) + 20, y: (window.innerHeight / 2) - 5}, 
		points: zone09.nine.points,
		options: {
			//isStatic: true,
		}
	},
	{
		fillcolor: colors[Math.floor(Math.random() * 5)],
		nostroke: true,
		path: new Path2D(zone09.nine.path)
	}
);

setTimeout(() => {
	context.fx.add({
		duration: 3000,
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
}, 1000);


setTimeout(() => {
	matter.MatterJS.Composite.remove(matter.engine.world, platform.body);
	matter.MatterJS.Body.applyForce(z.body, {x: z.body.position.x, y: z.body.position.y}, {x: 0, y: 0.01});
	matter.MatterJS.Body.applyForce(o.body, {x: o.body.position.x, y: o.body.position.y}, {x: 0, y: 0.01});
	matter.MatterJS.Body.applyForce(n.body, {x: n.body.position.x, y: n.body.position.y}, {x: 0, y: 0.01});
	matter.MatterJS.Body.applyForce(e.body, {x: e.body.position.x, y: e.body.position.y}, {x: 0, y: 0.01});
	matter.MatterJS.Body.applyForce(zero.body, {x: zero.body.position.x, y: zero.body.position.y}, {x: 0, y: 0.01});
	matter.MatterJS.Body.applyForce(nine.body, {x: nine.body.position.x, y: nine.body.position.y}, {x: 0, y: 0.01});
}, 3000);


