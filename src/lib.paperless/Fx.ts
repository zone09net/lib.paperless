import {Point} from './Point.js';
import {Drawable} from './Drawable.js';
import {IFx} from './IFx.js';

/** 
 * The library offer 
 * 
 * ```typescript 
 * let drawable: Paperless.Drawable;
 * let control: Paperless.Control;
 * 
 * drawable = context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(500, 500), 60));
 * control = context.attach(new Paperless.Controls.Blank());
 * control.attach(drawable);
 * 
 * context.attach(new Paperless.Drawables.Circle(new Paperless.Point(100, 100), 30));
 * context.attach(new Paperless.Drawables.Hexagon(new Paperless.Point(200, 100), 30));
 * ```
 */
export class Fx
{
	/*
		https://easings.net/

		easelinear
		easeInSine, easeOutSine, easeInOutSine
		easeInQuad, easeOutQuad, easeInOutQuad
		easeInCubic, easeOutCubic, easeInOutCubic
		easeInQuart, easeOutQuart, easeInOutQuart
		easeInQuint, easeOutQuint, easeInOutQuint
		easeInExpo, easeOutExpo, easeInOutExpo
		easeInCirc, easeOutCirc, easeInOutCirc
		easeInBack, easeOutBack, easeInOutBack
		easeInElastic, easeOutElastic, easeInOutElastic
		easeInBounce, easeOutBounce, easeInOutBounce
	*/

	private _stack: Array<IFx> = []
	private _id: number = undefined;
	//---

	public constructor() {}

	public add(fx: IFx): void
	{
		const {
			drawable,
			duration = 1000,
			loop = false,
			effect,
			nogroup = false,
			smuggler = { ease: Fx.easeLinear, angle: 0, distance: 0, scale: {x: 1, y: 1} },
			complete = null,
			t0 = new Date().getTime(),
			t = 0        
		} = fx;
		
		if(fx.drawable instanceof Array)
		{
			for(let i = 0; i < fx.drawable.length; i++)
			{
				this._stack.push({
					drawable: fx.drawable[i],
					duration: duration,
					loop: loop,
					effect: effect,
					smuggler: { ease: smuggler.ease, angle: smuggler.angle, distance: smuggler.distance, scale: smuggler.scale },
					complete: (i == 0 ? complete : null),
					t0: t0,
					t: t
				});
			}
		}
		else
		{
			if((<Drawable>drawable).group && !fx.nogroup)
			{
				let drawables: Array<{guid: string, map: Map<string, any>}> = (<Drawable>drawable).context.getDrawables().filter(([guid, map]: any) =>
					map.object.visible && 
					map.object.group == (<Drawable>drawable).group
				);

				drawables.forEach((map: any) => {
					this._stack.push({
						drawable: map[1].object,
						duration: duration,
						loop: loop,
						effect: effect,
						smuggler: { ease: smuggler.ease, angle: smuggler.angle, distance: smuggler.distance, scale: smuggler.scale },
						complete: (map[1].index == 1 ? complete : null),
						t0: t0,
						t: t
					});
				});
			}
			else
			{
				this._stack.push({
					drawable: drawable,
					duration: duration,
					loop: loop,
					effect: effect,
					smuggler: smuggler,
					complete: complete,
					t0: t0,
					t: t
				});
			}
		}

		if(!this._id)
			this._id = window.requestAnimationFrame(() => this.loop());
	}

	private loop(): void
	{
		for(let i: number = 0; i < this._stack.length; i++)
		{
			// t value from 0 to 1 depending on the duration
			this._stack[i].t = (1 / this._stack[i].duration * (new Date().getTime() - this._stack[i].t0));

			if(this._stack[i].t > 1)
				this._stack[i].t = 1;

			if(typeof this._stack[i].effect === 'function')
				this._stack[i].effect(this._stack[i]);

			if(this._stack[i].t === 1)
			{				
				if(typeof this._stack[i].complete === 'function')
					this._stack[i].complete(this._stack[i]);

				// Removing entry in the stack if not looping
				if(this._stack[i].loop)
				{
					this._stack[i].t = 0;
					this._stack[i].t0 = new Date().getTime();
				}
				else
				{
					this._id = window.requestAnimationFrame(() => this.loop());
					this._stack.splice(i, 1);
				}

				// Don't call requestAnimationFrame if the Stack is empty
				if(this._stack.length === 0)
				{
					window.cancelAnimationFrame(this._id);
					this._id = undefined;
				}
			}
		}

		if(this._stack.length > 0)
		{
			(<Drawable>this._stack[0].drawable).context.refresh();
			this._id = window.requestAnimationFrame(() => this.loop());
		}
	}

	public fadeIn(fx: IFx): void
	{
		(<Drawable>fx.drawable).alpha = fx.smuggler.ease(fx.t);
		(<Drawable>fx.drawable).draw((<Drawable>fx.drawable).context.context2D);
	}

	public fadeOut(fx: IFx): void
	{
		(<Drawable>fx.drawable).alpha = 1 - fx.smuggler.ease(fx.t);
		(<Drawable>fx.drawable).draw((<Drawable>fx.drawable).context.context2D);
	}

	public rotate(fx: IFx): void
	{
		let direction: number = Math.sign(fx.smuggler.angle);
		let angle: number = Math.abs(fx.smuggler.ease(fx.t) * fx.smuggler.angle);

		if(fx.smuggler.origin == undefined)
			fx.smuggler.origin = (<Drawable>fx.drawable).rotation;

		if(direction == -1)
		{
			(<Drawable>fx.drawable).rotation = (fx.smuggler.origin as number) - angle;
			if((<Drawable>fx.drawable).rotation < 0)
			(<Drawable>fx.drawable).rotation = 360 - Math.abs((<Drawable>fx.drawable).rotation);
		}
		else
		{
			(<Drawable>fx.drawable).rotation = (fx.smuggler.origin as number) + angle;
			if((<Drawable>fx.drawable).rotation > 360)
			(<Drawable>fx.drawable).rotation = (<Drawable>fx.drawable).rotation - 360;
		}

		(<Drawable>fx.drawable).draw((<Drawable>fx.drawable).context.context2D);
	}

	public move(fx: IFx): void
	{
		let radian: number = (fx.smuggler.angle + 90) * Math.PI / 180;
		let distance: number = fx.smuggler.ease(fx.t) * fx.smuggler.distance;

		if(fx.smuggler.origin == undefined)
			fx.smuggler.origin = new Point((<Drawable>fx.drawable).point.x, (<Drawable>fx.drawable).point.y);

		(<Drawable>fx.drawable).point.x = (fx.smuggler.origin as Point).x + Math.round((distance * Math.sin(radian)));
		(<Drawable>fx.drawable).point.y = (fx.smuggler.origin as Point).y - Math.round((distance * Math.cos(radian)));
		(<Drawable>fx.drawable).draw((<Drawable>fx.drawable).context.context2D);
	}

	public scale(fx: IFx): void
	{
		if(fx.smuggler.originx == undefined)
		{
			fx.smuggler.originx = (<Drawable>fx.drawable).scale.x;
			fx.smuggler.originy = (<Drawable>fx.drawable).scale.y;

			fx.smuggler.startx = (<Drawable>fx.drawable).scale.x;
			fx.smuggler.endx = (<Drawable>fx.drawable).scale.x;
			fx.smuggler.starty = (<Drawable>fx.drawable).scale.y;
			fx.smuggler.endy = (<Drawable>fx.drawable).scale.y;
		}

		let scalex = fx.smuggler.ease(fx.t) * (fx.smuggler.endx - fx.smuggler.startx) + fx.smuggler.originx;
		let scaley = fx.smuggler.ease(fx.t) * (fx.smuggler.endy - fx.smuggler.starty) + fx.smuggler.originy;

		(<Drawable>fx.drawable).scale.x = scalex;
		(<Drawable>fx.drawable).scale.y = scaley;
		(<Drawable>fx.drawable).draw((<Drawable>fx.drawable).context.context2D);
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABLCAYAAAB++NlAAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABRJJREFUeJztmstv3FQUh3/XjDXAgocEG14rngKJSlSCFliMFF+bIVFW/QOapDSPBSK0dNcUISFKxZKKJFXCgl14NlEU2wPDQ8oChR1FLKDABloKQYIQkYl1D4tO4cbJ2HnYY8/M+XZzT2Z8ok+frJFHgGkZXNd9TAhxFsCDAE6IrBdi4pmfny8WCoWTAF4CUKgf/1mIeA+TAzzP2w9gGsAj+jkRXeDyckq9tjEAx/F/bdeYMU1zmOXlkIWFhUcNw3gbwL7Q6AqAESnlDACwvByxtLRkLi8vjwJ4BYAZGs8EQTBSLpevXDtgeTnB87x9uHpvC9f2KxGN2Lb9bvg9LC9jqtXq9evr66cAHANwXWi8qTYdlpchrus+LoSYBvBQaNSwNh2WlwFxtZmmOVwqlX6L+xyW12R833+CiKawRW1CiGHLst7b7mexvCaRVG06LK8JRNR2WQgxspPadFheiqRRmw7LS4l6bdO4+gRA53L93vb+Xq/B8hIm7dp0WF6CVCqVA0qpKaRYmw7LS4DFxcUbVlZWxtCgNsMwhrq6un5P+rosb49E1QZgSEr5QVrXZnm7JKvadFjeLnBd96BhGFNE9IB+TkSXAAzZtv1hM/ZgeTsgD7XpsLxtkpfadFheDHmrTYflReC67sH687b79XMiumQYxqBlWR9ltBqAzb9KYrChtuMAjNB4hogGLctazmC1DXB5ITzPexLAFHJamw6XV6dVatPh8tC4NgC/ABiUUp5v/lbxdLS82dnZG4vF4kk0qE0pNeg4Tq5q0+lYeb7vP1V/un1faJTr2nQ6Tl5cbbVa7Wh3d/cfGay2YzpKXlRtRHTUtu3ZLPbaLR0hr51q02l7eQsLC08bhjEF4N7Q6GciGmy12nTaVl5EbQTgnVqt9nwr1qbTlvIiavvJMIyBrq6uShZ7JU1byYuqTQgxubq6eqy3t/evjNZLnLaR57quJYQ4B+Ce0KitatNpeXnz8/M3maZ5hoiOYOP/05a16bS0PM/zJIBJbK7tR8MwjrRjbTotKa+Ta9NpOXlRtQEYkFJ+3PSlMqJl5HFtm2kJeb7v20Q0Aa5tA7mWF1dboVB4sVQqrWS1X9bkVl69tkkAd4dGPxDRgG3bn2SxV57InTzf928G8DrXFk+ufoAUV5uUsuNr08lFeVzb7shcXqVScZRSE9iiNqVUv+M41Sz2agUyk6fV9lxoxLVtk0zkua77jBBiAsBdoRHXtgOaKo9rS5amyYuo7aIQot+yrE+btUu7kPpXhWq1eksQBKcb1aaUGpVS/p32Hu1IquV5nlcGMA6uLRVSKY9raw6Jl1evbQLAnaHRRQB9UsrPkr5mp5KYvIjalBDinFJq1LZtri1BEpHXqDYi+l4I0c+1pcOe7nlxtRER39tSZNfl+b7/LBGNY4vaAPTZtv35XpdjotlxeXG1ra2tvdDT07Oa0H5MBDsqr17bBIA79HOuLRu2Vd7c3NytxWLxNa4tX8SW57putxBiHKHaAHynlOpzHOeLdFZj4mgoL6K2AMAbpmmeKpVK/6S7HhPFlvJc1+0RQryFzbV9o5Q67DjOl+mvxsSxQV5cbUEQjJXL5bXmrcdE8Z88z/MOAXgTwO2hv7lQv7dxbTlDVKvV29bX188COBSaBQDOBEHwMteWTwq1Wu28EOJA6PxrAIellEtZLMVsD0MI8bD2OgDwahAE+1lc/ikAOAHgNIBviWjYtu2vMt6J2Sb/Ak1/14jZHBx9AAAAAElFTkSuQmCC">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeLinear(t: number): number
	{
		return t;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference for time, set internally
	 * @return					Calculation of the ease
	 */
	public static easeInSine(t: number): number
	{
		return 1 - Math.cos((t * Math.PI) / 2);
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAABKCAYAAAC8T6qfAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAB5BJREFUeJztnX+MHGUZx7/PzO5dD0O5yyGiIq1ak5IImnAaey3I0p2ZvWurUOXUpiQEpSgQYjCxWmPZEjQEJRQ94UIi6lkoLIlQLt3b+XFMTXBP8DQhiEZTbBuxSmyuu80Jub2b9/GPzrJze3vt/did2R/zSS65e965fb/JJ++777w7s0MI8R3bti92HKeHma9m5vVEtIaZ3w+gG8AFANrdQxnAfwAcY+bHKajArYRhGB8DsA3ABgA9ANYu42VOh7JqQDKZlHp7ezcA+Jz7s34FL3eCmX/HzA+FsqqIZVlXCSFuAzAA4JJF/MssgJMAjjPzcSI6QUT/ZuZ/AThZKBTe2Lp16+niwaGsFaLr+nsAfImIbgPwmQUOexvAnwC8SkSvMvPfHcc5sWrVqjdjsdjsYvsKZS0T0zSvYOa7AewAsLrCIScBHGTmFxzHebm/v396pX2GspaIrutXE9EeADcAkMqaHSIaYebHcrnc2MDAgFPNvkNZi0TX9WtdSVqF5jMAhmRZfnTz5s0napUhlHUeLMuKCyGSADZWaP4vET0SiUR+FovFcrXOEspaAF3X1xPRfQBuqtD8FoCHmXlQ07T/+ZUplFWGZVnvE0LsA/BVABFvGzO/QUQP5HK54YGBgYLf2UJZLtlstmNqaupuAN8FcFFZ8ykAP56dnd1fjVXdcgllAdB1fRsRDQK4vKzpDDP/CMDDfk53C9HSsmzbvnRmZuZBADeXNc0Q0S+IaG88Hn8riGyVaElZzEymae4C8ACATm8TgKcdx9nT19d3PJBw56DlZLk74EMAri9rOgrgTlVVDf9TLY6WkZVKpeSurq7vMPNeAG2epneY+Yf5fP7BIFZ4S6ElZI2Nja1xHGcYwLVlTS86jnNHX1/f34LItVSaXpZhGDcDGMTczdYcgDtUVT0YTKrl0bSyTNO8iJkHAez01pl5XJblnfF4/B8BRVs25bvGTUEmk4kx82uYK2oGwPfy+fw1jSgKaLKR5S7Jvw3gBwBkT9MxZt6paVo2oGhVoWlkHTp06MKOjo5fAtjurTPzcFtb252xWGwqmGTVoylkuedOvwHwcU95GsBuVVUfCSZV9Wl4WYZh9AN4EnN3It4kopsURfl9QLFqgnz+Q+oTZqaNGzfuBvBzAB3FOhHZkiRpiqI0xLnTUmjIkZVOp1dHIpEDOHvhZBEB4P5sNrsvmUyKgKLVlMj5D6kv0un0ZbIsHwZwlaecB7BDVdV0QLF8oaFGlmmaVzLzYQAf8pSPSpL0+Xg8/pegcvlFw5wU67quMPNLmCvKKBQKn24FUUCDjCxd128loiEA0WKNiB7v6uq6q6enZybAaL5S1+9ZzEyGYdxLRPd6ygVm/oaqqk8EFiwg6nZkpdPpdlmWnyCiHZ7yKff86UhQuYKkLmVZltXNzM8x8zWe8uuyLG+p5RWv9U7dyTIM4wMAMgCu9JRfjEajX/Djqtd6pq5Wg6ZpXgFgHHNF/SqXy/W1uiigjkaWZVmfEkIcBvBet8TMfJ+qqvuIiIPMVi/UxWpQ1/Xrmfl5ABe6pQKAr2ma9usAY9UdgY8s0zS3M/NTKN2hfpqItrfqiu9cBPqeZZrmXcz8LEqi/ilJ0qZQVGUCk2UYxm5m/qknw1+JaFOrbB0tB9+nwVQqJXd2dg4C+Lqn/Eo0Gt0Si8VO+Z2nkfD1w8eJiYkogAMAbvGUR6anp7dpmpb3M0sj4pusVCrVxszPAPhiscbMw93d3TtjsVhg9zw1Er5MgyMjIxe0t7c/B0D1lH+iKMo3w3OoxVNzWe5H8CMoXWfORHSPoij7a913s1HTadC27U6c3ecr3unuALhdVdVHa9lvs1KzkaXr+iVEpAP4pFtyiOhWRVGGa9Vns1OTkWXb9qVCCAuli1oKRPRlRVGerkV/rULVR5Zpmpcz8xiAdW7pbQA31vMdhY1CVUeWexnzEQAfdktnhBD9mqbZ1eynVanayHJF2QA+6JYmJUlKxOPxP1Srj1anKrIqiMpJkqSGoqrLijdyM5nMOoSifGFFsjKZzDpJkryi8kIILRRVG5Yta3R0dK0kSSaAy9xSXgihJhKJV6oTLaScZb1njY6OrpVl2UbpK69DUT6w5KX72NjYRwH8FsAatxSK8oklybIs6yNCiCMo3RzwjhCiP5FIjFc9Wcg8Fj0NuhdfvoTSCe8MEd2oKMrhmiQLmceiFhi2bV8MwERJFAPYFYryl/NOg+l0ejUAA8AnijUiukdV1aFaBguZzzlHVjab7YhEIodw9mEnAABm/n74wWEwLChrYmIiOjU19SyA64o1Zt6vadr9fgQLmU9FWclkUpqcnBwGsMVTPjA+Pv4tf2KFVKLiatAwjCEAt3tKI9FodPtSHnISUn3m3ZhgGMYeeEQx8ziAr4SigmfOyDJNc4CZD6I0Pb5WKBQ+632GU0hwvCvLsqwNQggbpZsEjkqStKmeviq71SHg3Uc6TKC0g36SmTdpmnYsuGgh5UjJZFJyp76iqElm1kJR9YfU29u7i5lj7t85IUSfpml/DjRVSEUiAPa6v59mZiWRSPwxyEAhCyMBeAjA65IkXadpWiiqjvk/jADFLxnDOdsAAAAASUVORK5CYII=">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutSine(t: number): number
	{
	  return Math.sin((t * Math.PI) / 2);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutSine(t: number): number
	{
		return -(Math.cos(Math.PI * t) - 1) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInQuad(t: number): number
	{
		return t * t;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutQuad(t: number): number
	{
		return 1 - (1 - t) * (1 - t);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutQuad(t: number): number
	{
		return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInCubic(t: number): number
	{
		return t * t * t;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutCubic(t: number): number
	{
		return 1 - Math.pow(1 - t, 3);
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABKCAYAAABek7HmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAB5JJREFUeJztnX+MHGUZx7/P7MwWT1v3OEUoYH+QFINaMK3iXRPCYmd3dlPoDxGQREVDwB8tYHIoGFMWG6IRkQpKozWtVgPkTDUHx9zN7JQtKndC2kqM0aA11qioOVv24NrSvZn38Y+bzU7rld5ed/fdmZ1Psn+8z+7tfHOfvLPvvu/Mu4QYKZimOS+ZTF7ied4yIroEwMUALgSwkJnfRUQLALwVQBeACQCvAfgpyYvcOZimeZGmaSsAXAHgCma+HMAiAEqdbzUeC2sCtm0vBJAHcJX/WHSWb1kB8GshRCEW1iAGBwfnd3V1fYqZbwTQhzP3nlcBvOw//k1EZQCTzDxJRK8T0QSmT4UTqVTqrytXrpwCgFjYWbJnz54LPc+7A8DtAN5+mpedAPACgL0Afum67u/y+fz4XI4XC5sjlmW9B8C9RHQTgOQMLykD2K0oypNdXV3P9/X1HW/EcWNhdWKa5gJVVe8DsAmAdsrTHoBBZv6J53nD+Xz+RKOPHwubJcxMxWLxegAPYXoIHuQEgAHP8x7I5XIvNzNHLGwWWJZ1MRHtAnD1KU+9AeDbmqY9nE6n/9uKLLGwM2Db9nUAdgI4N1hn5t1CiP5cLneolXliYafBPwXeC2ALTh6i/0kI8VnDMEoycsXCZmBgYCCRSqW2A/h0sE5EO1RVvTOdTk9KihYLOxXTNOepqvo4gA2BcpmIbtd1fUBWriqq7ADtxMDAQEJV1V04WdYhz/OMZo/+Zku9k4+RhZkplUr9CMANgfJLQoi+dpEFAAnZAdqFvr6+AhHdESg967qukcvlDksLNQPxZxgA27bXA9iN2v9jlJkz2Wz2qMRYM9LxwhzHWS6EeB7A2/zSftd1r8nn86/JzHU6OlqY4zg9QogXASz1S6+4rntlPp//h8xcb0bHDjqYmYQQT6Am67gQ4tp2lgV0sDDbtjcB0KttIrrTMIwDEiPNio48JQ4PD1+aSCQOYPoCFwB4MpPJfFxmptnScT2sVCqpiUTix6jJeqVSqXxeZqZ66DhhlUrlqwCurLaZ+dY1a9a8KjFSXXTUKdG27ZUARlFbKd6ZyWQ+IzFS3XRMDysUCgqA76Em64imaV+SGGlOdIyw3t7ejQA+FCh9uVWrxI2kI4SVSqXziej+QGnf6OjoDmmBzoKOEOa67lYAKb8phBBfKBQKQmamuRJ5YZZl6f7VuAAAZv6+YRgvysx0NkRamGma8xRFeTRQOpxMJjdLC9QAIi1M07R+Zr602mbmUA40gkRW2MjIyAXMfE+g9JuxsbGd0gI1iMgKUxRlC2prXAygP6wDjSCRnOkYGRm5XFGU/ahdAvFEJpO5WWamRhHJHqYoyoOoyXrD87yvyMzTSCInzLKsaxFY52Lmra2+nLqZREpYqVRSiejrgdK4oijfkBaoCURKmOu6nwPw3kBps67rE7LyNIPICBsaGupm5uCX4j9omvZDaYGaRGSEJZPJrwF4R6B0dzqddmXlaRaRGNY7jnOZEOIl1Na6ns1kMh+RmalZRKKHCSEeRk2WEELcLTNPMwm9sGKxuAFAJlDaEYbL1eZKqIWVSqVzmPlbgdKkECLUs/FnItTCKpVKP4Al1TYR3W8Yxr8kRmo6oRVmmuZFRBScjf99d3f3d6QFahGhFaaq6iOY3p4OAJiINlX3Y4oyoRRmWdaNANZX20S0Xdf1vfIStY7QCXMcp4eIHqm2mfkvx44d65eZqZWETpgQ4jEA5/lNl5lvXrt27esyM7WSUAmzbfsWnHzT+JYwXwE1F0IjzHGcpQCCo8BiuVx+QFYeWYRiLnF0dPQtk5OTvwKwApj+3JqamvpgmO46aRSh6GFHjx79LnxZAI4z8w2dKAsIgbBisXgXM1dvCRLM/MkozxWeibY+Jfpb3+2Gv8USEX1R1/WtclPJpW2FWZZ1FRFZAM4BAGbels1mQ3Nra7Noy1NisVj8MBE9BV8WgJ+NjY1tlJmpXWi7Hub3rKcBLPBLw67rrm/GhsdhpK16mG3b64loBL4sIhoql8vrYlk12mI3N2amVatWbQawDbWl/mdc171+3bp1FYnR2g7pp0TLss4jou0ArqvWmHlXT0/PrZ2wXFIvUoUVi8WPMvM2AO8MlL+p6/o9RMSycrUzUoQ5jnOZ53kPEZERKFeI6C5d17fJyBQWWirMcZxl/iVot+Dk/Yb/zswfy2azL7QyTxhpurBCoaD09vZeTUQbAazF/49Mf6Fp2m1hv5W1VTRFGDOTZVkfIKINRPQJAO+e4WWHmHlTNpsdakaGqNIwYcPDw4sVRVmlKMo1zJwDcMGMByQ6IIR4bP78+Y836ieaOom6he3bt08bHx9fmkgklgN4H4D3Y3p3tIVv8mdHADylKMoPVq9ePTa3qDHAaYSVSqXzPc9bIoRYDGAJMy8moqUAqr+GOpsv3P8kokFm/rmmac9F8U4SGZC/hLGCiJb7e1osQW3StR7+Q0R7mXkvET2n6/ofGxs1BpgeWj8IYBlzXd9TJwD8FsB+Ijrguu7+dvr1hCijAriNiO5j5kUAujG9t8UEER0WQhwhonEAB4noIBH9eWpq6qBhGH+LZyLk8D/h2ZMXTPLqRAAAAABJRU5ErkJggg==">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutCubic(t: number): number
	{
		return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInQuart(t: number): number
	{
		return t * t * t * t;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutQuart(t: number): number
	{
		return 1 - Math.pow(1 - t, 4);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutQuart(t: number): number
	{
		return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABKCAYAAABek7HmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABuJJREFUeJztnGtsHFcZht9vZryxY2/sbdQCalFagQotUCnBQmQVoNZeY+wWRdTiotBI4aYQflTQSkigGoqggoo7DSBBm1ZAuySIQFh2PGttQSTiEpHyA6E0pEJqoGpRfCNxsHf2vPywJznebuy1vZdpc54/3u+bc86c9eMzPnv2zAgMocfzvF6SJRE56bS7M4aVUUqNishWkm+QdnfGsDxHjhyJdnV1nQWwCcBZq90dMizPxo0b92BBFgD82QgLOSQ/poXHjLAQ47ruOwG8KYhJ/t4ICzEi8n4tnN28efNfjLCQUiqVHAC7gpik19/fXzbCQsr8/HwKwHVBLCKHAcAICy/v016X5+fnjwJGWCgplUqdInJnEJMcHxoamgSMsFDi+/4ggN4gDi6HgBEWSkjql8OK7/tHgsAICxn5fH4TgCEtNTY4OPifIDDCQobjOCMAuoKY5EH9uBEWPnZrr6ej0egv9YNGWIgYHx/fAuAdWuqJeDx+US9jhIUI3/d3A7j0lZdlWQeryxhhIYGkANijpU4nEok/VJczwkJCsVhMi8jrtNSjIsLqckZYSCD5US30bdt+yeUQMMJCQalUejWAYS31i0Qi8a9aZY2wEOD7/l4AHUFM8sCVyppdU21mdHTUIrk3iEXkVCqVKl2pvBlhbWb79u3vBnBTEJM8UGuyEWCEtRkR+aQWXlRKPb5ceSOsjXiedwuApJb6STabnViujhHWXvZDW9lYbrIRYHb+tolSqdRXLpefA9CzmPptOp2+faV6ZoS1iXK5vBeXZUFEvl5PPSOsDSxuYfuEljp97NixX9VT1whrA77vj2DpVP4bo6Ojqp66Rlh7+JT2egJAzXXDWhhhLWZsbCxNclsQkzyQyWQu1FvfCGsxJO/VwnKlUvneauobYS3E87ytIqJ/UD44ODh4djVtGGEthORntbAC4CurbcMIaxGe570FwHu01GPpdPr0atsxwlqEUuoBXP59VyzLenAt7RhhLaBQKGwTkTuCmOSPk8nkM2tpywhrAbZtfx6X120rSqkvrbUtI6zJFAqFt5HU98rndu7ceWqt7RlhTcayrC9o4bxt259bV3vr7I9hGVzXHQaQCWKS30okEmfW06YR1iRyuVxERB7SUhMkv7zedo2wJhGLxe4FcHMQi8j9K339Xw9GWBPI5/M3kPxMEIvIqVgs9v1GtG2ENYGOjo5vA+gOYqXUPf39/eVGtG2ENZixsbEPk7y0BEXysUwm85tGtW+ENZBisXgrAH1vxvMk72nkOYywBpHP5zcppQ5h6caa/Y2YaOgYYQ0gl8tFHMc5BOAWLf1IKpX6eaPPZYStk1wuZ/f19T0OIKWl/zY3N7e/GeczwtYBSent7T0AYERLX7Asa2R4eHi2Gee0m9Ho1UI8Hv9q1c0MBLBnuduF1osZYWvEdd0visinq9L3p9PpnzbzvGaErRKSsmPHjq8BuK/q0A/T6XS1wIZj7sBcBblcLuJ53g8A3K3nReSo4zgfb0UfjLA6KRQK19i2fYjkgJ5flHXXwMCA34p+mNuN6qBYLN6mlDoM4PV6XkSejMViuxu1TlgPZtKxAq7r7lNK/REvlfXw5OTkB1spCzCXxCviuu5rReS7WPr8DACYI7kvnU7/qB39MpfEKhZXLvaLyAMko1WHn1NKvTebzf6pLZ2DmdZfgqTE4/Hhzs7OJ0XkbgAbqor8TCk1lM1m/9GO/gVc9SPsxIkTHefOndtlWdZ9+m1AGv+0LOsjyWSy2PLO1eCqFTY+Pn697/sfEpF9AG6oUWSC5IPRaPQ71Q+ZbCdXlbB8Pn+t4zh3isgHSL4LtWfJ50l+MxKJPDQwMDDV6j6uxCta2PHjx7tmZmb6bdtOk8wC2IYrf5R5BsDDIvJoKpWabl0vV8crRpjrut22bd9K8s0k3wrg7QBug/aUtBqcF5FfA3gkmUyOLfeMp7DwshGWy+UiPT0919m2fb1lWVuUUlssy7qR5E0A3gjgRtT3fqYAHCV5OBqNumH6/1QPDRHmum53uVyO6LkNGzZERWTJB3Pf9/tkgR4A3SLSo5TqC+LFXAxAt1KqR0T6AFwL4FUANq+lbyLyX5K/E5GnSD41NTV1cmRkpLKmNxoCxPO8rSTvwsJf6TUAekj2ichGAJ1a2SjCvzIyAeAkgKcB/FVEnnYc5++tWphtBQ5JFwt/xZcQCe2V8gKAfwN4geSzInKG5Bnbtp+tVCpnMpnMi+3uYLNxLMu6vVKp7BKRm0m+RkR6sTCSegFEoO1gXaQLS0deLS4C+J+eIDknIrMiUiZ5HoAiOQ0AIjIJYBrAzOLPaRGZUUpNAnjRcZwXZmdnn2/WPomXE/8HyUhLc3MG7gMAAAAASUVORK5CYII=">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInQuint(t: number): number
	{
		return t * t * t * t * t;
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABKCAYAAABek7HmAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABvdJREFUeJztnG9sG2cdx7+/x38YpOnqoEoDsVasQggBKkgIUIYAC9sXVeoy0JR1IMQYg0mMjjExEAikTNoLyjbQ1AHjj/gzrZsWJpWtwvU5MSdNjVFfoLKp8GJaAWkBtZVC1oTWTs53X17EF1/S+Jw0d2cneT6S5fs9Pt/zTT56njuf7yzQLDE+Pn6967oDJDNKqYzveQBAH4A0gB0ikiLZDyAJYCfJhIhcD0AB8J49Mr5lAbCrTfc1APXm8gKA2ebjDQAXSZ5xHOfnEtYf28tUq9U3z83N7QVwY/OxR0T2kLxRRN4BYDcW/7EqaDvdhuSft5Sw0dFRNTg4uA/AB0juV0rtJ7kfi5I2Mw0AZ0k+samFnThx4i3pdPpmEckC+DiA/QB2RNwtsThNeVwBMN9cdgFcWrH+JZKuv0FE5rAowavd5npzAC4DuEzyAoCLSqmper1+7uDBg1eAxTl1U1EsFnenUqlbSQ4D+BSA69a5iQWSr4vIeQAXAPwHi/uICyIyQ/INALNKqVml1GytVrvS19dXy2az9eDNxsOmEGZZVrLRaNxC8k4AQwBSnd5D8ryInAHwCoDXSP4jmUyem56enhoZGXEijhwZPS2sWCzuTKVSXyF5GMCegFUXROS067p/AnA6nU6fyWaz52OKGSs9Kcw0zT6l1GGSDwIYaLPaFMnnReTk/Pz8KW+O3+r0lDCSMjExcQfJRwC8fZVV/kvymFJqbHJysjo6Ouquss6WpmeEVSqVvY7j/BbAJ1d5+SzJowsLC09vl5HUjp4QZprm7SLyJK4+C/BXpdR3crlcqRu5epGuCrMsa4dt20cB3LnipX8B+H61Wn1mO057QXRNWKlUeq9S6jiAd/maXRF5vF6vf2+7T33tSHaj03K5fADAswB2+ppfBXBXPp+f7EamzULsJztN07wPwItYLut4rVb7UKFQ0LI6EKuwcrn8bRF5HECi2UQAR6rV6m3Dw8NzcWbZrMS2DyuXy0cAfMvXZJP8vGEYz8WVYSsQyz7MNM1RLJc1T/KQYRh/iKP/rUTkI6xcLt8D4Elf0xWl1HAul5uIuu+tSKTCmkeDL6K1z2qQ/IxhGCei7HcrE9lBR6VS2QvgKbRkAcD9WtbGiESYZVnXOY5zHMBbvTaSDxUKhZ9E0d92IhJhtm0fAfBBryb5QqFQeCiKvrYboQsbHx//GICv+ZpeVUp9QUQYdl/bkVAPOponc18B8M5m0/+UUh/J5XJ/D7Of7UyoI8y27YfRkgWS92tZ4RLaCGuefT+D5gUyJF8wDOPWsLavWSS0EZZIJI6idTXTxUQicU9Y29a0CEWYaZqHSGa9muTduVzuQhjb1ixnw8LGxsbSAB726uZUqD8cR8SGhWUyma+KyL5mWQPwjY1uU9OeDQkrFos7SX7X1/SoYRj/3GAmTQAbEpZMJr+JxVt1AGBaRB7beCRNENcsrFQqDQD4uleLyA/y+fzKOzc0IXPNwkTkAbSuy/h3X1+fPrEbA9ckrFQqDYjIYa8m+djg4GAtvFiadlyTsBWja6Zer/8qvEiaINYtzLKsXStG10/1FU/xsW5hjUbjXrRGVz2dTj8RbiRNEOsSViwW30TyXq8WkV9v1RvnepV1CUsmk18E8LZm6TiO8+PwI2mCWLOwsbGxBIAHvFpEnh8aGnotklSatqxZWCaTGYbvThPXdR+JJJEmkDULI3mfrxw3DOMvEeTRdGBNwkzTfB+ATyy9SakfRZZIE8iahCml/J+7zp06daocXSRNEB2v6bAsa5dt21NY/DUziMiD+Xz+0ciTaVal4wizbfsuNGUBqIvIb6KNpAliLVPi3b7l53K53HRUYTSdCRRWLpdvBvAeryb5s8gTaQLpNMK+5Ft+2TCM01GG0XSmrTDLsnaIyG1eLSL6C8oeoO0ts7ZtHwLQ3ywvua77TDyRNEEETYn+6fB3hmFcjjqMpjOrCjt58uS7AXzUq13X/UVsiTSBrCoskUh82VdODg0N/S2mPJoOXCXMsqwkyc/5mp6OMY+mA1cJazQat4jIDc1yQSn1+5gzaQK4ShjJpYMNESnqMxu9xTJhlmXdAMDwatd1j8WeSBPIMmG2bd+O1u9qzPb39/8x/kiaIFZOiXf4lsf01by9x5KwiYmJmwB82KtFRE+HPciSMMdxPovWF5qvT05OvtSdSJogloSJyIi3TPKY/nHk3kQBQKVS2Qfg/b52PR32KAoAXNf9tK/tZcMwznYpj6YDCgBILv0ACkk9unoYVSwWd6N1Zt51HOfZbgbSBKNSqVQWrQ/LLx04cGCqm4E0wSj4rugVkae6mEWzBhRJT9jUzMyM3n/1OArATQAgIj8cGRlZ6HIeTQeSAI6JyL5kMvnLbofRdOb/aKdcfoP7SYYAAAAASUVORK5CYII=">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutQuint(t: number): number
	{
		return 1 - Math.pow(1 - t, 5);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutQuint(t: number): number
	{
		return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInExpo(t: number): number
	{
		return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutExpo(t: number): number
	{
		return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutExpo(t: number): number
	{
		return t === 0
				 ? 0
				 : t === 1
				 ? 1
				 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2
				 : (2 - Math.pow(2, -20 * t + 10)) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInCirc(t: number): number
	{
		return 1 - Math.sqrt(1 - Math.pow(t, 2));
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutCirc(t: number): number
	{
		return Math.sqrt(1 - Math.pow(t - 1, 2));
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGsAAABKCAYAAAC8T6qfAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAABzhJREFUeJztnX2MHGUdx7+/Z3anotf2rpdCX2gaJRXSiybCWblTasbdvW2OlvKHVCVGFEMJL8WE0KjxbVP/UIyJGjAYSGsCVOMmBmPxurvTYSCElugm1DQ5DdoYoC2tcHccBe66s/P8/KOz2fFyfbnb2X12nt3PP/v8np2d/d5+bl4yO8+zhC5NxXXdVZVK5WNCiNVSyrVEtAbAGgDLiWgpMy9j5l4iWgogGbysL3icAfAegNNE9AdSkF9L8vm82dfXd72UcoiIBph5IxFdh/oH3yivdWUtklwuJ4aGhj4NYJsQYjMzDwK4IqLVM4BTAI4DOE5Ez3ue96eurAXAzFQqlSwAXwawjYhWLeDlHoDXAPwHwBkiektK+RaAM0KICQATACaklBPT09MTO3bs8OeuoCvrMjh06FC/lPLrAHYC+PglFvcAjDPz3wEcNQzjmO/7x03TfMOyrGojObqyLkKhUFhBRLuJaBeAj1xgsRkARwC8IKV0pZR/HR0dPdeMPF1Z8zA2NrbEMIzdRPQQgOXzLPI2gGcBPNPT02MPDw/PtCJXV9YcCoXCJiHEPgADc57yieiglPLx6enpsfmOKc2mKysgOLvbQ0TfAWCEnnqfmR/zff9Xo6OjJ1TlA7qyAAC2bS9n5t8BGA11VwA8wsw/y2az/1UU7f/oeFmO46z3fb8A4LpQ90tCiJ3pdHpcVa75EKoDqKRYLK7zff851EX5AL59+PDhze0mCujgLatUKq0B8DyADUHXBDN/JZvN2upSXZyOlOW67oc8z3sRwGDQdUoIYaXT6VdV5roUHbkb9DzvUdRFnRFCZNpdFNCBsmzbvgvAN4NyBsCWdjw+zUdH7QaD49Q4gqsSRHRnJpP5rdpUl0+nbVmPoS5qf5xEAR0kq1gs3grglqB81/f93SrzLIaOkJXL5QQR7Ql17dmyZcubygItko6QNTw8fDuATwTlmWQy+WuVeRaL9rLy+bwB4Ie1moh+aVnWrMJIi0Z7Wb29vTcjuEpBRGcTicRvFEdaNNrLAnB3rSGlfNqyrHdUhmkErWU5jrMeQLZWG4bxlMI4DaO1LN/370TwRSIzH0+lUi8rjtQQWssC8MVQ+2kiYmVJIkBbWQcPHrwWwMZaLYT4o8I4kaCtLCHEbaHy9Uwmc0xZmIjQVhZC91MQ0bMqg0SFlrJc1+0hosFQ15+VhYkQLWVVKpWbUB8+M5tIJF5QmScqtJQlhLBC5eG4Xl6ai5aymHlzqO2qzBIl2sk6cODAhwF8KtT1nKosUaOdLNM0bwRgBuV7/f39f1OZJ0q0kwVgONR+cXBw0FOWJGK0k0VEnwu1SyqzRI1WsoIvGm+s1V1ZbUxfX98nUR/8djKVSv1DZZ6o0UoWgM+G2nbcr7LPRTdZqVBbq10goJGsfD5vMPPng5KZ2VEaqAloI2vFihWbEMzmQkSvtMtoxSjRRpaUMhNqa7cLBDSSBSATarftgLhG0EKW67qrAAwF5Qe+77+kMk+z0EKW53lfQn06hEKzZnhRjRayANxeaxBR7G+MuRCxl1UqlTYA2BSUFQB/URinqcReFjPvCpV2JpOZVhamycRaVjBr2TdCXfuVhWkBsZYlhLgfQE9QTiSTyWdU5mk2sZVl2/ZyAPfXaiLap8uNMRcitrIAfA/AyqA9SUQPqwzTCmIpq1AoDDDzA7WamX+QTqcnVGZqBbGTVS6Xk4ZhPAlgSdB1zDTNx1VmahUJ1QEWyuTk5C8AXB+Us0R0R6MTBceFWG1ZxWLxXgD3hbp2ZTKZV1TlaTWxmQ6oWCzeQUT7UP8He2pkZORrKjO1mlhsWbZt30NEexHkZeZCtVq9S3GsltPWW1a5XE5OTk7+HMADoW6np6dnW6um524n2laW4zjX+L6/H8Bnan3MfAjArdls9n11ydTRdrLK5XJyamrqW8z8I9QvJYGZHzFN88FOOfObj7aRxcxk2/Y2AD9BaOA2gAoz35vNZvcqitY2KJflum6iWq3ewszfRX0q1BovE9FOHQZvR4EyWY7jrJdSfpWZ7wawLvwcEZ2VUn7/yJEjj+ZyOakoYtvRUlmO41xTrVZvJqLbcP5W57nvP8vMTxDRT0dGRk61MlscaKqsQqGwmog2E9FNRJRm5msvsOgsMz+RSCQeTqVSJ5uZKc5EIiufz5vLli3bYBjGDcFvHQ4w80YAH73Ee4wDeDKZTO61LOvtKLLozEVljY2NLUkkEv1SypVCiLUArmTmq4noKgBrAVwF4GqcP+ZcjngGcBRAgYh+3z1xWBjkum5vtVr9AjMP4PzUpOuYeaUQ4kpmXtrg+iUR/QtAWUppm6ZZtCzrdOOxO5OE53lHAawPdxIRmBc0tGkGwBsA/g3gnwBelVKOnzt37uj27dvPRpa2w0kw84+J6EEAqwEsBVDF+Q9/KnicYeZ3iOgDIjrNzCeZ+YRhGKd83z/hed7JrVu3Tin8GzqG/wEqHV8PtjvvKgAAAABJRU5ErkJggg==">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutCirc(t: number): number
	{
		return t < 0.5
				 ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
				 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2;
	}

	/**
	 * <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGwAAABTCAYAAAB6SuK1AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAACCBJREFUeJztnX+MHGUZx7/Pu7tzvXLc3h0W+QNbLaGaYmOQa7heA3Tt7szaplRMPCApUAwaKLExqME/1CxpEKOCGkyI/uMRJNZFofXO7e3stCs0aYArP8y11Eih1tZCpddeU/rjbm/fxz9uxp0sd7t7u7M7o3k/ySbzvPO+z/veffd55p2Zd2YJisAzMjLSI4T4CzO/EfZ7MIrqhEKhbcy8goiWkt+DUVQmn893FQqF4wAuA/Cu8HtAisoUCoWvYkYsANivBAswqVRKMPMWV9EedQwLMP39/TcBuMZVtEdFWIAhogGXeUzX9beVYAElnU6HpJRfdhXtAQAlWECJRqO3ENFVjs3MOwBAHcMCijsdEtG5jo6OLKAiLJDk8/kwgNscm5l39Pf3XwSUYIFkamoqBuBKx2bm55xtJVgAEULc4TInisWi+d99PoxHUYF0Oq0x85dcRS+sW7du0jGUYAEjGo0aAHoc250OASVY4CCiO13mSU3Tcu79SrAAMTQ0tBDABlfR07FYbNpdRwkWIDRNuxVAh2MT0WB5HSVYgBBC3O4yX04kEoc+UqeF41FUwLKsK5h5nWMz829mq6cECwjFYvFuAJptXtQ0LT1bPSVYQCCie1zbz8disYnZ6inBAoBpmr0APufYc6VDQAkWCIjoXmebmd/Zt29ffs66rRmSYi7S6bTW1dV1AsAVdtG3dV1/fK76KsJ8JhqN3oaSWJeEEIOV6ivBfIaIHnCZ2+Px+Hil+kowH7EsazmAmx1bSvlUtTZKMB9h5gdRmke8mUwmX63WRgnmEzt37rycmTc5NjP/spZ2SjCfaG9vvxtAp21OANheSzslmH+4JxtPG4ZxvpZGSjAfyOVyawBcZ5tSSllTOgSUYL7AzA8520T0p2QyebjWtkqwFmNZ1jIA6x1bSvmz+bRXK39bDDN/C3agENHruq6/NJ/2KsJaSCaTWcTMdzm2lPKJ+fpQgrWQUCj0IIB22zxx9uzZ5yrVnw0lWIvI5/MLiOh+xyaiJwcGBqbm60cJ1iKmp6fvBfBx27xQLBZ/XY8fJVgLsJdfP+zYRDSYTCZP1+NLCdYCotHoZgBLbLMgpfxpvb6UYE1m//79ESL6rqvoWcMwjtTrTwnWZMbHx+8C8CnblEKInzTiTwnWRNLpdKgsuv4Qj8ffasSnEqyJRKPRTQCutU2WUv6wUZ9KsCaRTqc1IvqBq2g4mUz+tVG/SrAm0d3dvQXAUsdm5h954VetS2wCmUymMxwOHwawCACY2TIMI+GFbxVhTSASiXwHtlgAWAjxfa98qwjzmGw2e6UQ4jAzXw4ARPT7RCJxR7V2taIizGOI6BFHLAAFZvYsugAlmKfkcrnrAXzNVfQrXdff9rIPJZhHMDMx888BhOyiDyORyKNe96ME84hcLncPXMuumfnxWCz2vtf9KME8IJ/PdwFwn2cdu3Tp0pyPDDWCEswDCoXCIyjdnAQRPbBx48ZzzehLTesbxLKsVVLKvbCPXUT0bCKR2FSlWd2oCGuAoaGhhVLKQZQmGv8Oh8PfbGafSrAGaGtrewzAMttkZr4vFoudamafKiXWiWmaqwG8hNKX/se6rj9coYknqAirg+Hh4W4Az6D0/3ulp6fne63oWwk2T1KplNA07bco3fb/IBQK3d7b21toRf9KsHnS39+fAuC8E6oA4Ctr16492qr+lWDzwDTNOwG4U99WXddfbOUY1KSjRizLikspMwAiAMDMTxmGsaVKM89REVYDIyMjN0kpX4AtFoBdmqZt9WMsKsKqkM1mbyaiP6P0ptDXIpHImlgs9qEf41ERVgHTNHUiGkFJrCNCiPV+iQUowebEsqwkgJ2wn+di5vcBGPF4/KSf41KCzYJpmpullDsALLCLPgCQ8PrucT2oZ5xdpNPpUFdX16MA3JeYJpj5i4ZhHPBrXG7CpmneT0SGlLKDiKYAjBPRKWY+BeCfAI5IKd9NJpPv+TzWpjI8PNytadp2ALqreEIIocfj8df8Glc5ZJrmeQALa6h7HsAhAGMADgIYk1KO/T8IaVnWcjsFXusqPimlNLxYXu0llMvlnmDmb6D+9PgvIhpl5lFmHtU0bXSuFwwHDWamXC63FcBjKD0sDgBHEZBjVjkEAPl8vqNYLC5m5k4p5VVCiKsBLJZSriCi5QAWz8MnAzjMzKNCiFFmHp2cnHxjw4YNF5rxB9RLNpv9LBE9CWBN2a4xZl5vGMYxH4ZVlZpOnDOZTKemadcxcy8zrwTQC+DTqH2WOY2ZNDoK4BUp5WhbW9vB8t8VaQW7d+++Rkr5EDN/HWVZhZn/qGnaZj/Ps6pR95WOTCbTKYS4QQixEoDzWVKlmZsLAF4H8CoRHSgWiwcnJycPNWPxSi6XizLzFzCzyNPAR79o0wC2JRKJbUTEXvfvJZ5emspkMovC4fBKIlppR2IfSi8grpWjAP7GzH8nouMATkgpj0YikRNCiPFKx8dUKiVWr159NYClUsqlQojPMPMtAG5Aad1FOW8y832GYQRmJliJpl9LtCxrGTP3AbiRmVcBWIHGz/8uALgI4CxmTm7bMTPTbZuHjwMAfhGJRAb9SM310vKLv9ls9jIi6gXQZwt4o/v3ipvMKQA7mPl3uq7ng57+ZiMQV+t37dr1yVAotAozKbQPwPUo3cpohPMAXiaivQBePHPmzN6BgYGiB359IxCClZPP5xdMTU19noj6ACxn5iVCiE8w88cwM2HoBjCJmdR4DjOp8TgRvcfM/yCit4ho7PTp0+/8rwtUzn8AoPG5xlDef44AAAAASUVORK5CYII=">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInBack(t: number): number
	{
		const c1: number = 1.70158;
		const c3: number = c1 + 1;

		return c3 * t * t * t - c1 * t * t;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutBack(t: number): number
	{
		const c1: number = 1.70158;
		const c3: number = c1 + 1;

		return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutBack(t: number): number
	{
		const c1: number = 1.70158;
		const c2: number = c1 * 1.525;

		return t < 0.5
				 ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
				 : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInElastic(t: number): number
	{
		const c4: number = (2 * Math.PI) / 3;

		return t === 0
				 ? 0
				 : t === 1
				 ? 1
				 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * c4);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutElastic(t: number): number
	{
		const c4: number = (2 * Math.PI) / 3;

		return t === 0
				 ? 0
				 : t === 1
				 ? 1
				 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutElastic(t: number): number
	{
		const c5: number = (2 * Math.PI) / 4.5;

		return t === 0
				 ? 0
				 : t === 1
				 ? 1
				 : t < 0.5
				 ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
				 : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInBounce(t: number): number
	{
		return 1 - Fx.easeOutBounce(1 - t);
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeOutBounce(t: number): number
	{
		const n1: number = 7.5625;
		const d1: number = 2.75;

		if(t < 1 / d1)
			return n1 * t * t;
		else if(t < 2 / d1)
			return n1 * (t -= 1.5 / d1) * t + 0.75;
		else if(t < 2.5 / d1)
			return n1 * (t -= 2.25 / d1) * t + 0.9375;
		else
			return n1 * (t -= 2.625 / d1) * t + 0.984375;
	}

	/**
	 * <img src="data:image/png;base64,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">
	 * 
	 * @param 		t			Reference of time set internally
	 * @return					Calculation of the ease
	 */
	public static easeInOutBounce(t: number): number
	{
		return t < 0.5
				 ? (1 - Fx.easeOutBounce(1 - 2 * t)) / 2
				 : (1 + Fx.easeOutBounce(2 * t - 1)) / 2;
	}
}
