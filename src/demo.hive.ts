import * as Paperless from "./lib.paperless.js";

const colors: string[] = [
  "#815556",
  "#436665",
  "#9a6c27",
  "#769050",
  "#c8af55",
];

export interface IComponentHiveAttributes extends Paperless.Interfaces.IComponentAttributes 
{
  radius?: number;
  origin?: {x: number; y: number};
}

export interface IDrawableCellAttributes extends Paperless.Interfaces.IDrawablePolygonAttributes 
{
  hive?: Hive;
  coord?: {x: number; y: number};
}

class Cell extends Paperless.Drawables.Hexagon 
{
	private _hive: Hive;
	private _coord: {x: number; y: number};
	//---

	public constructor(hive: Hive, attributes: IDrawableCellAttributes = {}) {
		super({
			...attributes,
			...{
				outerRadius: hive.radius,
			},
		});

		const { coord = {x: 0, y: 0} } = attributes;

		this._hive = hive;
		this._coord = coord;
		this.outerRadius = hive.radius;

		const point: Paperless.Point = hive.toPoint(coord);

		this.x = point.x;
		this.y = point.y;
	}


	// Accessors
	// --------------------------------------------------------------------------

	public get hive(): Hive 
	{
		return this._hive;
	}

	public get coord(): {x: number; y: number} 
	{
		return this._coord;
	}
	public set coord(coord: {x: number; y: number}) 
	{
		this._coord = coord;
	}
}

class Hive extends Paperless.Component 
{
	private _radius: number;
	private _xhop: number;
	private _yhop: number;
	private _origin: {x: number; y: number};
	//---

	public constructor(attributes: IComponentHiveAttributes = {}) 
	{
		super(attributes);

		const {radius = 60, origin = null} = attributes;

		this._radius = radius;
		this._xhop = Math.round(radius * 2 * 0.75);
		this._yhop = Math.round(((Math.sqrt(3) / 2) * radius * 2) / 2);

		if(!origin) this._origin = {x: this._radius, y: this._yhop};
		else this._origin = origin;
	}

	public toCoord(point: Paperless.Point): {x: number; y: number}
	{
		const guess: Paperless.Point = new Paperless.Point(
			Math.round((point.x - this._origin.x) / this._xhop) * this._xhop,
			Math.round((point.y - this._origin.y + (this._radius / 2) * 0.75) / this._yhop) * this._yhop
		);
		const coord: { x: number; y: number } = {
			x: guess.x / this._xhop,
			y: guess.y / this._yhop,
		};

		if(coord.x % 2 != 0) 
			coord.y -= 0.5;

		coord.y = Math.floor(coord.y / 2);

		return coord;
	}

	public toPoint(coord: {x: number; y: number}): Paperless.Point
	{
		const point: Paperless.Point = new Paperless.Point(
			this._xhop * coord.x + this._origin.x,
			this._yhop * 2 * coord.y + this._origin.y
		);

		if(coord.x & 1) 
			point.y += this._yhop;

		return point;
	}

	public new(attributes: IDrawableCellAttributes = {}): Cell
	{
		const cell: Cell = new Cell(this, {
			...{
				context: this.context,
				linewidth: 2,
				strokecolor: "#000000",
				hoverable: true,
				scale: {x: 0.98, y: 0.98},
			},
			...attributes,
		});

		return cell;
	}

	// Accessors
	// --------------------------------------------------------------------------

	public get radius(): number 
	{
		return this._radius;
	}
}

const context: Paperless.Context = new Paperless.Context({
	autosize: true,
	dragging: {
		delay: 0,
		//grid: {x: xhop, y: yhop},
		//restrict: Paperless.Enums.Restrict.onrelease
	},
	features: {
		nosnapping: true,
	},
});

const hive: Hive = new Hive({
	radius: 60,
	origin: { x: 70, y: 70 },
});

context.attach(hive);
context.attach(document.body);

for(let x: number = 0; x < 4; x++) 
{
	for (let y: number = 0; y < 4; y++) 
	{
		const cell: Cell = hive.new({
			fillcolor: colors[Math.floor(Math.random() * 5)],
			coord: { x: x, y: y },
		});

		new Paperless.Control({
			context: context,
			drawable: cell,
			onDragEnd: () => {
				const coord: {x: number; y: number} = cell.hive.toCoord(cell.point);
				const point: Paperless.Point = cell.hive.toPoint(coord);

				cell.x = point.x;
				cell.y = point.y;

				console.log(coord);
			},
			onFocus: () => {
				cell.linewidth = 3;
				cell.nostroke = false;
				cell.strokecolor = "#ffffff";
			},
			onLostFocus: () => {
				cell.linewidth = 2;
				cell.nostroke = true;
				cell.strokecolor = "#000000";
			},
		});
	}
}

