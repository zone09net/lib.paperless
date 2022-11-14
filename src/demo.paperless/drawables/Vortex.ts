import * as Paperless from '../../lib.paperless.js';



export class Vortex extends Paperless.Drawables.Circle
{
	public constructor(point: Paperless.Point, outerRadius: number, innerRadius: number)
	{
		super(point, outerRadius, innerRadius, {angleEnd: Math.floor(Math.random() * 90 + 15)});

		this.nostroke = true;
		this.fillcolor = '#' + Math.floor(16777215 - (Math.random() * 15000000)).toString(16);
	}
}
