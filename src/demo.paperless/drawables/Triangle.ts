import * as Paperless from '../../lib.paperless.js';



export class Triangle extends Paperless.Drawables.Hexagon
{
	public constructor(point: Paperless.Point, radius: number)
	{
		super(point, radius);

		this.sides = 3;
		this.rotation = 30;
		this.nostroke = true;
		this.fillcolor = '#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16);
	
		this.generate();
	}
}
