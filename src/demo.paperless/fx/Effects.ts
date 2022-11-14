import * as Paperless from '../../lib.paperless.js';



export class Effects
{
	public constructor() {}

	public static fullRotate(fx: Paperless.IFx)
	{
		let angle: number = Math.abs(fx.smuggler.ease(fx.t) * 360);
		//let radian: number = angle * Math.PI / 180;

		if(fx.smuggler.origin == undefined)
			fx.smuggler.origin = new Paperless.Point((<Paperless.Drawable>fx.drawable).point.x, (<Paperless.Drawable>fx.drawable).point.y);

		//(<Paperless.Drawable>fx.drawable).point.x = (fx.smuggler.origin as Paperless.Point).x + Math.round((50 * Math.sin(radian)));
		//(<Paperless.Drawable>fx.drawable).point.y = (fx.smuggler.origin as Paperless.Point).y - Math.round((50 * Math.cos(radian)));

		(<Paperless.Drawable>fx.drawable).rotation = fx.smuggler.custom.reverse ? -angle : angle;
		(<Paperless.Drawable>fx.drawable).draw((<Paperless.Drawable>fx.drawable).context.context2D);
	}

	public static bounce(fx: Paperless.IFx) 
	{
		let drawable: Paperless.Drawable = <Paperless.Drawable>fx.drawable;

		if(!fx.smuggler.custom)
			fx.smuggler.custom = {};
		if(!fx.smuggler.custom.delta)
			fx.smuggler.custom.delta = new Paperless.Point(Math.floor(Math.random() * 4) + 3, Math.floor(Math.random() * 4) + 3);
		if(!fx.smuggler.custom.direction)
			fx.smuggler.custom.direction = new Paperless.Point(Math.floor(Math.random() * 2), Math.floor(Math.random() * 2));

		if(drawable.point.x - (drawable.size.width / 2) <= 0)
   	{
			fx.smuggler.custom.direction.x = 1;
			fx.smuggler.custom.delta = new Paperless.Point(Math.floor(Math.random() * 4) + 3, Math.floor(Math.random() * 4) + 3);
      }

		if(drawable.point.y - (drawable.size.height / 2) <= 0)
			fx.smuggler.custom.direction.y = 1;

		if(drawable.point.x + (drawable.size.width / 2) >= window.innerWidth)
		{
			fx.smuggler.custom.direction.x = 0;
			fx.smuggler.custom.delta = new Paperless.Point(Math.floor(Math.random() * 4) + 3, Math.floor(Math.random() * 4) + 3);
		}

      if(drawable.point.y + (drawable.size.height / 2) >= window.innerHeight)
			fx.smuggler.custom.direction.y = 0;

		drawable.point.x += fx.smuggler.custom.delta.x * (fx.smuggler.custom.direction.x == 0 ? -1 : 1);
		drawable.point.y += fx.smuggler.custom.delta.y * (fx.smuggler.custom.direction.y == 0 ? -1 : 1);
	}
}
