import {Point} from '../Point.js';
import {Drawable} from '../Drawable.js';
import {IDrawableLabelAttributes} from '../interfaces/IDrawable.js';
import {IDrawableLabelFilter} from '../interfaces/IDrawable.js';
import {Style} from '../enums/Font.js';
import {Variant} from '../enums/Font.js';
import {Weight} from '../enums/Font.js';



export class Label extends Drawable
{
	private _content: string;
	private _canvas: OffscreenCanvas = new OffscreenCanvas(0, 0);
	private _splitted: string[] = [];
	private _font: string;
	private _padding: {top?: number, bottom?: number, left?: number, right?: number};
	private _spacing: number;
	private _wrapping: boolean;
	private _corner: boolean;
	private _autosize: boolean;
	private _multiline: boolean;
	private _tabsize: number;
	private _fillbackground: string;
	private _filter: IDrawableLabelFilter
	//---

	/**
	 * Contructs an Label drawable.
	 */
	public constructor(attributes: IDrawableLabelAttributes = {})
	{
		super({
			...attributes,
		});

		const {
			nostroke = true,
			content = '',
			font = '16px system-ui',
			padding = {},
			spacing = 3,
			wrapping = false,
			corner = false,
			autosize = false,
			multiline = false,
			tabsize = 3,
			fillbackground = '',
			generate = true,
			filter = null
			/*
			{
				0: { 
					0: {
						font: font,
						fillcolor: this.fillcolor,
					}
				}
			}
			*/
		} = attributes;

		this.nostroke = nostroke;
		this._content = content;
		this._font = font;
		this._padding = {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding};
		this._spacing = spacing;
		this._corner = corner;
		this._wrapping = wrapping;
		this._autosize = autosize;
		this._multiline = multiline;
		this._tabsize = tabsize;
		this._fillbackground = fillbackground;
		this._filter = filter;

		if(generate)
			this.generate();
	}

	/**
	 * Generates the [[Drawable]]. By default, this is called by the constructor but can be deactivated by passing 
	 * the *generate: false* in the attributes. After the method is called, [[points]], [[path]] and [[boundaries]] are sets.
	 */
	public generate(): void
	{
		const context2D: OffscreenCanvasRenderingContext2D = this._canvas.getContext("2d");
		let x: number = 0;
		let y: number = 2;
		let maxwidth = 0;
		let boundingbox = this.boundingbox('[j');
		
		// applying options to get the spitted array and size of label
		if(this._multiline)
		{
			if(this._wrapping)
			{
				if(this._autosize)
				{
					this._splitted = this.wrap(this.width - (this._padding.left + this._padding.right), (window.innerHeight / (boundingbox.height + this._spacing)) + 1);
					this.height = (boundingbox.height + this._spacing) * this._splitted.length;
				}
				else
					this._splitted = this.wrap(this.width - (this._padding.left + this._padding.right), Math.floor(((this.height - (this._padding.left + this._padding.right)) / (boundingbox.height + this._spacing))));
			}
			else
			{
				this._splitted = this._content.replace(/\t/g, ' '.repeat(this._tabsize)).split('\n');

				if(this._autosize)
				{		
					boundingbox = this.boundingbox(this._content.replace(/\t/g, ' '.repeat(this._tabsize)));
					this.width = boundingbox.width;
					this.height = (boundingbox.height + this._spacing) * this._splitted.length;
				}
			}
		}
		else
		{
			if(this._wrapping)
				this._splitted = this.wrap(this.width - (this._padding.left + this._padding.right), 1);
			else
				this._splitted[0] = this._content.replace(/\t/g, ' '.repeat(this._tabsize));

			if(this._autosize)
			{		
				boundingbox = this.boundingbox(this._content.replace(/\t/g, ' '.repeat(this._tabsize)));
				this.width = boundingbox.width;
				this.height = (boundingbox.height + this._spacing + 1);
			}
		}

		this._canvas.width = this.width - (this._padding.left + this._padding.right) + 1;
		this._canvas.height = this.height - (this._padding.top + this._padding.bottom);


		// bonderies
		this.path = new Path2D();

		if(this._corner)
		{
			this.path.rect(0, 0, this.width, this.height);
			this.boundaries = { 
				topleft: new Point(this.x, this.y), 
				bottomright: new Point(this.x + this.width + maxwidth, this.y + this.height + y - this._spacing) 
			};
		}
		else
		{
			this.path.rect(-this.width / 2, -this.height / 2, this.width, this.height);
			this.boundaries = { 
				topleft: new Point(this.x - (this.width / 2), this.y - (this.height / 2)), 
				bottomright: new Point(this.x + (this.width / 2) + maxwidth, this.y + (this.height / 2) + y - this._spacing) 
			}
		}

		this.path.closePath();

		this.points = [
			this.boundaries.topleft,
			new Point(this.boundaries.bottomright.x, this.boundaries.topleft.y),
			this.boundaries.bottomright,
			new Point(this.boundaries.topleft.x, this.boundaries.bottomright.y)
		];


		// beginning context
		context2D.fillStyle = this.fillcolor;
		context2D.font = this._font;
		context2D.textAlign = 'left';
		context2D.textBaseline = 'top';
		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;
		context2D.imageSmoothingEnabled = false;
		
		
		// filling text with filters if needed
		const maxline: number = this._multiline ? Math.floor(((this.height - (this._padding.top + this._padding.bottom)) / (boundingbox.height + this._spacing))) : 1;
		const length: number = this._splitted.length;
		let mark: boolean = false;
		let markcolor: string;

		for(let row: number = 0; row < length; row++)
		{
			if(row <= maxline)
			{
				if(this._filter && this._filter[row])
				{
					const keys: string[] = Object.keys(this._filter[row]);

					if(Object.entries(this._filter[row]).length > 0)
					{
						// this part is for the beginning of a line when we have a filter that is not on the first char
						const string: string = this._splitted[row].substring(0, parseInt(keys[0]));
							
						if(mark)
						{
							const backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
							
							context2D.fillStyle = markcolor;
							context2D.fillRect(x, y, context2D.measureText(string).width, boundingbox.height);
							context2D.fillStyle = backup;
						}

						context2D.fillText(string, x, y);
						x += context2D.measureText(string).width;

						// looping through filter
						Object.entries(this._filter[row]).forEach(([column, columnvalue]: any) => {
							const nextColumn: number = keys.indexOf(column) + 1;
							const nextIndex: number = parseInt(keys[nextColumn]) || this._splitted[row].length;
							const string: string = this._splitted[row].substring(parseInt(column), nextIndex);
							
							if(columnvalue.mark === true)
								mark = true;
							else if(columnvalue.mark === false)
								mark = false;
							if(columnvalue.markcolor)
								markcolor = columnvalue.markcolor;

							if(mark)
							{
								const backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
								
								context2D.fillStyle = markcolor;
								context2D.fillRect(x, y, context2D.measureText(string).width, boundingbox.height);
								context2D.fillStyle = backup;
							}

							if(columnvalue.font)
								context2D.font = columnvalue.font;
							if(columnvalue.fillcolor)
								context2D.fillStyle = columnvalue.fillcolor;
							if(columnvalue.spacing)
								this._spacing = columnvalue.spacing;		

							context2D.fillText(string, x, y);
							x += context2D.measureText(string).width;
						});
					}
					else
					{
						if(mark)
						{
							const backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
							
							context2D.fillStyle = markcolor;
							context2D.fillRect(x, y, context2D.measureText(this._splitted[row]).width, boundingbox.height);
							context2D.fillStyle = backup;
						}

						context2D.fillText(this._splitted[row], x, y);
					}
				}
				else
				{
					const measure = context2D.measureText(this._splitted[row]).width;

					if(measure > maxwidth)
					{
						maxwidth = measure;
						if(maxwidth > this.width)
							maxwidth = this.width
					}

					if(mark)
					{
						const backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
						
						context2D.fillStyle = markcolor;
						context2D.fillRect(x, y, context2D.measureText(this._splitted[row]).width, boundingbox.height);
						context2D.fillStyle = backup;
					}

					context2D.fillText(this._splitted[row], x, y);
				}

				if(x > maxwidth)
				{
					maxwidth = x;
					if(maxwidth > this.width)
						maxwidth = this.width
				}

				x = 0;
				y += (boundingbox.height + this._spacing);
			}
			else
				break;
		}
	}

	/**
	 * Draws the [[Drawable]] on the [[Context]] canvas. This method is usualy called by the [[Context]] refresh so the current
	 * canvas context is given. If the user need to call the draw method manualy, he will have to provide the canvas context
	 * with the [[Context]] context2D accessor.
	 * 
	 * @param 	context2D			Current canvas context to use. 
	 */
	public draw(context2D: OffscreenCanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.setTransform(
			this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, 
			this.matrix.e + this.offset1.x + this.offset2.x, 
			this.matrix.f + this.offset1.y + this.offset2.y
		);

		context2D.globalAlpha = this.alpha;
		context2D.imageSmoothingEnabled = false;
		context2D.strokeStyle = this.strokecolor;

		if(!this.nostroke)
			context2D.stroke(this.path);

		if(this._fillbackground != '')
		{
			context2D.fillStyle = this._fillbackground;
			context2D.fill(this.path);
		}

		context2D.shadowBlur = this.shadow;
		context2D.shadowColor = this.shadowcolor;

		if(this._corner)
			context2D.drawImage(this._canvas, this._padding.left, this._padding.top);
		else
			context2D.drawImage(this._canvas, (-this._canvas.width / 2) + this._padding.left, (-this._canvas.height / 2) + this._padding.top);

		context2D.restore();
	}

	/**
	 * Wraps a text in multiple line. Each size of the word is calculated so that the new line is put at the right place.
	 * 
	 * @param 	maxwidth 			Maximum width in pixel of a line.
	 * @param 	maxline 				Maximum line the method will return.
	 * @returns 						An array of string representing each of the text line.
	 */
	private wrap(maxwidth: number, maxline: number): string[]
	{
		const context2D: OffscreenCanvasRenderingContext2D = this._canvas.getContext("2d");
		let row: number = 0;
		let aOut: string[] = [];
		let nCount: number = 0;
		let lines: string[] = this._content.split('\n');

		context2D.save();
		context2D.font = this._font;

		for(let line of lines)
		{
			let nLineWidth: number = 0;
			let aWords: string[] = line.split(/(?=[ \t])|(?<=[ \t])/g);

			aOut[row] = '';

			for(let word of aWords)
			{
				let nWordWidth: number = context2D.measureText(word).width;

				if(word == '\t')
				{
					word = ' '.repeat(this._tabsize);
					nWordWidth = context2D.measureText(word).width;
				}

				if(nWordWidth >= maxwidth)
				{
					// occur when a word is too long for the current line
					aOut[row] += word;
					maxwidth -= context2D.measureText('...').width;
					if(maxwidth < 0)
						maxwidth = 0;

					while(context2D.measureText(aOut[row]).width > maxwidth)
						aOut[row] = aOut[row].slice(0, -1);

					aOut[row] += '...';
					context2D.restore();
					return aOut;
				}
				else if(nWordWidth + nLineWidth < maxwidth)
				{
					aOut[row] += word;
					nLineWidth += nWordWidth;
				}
				else
				{
					if(++row < maxline)
					{
						if(word != ' ')
						{
							aOut[row] = word;
							nLineWidth = nWordWidth;
						}
						else
						{
							aOut[row] = '';
							nLineWidth = 0;
						}
					}
					else
					{
						// occur when all lines are filled but these no more room for word
						aOut[row - 1] += word;
						maxwidth -= context2D.measureText('...').width;
						if(maxwidth < 0)
							maxwidth = 0;
	
						while(context2D.measureText(aOut[row - 1]).width > maxwidth)
							aOut[row - 1] = aOut[row - 1].slice(0, -1);

						aOut[row - 1] += '...';
						context2D.restore();
						return aOut;
					}
				}
			}

			nCount++;
			row++;
			if(row >= maxline)
			{
				if(lines.length > nCount)
				{
					// occur when these no more line when pressing enter
					maxwidth -= context2D.measureText('...').width;
					if(maxwidth < 0)
						maxwidth = 0;

					while(context2D.measureText(aOut[maxline - 1]).width > maxwidth)
						aOut[maxline - 1] = aOut[maxline - 1].slice(0, -1);

					aOut[maxline - 1] += '...';
				}

				break;
			}
		}
		
		context2D.restore();
		return aOut;
	}

	/**
	 * 
	 * 
	 * @param 	text 					Text to be measure.
	 * @returns 						Measurement of the text. In the case no method argument is entered, only the height is calculated.
	 */
	public boundingbox(text?: string): {width: number, height: number}
	{
		const context2D: OffscreenCanvasRenderingContext2D = this._canvas.getContext("2d");
		let boundingbox: {width: number, height: number} = {width: 0, height: 0};

		context2D.save();
		context2D.font = this._font;
		context2D.textAlign = 'left';
		context2D.textBaseline = 'top';

		if(text)
			boundingbox.width = context2D.measureText(text).width;
		else
			boundingbox.width = 0;
		boundingbox.height = context2D.measureText('[j').actualBoundingBoxDescent + context2D.measureText('[j').actualBoundingBoxAscent;

		context2D.restore();

		return boundingbox;
	}

	public change(properties: {style?: Style, variant?: Variant, weight?: Weight, size?: number, family?: string}): void
	{
		let style: string[] = this._font.match(/italic|oblique/g);
		let variant: string[] = this._font.match(/small-caps/g);
		let weight: string[] = this._font.match(/bold|bolder|lighter/g);

		this._font = this._font.replace(/normal|italic|oblique|small-caps|bold|bolder|lighter/g, '');

		if(!style) style = Array('');
		if(!variant) variant = Array('');
		if(!weight) weight = Array('');

		if(properties.style) style[0] = properties.style;
		if(properties.variant) variant[0] = properties.variant;
		if(properties.weight) weight[0] = properties.weight;

		this._font = style[0] + ' ' + variant[0] + ' ' + weight[0] + this._font;

		if(properties.size)
			this._font = this._font.replace(/(\d+)px/g, properties.size + 'px');

		if(properties.family)
		{
			const index = this._font.lastIndexOf(' ');
			this._font = this._font.substring(0, index) + ' ' + properties.family;
		}

		this.generate();
	}


	/**
	 * Clones this [[Drawable]] with attributes only.
	 * 
	 * @param 	attributes 			Attributes that you would like to override.
	 * @returns 						A new clone of this Drawable.
	 */
	public clone(attributes: IDrawableLabelAttributes = {}): Label
	{
		const cloned: Label = new Label({
			...this.attributes,
			...{
				autosize: this._autosize,
				content: this._content,
				corner: this._corner,
				fillbackground: this._fillbackground,
				filter: this._filter,
				font: this._font,
				multiline: this._multiline,
				padding: this._padding,
				spacing: this._spacing,
				tabsize: this._tabsize,
				wrapping: this._wrapping,
			},
			...attributes
		});

		return cloned;
	}



	// Accessors
	// --------------------------------------------------------------------------

	get canvas(): OffscreenCanvas
	{
		return this._canvas;
	}

	get content(): string
	{
		return this._content;
	}
	set content(content: string)
	{
		this._content = content;
	}

	get contentAs(): {splitted: string[]}
	{
		if(!this._splitted[0])
			this._splitted[0] = '';
			
		return { splitted: this._splitted };
	}

	get font(): string
	{
		return this._font;
	}
	set font(font: string)
	{
		this._font = font;
	}

	get padding(): {top?: number, bottom?: number, left?: number, right?: number}
	{
		return this._padding;
	}
	set padding(padding: {top?: number, bottom?: number, left?: number, right?: number})
	{
		this._padding = {...this._padding, ...{padding}};
	}

	get spacing(): number
	{
		return this._spacing;
	}
	set spacing(spacing: number)
	{
		this._spacing = spacing;
	}

	get wrapping(): boolean
	{
		return this._wrapping;
	}
	set wrapping(wrapping: boolean)
	{
		this._wrapping = wrapping;
	}

	get corner(): boolean
	{
		return this._corner;
	}
	set corner(corner: boolean)
	{
		this._corner = corner;
	}

	get autosize(): boolean
	{
		return this._autosize;
	}
	set autosize(autosize: boolean)
	{
		this._autosize = autosize;
	}

	get multiline(): boolean
	{
		return this._multiline;
	}
	set multiline(multiline: boolean)
	{
		this._multiline = multiline;
	}

	get tabsize(): number
	{
		return this._tabsize;
	}
	set tabsize(tabsize: number)
	{
		this._tabsize = tabsize;
	}

	get fillbackground(): string
	{
		return this._fillbackground;
	}
	set fillbackground(fillbackground: string)
	{
		this._fillbackground = fillbackground;
	}

	get filter(): IDrawableLabelFilter
	{
		return this._filter;
	}
	set filter(filter: IDrawableLabelFilter)
	{
		this._filter = filter;
	}
}
