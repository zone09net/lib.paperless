import * as Paperless from './lib.paperless.js';



export class Title extends Paperless.Component
{
	public hide(): void
	{
		const filtered: Paperless.Drawable[] = this.getDrawables().filter((drawable: Paperless.Drawables.Label) => { drawable.content == 'zone' });

		filtered[0].visible = false;
	}

	public onAttach(): void
	{
		this.enroll([
			new Paperless.Drawables.Label({
				context: this.context,
				layer: 2,
				point: {x: window.innerWidth - 818, y: window.innerHeight / 2},
				content: 'zone',
				autosize: true,
				font: '250px impact',
				shadow: 5,
				shadowcolor: '#0b0b0b',
				fillcolor: '#b0b0b0',
				padding: {top: -6}
			}),

			new Paperless.Drawables.Label({
				context: this.context,
				layer: 2,
				point: {x: window.innerWidth - 448, y: window.innerHeight / 2},
				content: '09',
				autosize: true,
				font: '250px impact',
				shadow: 5,
				shadowcolor: '#0b0b0b',
				fillcolor: '#b0b0b0',
				padding: {top: -6}
			})
		]);
	}

	public onDetach(): void
	{
		this.detachEnrolled();
	}
}


export class Vortex extends Paperless.Component
{
	private _colors: string[] = ["#0c0c0c", "#0d0d0d", "#0e0e0e", "#0f0f0f"];
	private _speed: number = 1500;
	private _space: number = 40;
	//---

	public constructor(attributes: Paperless.Interfaces.IComponentAttributes  = {})
	{
		super(attributes);

		this.initialize();
	}

	public initialize(): void
	{
		for(let adder: number = 4, space: number = this._space; adder < 460; adder += space)
		{
			const drawable: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
				context: this.context,
				layer: 1,
				point: {x: window.innerWidth - 450, y: window.innerHeight / 2},
				outerRadius: adder + space,
				innerRadius: adder,
				angleEnd: Math.floor(Math.random() * 90 + 15),
				fillcolor: this._colors[Math.floor(Math.random() * 4)],
				nostroke: true,
				hoverable: false
			});
		
			this.enroll(drawable);

			this.context.fx.add({
				duration: Math.floor(Math.random() * 2000 + this._speed),
				drawable: drawable,
				loop: true,
				smuggler: { 
					ease: Paperless.Fx.easeLinear, 
					angle: Math.random() < 0.5 ? -1 : 1 
				},
				effect: (fx: Paperless.Interfaces.IFx) => {
					(<Paperless.Drawable>fx.drawable).rad = fx.smuggler.ease(fx.t) * 6.28 * Math.sign(fx.smuggler.angle | 1);
				},
			});
		}
	}

	public onDetach(): void
	{
		this.detachEnrolled();
	}
}


export class Menu extends Paperless.Component
{
	private _last: number = undefined;
	private _selected: string = undefined;
	private _drawables: any = {};
	private _zones: any = [
		[
			// zone 4
			{start: 245, end: 270, radius: 230, spacer: 130, angle: 257.5},
			{start: 237.5, end: 277.5, radius: 170, spacer: 60, angle: 257.5},
			{start: 237.5, end: 270, radius: 90, spacer: 80, angle: 253.75},
		],
		[
			// zone 1
			{start: 67.5, end: 120, radius: 290, spacer: 70, angle: 93.75},
			{start: 52.5, end: 112.5, radius: 210, spacer: 80, angle: 82.5},
			{start: 45, end: 105, radius: 150, spacer: 60, angle: 75},
			{start: 60, end: 97.5, radius: 90, spacer: 80, angle: 78.75},
		],
		[
			// zone 2
			{start: 120, end: 135, radius: 170, spacer: 60, angle: 127.5},
			{start: 120, end: 165, radius: 90, spacer: 80, angle: 142.5},
		],
		[
			// zone 3
			{start: 180, end: 225, radius: 150, spacer: 60, angle: 202.5},
			{start: 187.5, end: 210, radius: 90, spacer: 60, angle: 198.75},
		],
		[
			// zone5
			{start: 285, end: 322.5, radius: 280, spacer: 80, angle: 303.75},
			{start: 285, end: 337.5, radius: 200, spacer: 80, angle: 311.25},
			{start: 292.5, end: 325, radius: 130, spacer: 80, angle: 308.75},
			{start: 292.5, end: 317.5, radius: 90, spacer: 40, angle: 305},
		],
		[
			// zone 6
			{start: 345, end: 32.5, radius: 130, spacer: 60, angle: 363.75},
			{start: 337.5, end: 25, radius: 90, spacer: 60, angle: 361.25},
		],
		[
			// zone 7
			{start: 135, end: 165, radius: 260, spacer: 100, angle: 150},
			{start: 142.5, end: 157.5, radius: 205, spacer: 80, angle: 150},
		],
		[
			// zone 8
			{start: 180, end: 232.5, radius: 285, spacer: 75, angle: 206.25},
			{start: 172.5, end: 217.5, radius: 240, spacer: 60, angle: 195},
		],
		[
			// zone 9
			{start: 337.5, end: 47, radius: 315, spacer: 45, angle: 372.5},
			{start: 345, end: 40, radius: 240, spacer: 80, angle: 372.5},
		],
	];

	//---

	public constructor(attributes: Paperless.Interfaces.IComponentAttributes  = {})
	{
		super(attributes);

		this.initialize();
	}

	public initialize(): void
	{
		const dummy: Paperless.Drawables.Circle = new Paperless.Drawables.Circle({
			context: this.context,
			layer: 3,
			point: {x: window.innerWidth - 450, y: window.innerHeight / 2},
			fillcolor: '#232323',
			strokecolor: '#0b0b0b',
			nostroke: false,
			shadow: 15,
			shadowcolor: '#0b0b0b',
			linewidth: 2,
			angle: 0,
			visible: false,
		});

		this.enroll(dummy);

		this._zones.forEach((zone: {start: number, end: number, radius: number, spacer: number, angle: number, diff: number}[]) => {
			const group: Paperless.Group = new Paperless.Group({
				context: this.context
			});
		
			zone.forEach((attributes: {start: number, end: number, radius: number, spacer: number, angle: number, diff: number}, index: number) => {
				const drawable: Paperless.Drawables.Circle = dummy.clone({
					context: this.context,
					layer: 3,
					innerRadius: attributes.radius,
					outerRadius: attributes.radius + attributes.spacer,
					angleStart: attributes.start,
					angleEnd: attributes.end,
					angle: attributes.angle,
					matrix: dummy.matrix,
					visible: true
				});
		
				group.attach(drawable);
				this._drawables[drawable.guid] = attributes;
				this.enroll(drawable);
		
				new Paperless.Control({
					context: this.context,
					layer: 3,
					drawable: drawable,
					movable: false,
					onInside: (self: Paperless.Control) => {
						group.getDrawables().forEach((drawable: Paperless.Drawable) => {
							drawable.fillcolor = '#111111';
						});
					},
					onOutside: (self: Paperless.Control) => {
						group.getDrawables().forEach((drawable: Paperless.Drawable) => {
							if(this._selected != self.drawable.group)
								drawable.fillcolor = '#232323';
							else
								drawable.fillcolor = '#49251e';			
						});
					},
					onLeftClick: (self: Paperless.Control) => {
						const group: Paperless.Group = this.context.get(self.drawable.group);
						const drawable: Paperless.Drawable = group.getDrawables()[group.getDrawables().length - 1];
						let current: number;
		
						if(!this._last)
							current = 270 - this._drawables[drawable.guid].angle;
						else
						{
							if((this._last > 360 && this._drawables[drawable.guid].angle < 90))
								current = this._last - (this._drawables[drawable.guid].angle + 360);
							else if((this._last < 90 && this._drawables[drawable.guid].angle > 360))
							{
								current = (this._last + 360) - this._drawables[drawable.guid].angle;
								current *= -1;
							}
							else if(this._drawables[drawable.guid].angle > 360 && this._drawables[drawable.guid].angle - this._last > 180)
							{
								current = this._last - (this._drawables[drawable.guid].angle - 360);
								current *= -1;
							}
							else if(this._last > 360 && this._last - this._drawables[drawable.guid].angle > 180)
								current = (this._last - 360) - this._drawables[drawable.guid].angle;
							
							else if(this._last - this._drawables[drawable.guid].angle > 180)
							{
								current = this._last - (this._drawables[drawable.guid].angle + 360);
							}
							else if(this._drawables[drawable.guid].angle - this._last > 180)
							{
								current = (this._last + 360) - this._drawables[drawable.guid].angle;
								current *= -1;
							}
							else
								current = Math.abs(this._last - this._drawables[drawable.guid].angle);
		
							if(this._last < this._drawables[drawable.guid].angle)
							{
								current *= -1;
							}
						}
						
						this._last = this._drawables[drawable.guid].angle;
						this._selected = group.guid;
		
						this.context.getControls(3).forEach((control: Paperless.Control) => {
							control.drawable.fillcolor = '#232323';
							control.drawable.hoverable = false;
							control.enabled = false;
						});
		
						group.getDrawables().forEach((drawable: Paperless.Drawable) => {
							drawable.fillcolor = '#49251e';
						});
		
						this.context.fx.add({
							duration: Math.floor(500),
							drawable: drawable,
							nogroup: true,
							smuggler: { 
								ease: Paperless.Fx.easeOutQuart, 
								angle: current,
							},
							effect: this.context.fx.rotate,
							complete: () => {
								this.context.getControls(3).forEach((control: Paperless.Control) => {
									control.drawable.hoverable = true;
									control.enabled = true;
								});
							}
						});
					}
				});
			});
		});

		const control: Paperless.Control = this.context.get(this.context.getControls(3).first());
		const group: Paperless.Group = this.context.get(control.drawable.group);

		this._selected = group.guid;
		control.onLeftClick(control);
	}

	public onDetach(): void
	{
		this.detachEnrolled();
	}
}

export class zon09 
{
	private _context: Paperless.Context;
	//---


	public constructor()
	{
		this._context = new Paperless.Context({autosize: false, scale: 1});
		this._context.attach(document.body);

		new Vortex({
			context: this._context
		});
		
		new Title({
			context: this._context
		});
		
		new Menu({
			context: this._context
		});
	}
}



new zon09();
