import {Point} from '../Point.js';
import {Size} from '../Size.js';
import {Drawable} from '../Drawable.js';
import {IDrawableLabelAttributes} from '../IDrawable.js';
import {IDrawableLabelFilter} from '../IDrawable.js';



export class Label extends Drawable
{
	private _content: string;
	private _canvas: HTMLCanvasElement = document.createElement("canvas");
	private _splitted: Array<string> = [];
	private _image: HTMLImageElement = new Image();
	private _attributes: IDrawableLabelAttributes;
	//---

	public constructor(point: Point, size: Size, attributes: IDrawableLabelAttributes = {})
	{
		super(point, attributes);

		const {
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
			nostroke = true,
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

		this.size = size;
		this._content = content;
		this.nostroke = nostroke;
		this._attributes = {
			font: font,
			padding: {...{top: 0, bottom: 0, left: 0, right: 0}, ...padding},
			spacing: spacing,
			corner: corner,
			wrapping: wrapping,
			autosize: autosize,
			multiline: multiline,
			tabsize: tabsize,
			fillbackground: fillbackground,
			filter: filter
		};

		if(generate)
			this.generate();
	}

	public generate(): void
	{
		let x: number = 0;
		let y: number = 0;
		let maxwidth = 0;
		let context2D: CanvasRenderingContext2D = this._canvas.getContext("2d");
		let boundingbox = this.boundingbox('j');
		
		// applying options to get the spitted array and size of label
		if(this._attributes.multiline)
		{
			if(this._attributes.wrapping)
			{
				if(this._attributes.autosize)
				{
					this._splitted = this.wrap(this.size.width - (this._attributes.padding.left + this._attributes.padding.right), (window.innerHeight / (boundingbox.height + this._attributes.spacing)) + 1);
					this.size.height = (boundingbox.height + this._attributes.spacing) * this._splitted.length;
				}
				else
					this._splitted = this.wrap(this.size.width - (this._attributes.padding.left + this._attributes.padding.right), Math.floor(((this.size.height - (this._attributes.padding.left + this._attributes.padding.right)) / (boundingbox.height + this._attributes.spacing))));
			}
			else
			{
				this._splitted = this._content.replace(/\t/g, ' '.repeat(this._attributes.tabsize)).split('\n');

				if(this._attributes.autosize)
				{		
					boundingbox = this.boundingbox(this._content.replace(/\t/g, ' '.repeat(this._attributes.tabsize)));
					this.size.width = boundingbox.width;
					this.size.height = (boundingbox.height + this._attributes.spacing) * this._splitted.length;
				}
			}
		}
		else
		{
			if(this._attributes.wrapping)
				this._splitted = this.wrap(this.size.width - (this._attributes.padding.left + this._attributes.padding.right), 1);
			else
				this._splitted[0] = this._content.replace(/\t/g, ' '.repeat(this._attributes.tabsize));

			if(this._attributes.autosize)
			{		
				boundingbox = this.boundingbox(this._content.replace(/\t/g, ' '.repeat(this._attributes.tabsize)));
				this.size.width = boundingbox.width;
				this.size.height = (boundingbox.height + this._attributes.spacing);
			}
		}

		this._canvas.width = this.size.width - (this._attributes.padding.left + this._attributes.padding.right) + 1;
		this._canvas.height = this.size.height - (this._attributes.padding.top + this._attributes.padding.bottom);


		// bonderies
		this.clearPath();

		if(this._attributes.corner)
		{
			this.path.rect(0, 0, this.size.width, this.size.height);
			this.boundaries = { topleft: new Point(this.point.x, this.point.y), bottomright: new Point(this.point.x + maxwidth, this.point.y + y - this._attributes.spacing) };
		}
		else
		{
			this.path.rect(-this.size.width / 2, -this.size.height / 2, this.size.width, this.size.height);
			this.boundaries = { topleft: new Point(this.point.x - (this.size.width / 2), this.point.y - (this.size.height / 2)), bottomright: new Point(this.point.x - (this.size.width / 2) + maxwidth, this.point.y - (this.size.height / 2) + y - this._attributes.spacing) }
		}

		this.points = [
			this.boundaries.topleft,
			new Point(this.boundaries.bottomright.x, this.boundaries.topleft.y),
			this.boundaries.bottomright,
			new Point(this.boundaries.topleft.x, this.boundaries.bottomright.y)
		];


		// beginning context
		context2D.fillStyle = this.fillcolor;
		context2D.font = this._attributes.font;
		context2D.textAlign = 'left';
		context2D.textBaseline = 'top';

		if(this.shadow != 0)
		{
			context2D.shadowBlur = this.shadow;
			context2D.shadowColor = this.shadowcolor;
		}


		// filling text with filters if needed
		let maxline: number = this._attributes.multiline ? Math.floor(((this.size.height - (this._attributes.padding.top + this._attributes.padding.bottom)) / (boundingbox.height + this._attributes.spacing))) : 1;
		let mark: boolean = false;
		let markcolor: string;
		let length: number = this._splitted.length;

		for(let row: number = 0; row < length; row++)
		{
			if(row <= maxline)
			{
				if(this._attributes.filter && this._attributes.filter[row])
				{
					let keys: string[] = Object.keys(this._attributes.filter[row]);

					if(Object.entries(this._attributes.filter[row]).length > 0)
					{
						// this part is for the beginning of a line when we have a filter that is not on the first char
						let string: string = this._splitted[row].substring(0, parseInt(keys[0]));
							
						if(mark)
						{
							let backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
							
							context2D.fillStyle = markcolor;
							context2D.fillRect(x, y, context2D.measureText(string).width, boundingbox.height);
							context2D.fillStyle = backup;
						}

						context2D.fillText(string, x, y);
						x += context2D.measureText(string).width;

						// looping through filter
						Object.entries(this._attributes.filter[row]).forEach(([column, columnvalue]: any) => {
							let nextColumn: number = keys.indexOf(column) + 1;
							let nextIndex: number = parseInt(keys[nextColumn]) || this._splitted[row].length;
							let string: string = this._splitted[row].substring(parseInt(column), nextIndex);
							
							if(columnvalue.mark === true)
								mark = true;
							else if(columnvalue.mark === false)
								mark = false;
							if(columnvalue.markcolor)
								markcolor = columnvalue.markcolor;

							if(mark)
							{
								let backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
								
								context2D.fillStyle = markcolor;
								context2D.fillRect(x, y, context2D.measureText(string).width, boundingbox.height);
								context2D.fillStyle = backup;
							}

							if(columnvalue.font)
								context2D.font = columnvalue.font;
							if(columnvalue.fillcolor)
								context2D.fillStyle = columnvalue.fillcolor;
							if(columnvalue.spacing)
								this.spacing = columnvalue.spacing;		

							context2D.fillText(string, x, y);
							x += context2D.measureText(string).width;
						});
					}
					else
					{
						if(mark)
						{
							let backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
							
							context2D.fillStyle = markcolor;
							context2D.fillRect(x, y, context2D.measureText(this._splitted[row]).width, boundingbox.height);
							context2D.fillStyle = backup;
						}

						context2D.fillText(this._splitted[row], x, y);
					}
				}
				else
				{
					let measure = context2D.measureText(this._splitted[row]).width;

					if(measure > maxwidth)
					{
						maxwidth = measure;
						if(maxwidth > this.size.width)
							maxwidth = this.size.width
					}

					if(mark)
					{
						let backup: string | CanvasGradient | CanvasPattern = context2D.fillStyle;
						
						context2D.fillStyle = markcolor;
						context2D.fillRect(x, y, context2D.measureText(this._splitted[row]).width, boundingbox.height);
						context2D.fillStyle = backup;
					}

					context2D.fillText(this._splitted[row], x, y);
				}

				if(x > maxwidth)
				{
					maxwidth = x;
					if(maxwidth > this.size.width)
						maxwidth = this.size.width
				}

				x = 0;
				y += (boundingbox.height + this._attributes.spacing);
			}
			else
				break;
		}

		this._image.src = this._canvas.toDataURL('image/png');
	}

	public draw(context2D: CanvasRenderingContext2D): void
	{
		context2D.save();
		context2D.translate(this.point.x + this.offset.x, this.point.y + this.offset.y);
		context2D.rotate((Math.PI / 180) * this.rotation);
		context2D.scale(this.scale.x, this.scale.y);

		context2D.globalAlpha = this.alpha;
		context2D.imageSmoothingEnabled = false;
		context2D.strokeStyle = this.strokecolor;

		if(!this.nostroke)
			context2D.stroke(this.path);

		if(this._attributes.fillbackground != '')
		{
			context2D.fillStyle = this._attributes.fillbackground;
			context2D.fill(this.path);
		}

		if(this.shadow != 0)
		{
			context2D.shadowBlur = this.shadow;
			context2D.shadowColor = this.shadowcolor;
		}
		
		if(this._attributes.corner)
			context2D.drawImage(this._image, this._attributes.padding.left, this._attributes.padding.top);
		else
			context2D.drawImage(this._image, (-this._image.width / 2) + this._attributes.padding.left,  (-this._image.height / 2) + this._attributes.padding.top);

		context2D.restore();
	}

	public fontSize(modifier: number, min: number = 12, max: number = 50): void
	{
		let size: number = parseInt(this._attributes.font);

		size += modifier;
		if(size > max)
			size = max;
		if(size < min)
			size = min;

		this._attributes.font = this._attributes.font.replace(/(\d+)px/g, size + 'px');
		this.generate();
	}

	private wrap(maxWidth: number, maxLine: number): Array<string>
	{
		let context2D: CanvasRenderingContext2D = this._canvas.getContext("2d");
		let nLine: number = 0;
		let aOut: Array<string> = [];
		let nCount: number = 0;
		let aLines: Array<string> = this._content.split('\n');

		context2D.save();
		context2D.font = this._attributes.font;

		for(let line of aLines)
		{
			let nLineWidth: number = 0;
			let aWords: Array<string> = line.split(/(?=[ \t])|(?<=[ \t])/g);

			aOut[nLine] = '';

			for(let word of aWords)
			{
				let nWordWidth: number = context2D.measureText(word).width;

				if(word == '\t')
				{
					word = ' '.repeat(this._attributes.tabsize);
					nWordWidth = context2D.measureText(word).width;
				}

				if(nWordWidth >= maxWidth)
				{
					// occur when a word is too long for the current line
					aOut[nLine] += word;
					maxWidth -= context2D.measureText('...').width;
					if(maxWidth < 0)
						maxWidth = 0;

					while(context2D.measureText(aOut[nLine]).width > maxWidth)
						aOut[nLine] = aOut[nLine].slice(0, -1);

					aOut[nLine] += '...';
					context2D.restore();
					return aOut;
				}
				else if(nWordWidth + nLineWidth < maxWidth)
				{
					aOut[nLine] += word;
					nLineWidth += nWordWidth;
				}
				else
				{
					if(++nLine < maxLine)
					{
						if(word != ' ')
						{
							aOut[nLine] = word;
							nLineWidth = nWordWidth;
						}
						else
						{
							aOut[nLine] = '';
							nLineWidth = 0;
						}
					}
					else
					{
						// occur when all lines are filled but these no more room for word
						aOut[nLine - 1] += word;
						maxWidth -= context2D.measureText('...').width;
						if(maxWidth < 0)
							maxWidth = 0;
	
						while(context2D.measureText(aOut[nLine - 1]).width > maxWidth)
							aOut[nLine - 1] = aOut[nLine - 1].slice(0, -1);

						aOut[nLine - 1] += '...';
						context2D.restore();
						return aOut;
					}
				}
			}

			nCount++;
			nLine++;
			if(nLine >= maxLine)
			{
				if(aLines.length > nCount)
				{
					// occur when these no more line when pressing enter
					maxWidth -= context2D.measureText('...').width;
					if(maxWidth < 0)
						maxWidth = 0;

					while(context2D.measureText(aOut[maxLine - 1]).width > maxWidth)
						aOut[maxLine - 1] = aOut[maxLine - 1].slice(0, -1);

					aOut[maxLine - 1] += '...';
				}

				break;
			}
		}
		
		context2D.restore();
		return aOut;
	}

	public boundingbox(text?: string): {width: number, height: number}
	{
		let context2D: CanvasRenderingContext2D = this._canvas.getContext("2d");
		let boundingbox: {width: number, height: number} = {width: 0, height: 0};

		context2D.save();
		context2D.font = this._attributes.font;
		context2D.textAlign = 'left';
		context2D.textBaseline = 'top';

		if(text)
			boundingbox.width = context2D.measureText(text).width;
		else
			boundingbox.width = 0;
		boundingbox.height = context2D.measureText('j').actualBoundingBoxDescent + context2D.measureText('j').actualBoundingBoxAscent;

		context2D.restore();

		return boundingbox;
	}

	public getNewlinesIndex(): Array<number>
	{
		let newlines: Array<number> = [];
		let index: number = this._content.indexOf('\n');

		while(index != -1) 
		{
			newlines.push(index);
			index = this._content.indexOf('\n', index + 1);
		}

		return newlines;
	}



	// Accessors
	// --------------------------------------------------------------------------
	
	get content(): string
	{
		return this._content;
	}
	set content(content: string)
	{
		this._content = content;
	}

	get contentAs(): {splitted: Array<string>, image: HTMLImageElement}
	{
		if(!this._splitted[0])
			this._splitted[0] = '';
			
		return { splitted: this._splitted, image: this._image};
	}

	get font(): string
	{
		return this._attributes.font;
	}
	set font(font: string)
	{
		this._attributes.font = font;
	}

	get padding(): {top?: number, bottom?: number, left?: number, right?: number}
	{
		return this._attributes.padding;
	}
	set padding(padding: {top?: number, bottom?: number, left?: number, right?: number})
	{
		this._attributes.padding = padding;
	}

	get spacing(): number
	{
		return this._attributes.spacing;
	}
	set spacing(spacing: number)
	{
		this._attributes.spacing = spacing;
	}

	get wrapping(): boolean
	{
		return this._attributes.wrapping;
	}
	set wrapping(wrapping: boolean)
	{
		this._attributes.wrapping = wrapping;
	}

	get corner(): boolean
	{
		return this._attributes.corner;
	}
	set middlepoint(corner: boolean)
	{
		this._attributes.corner = corner;
	}

	get autosize(): boolean
	{
		return this._attributes.autosize;
	}
	set autosize(autosize: boolean)
	{
		this._attributes.autosize = autosize;
	}

	get multiline(): boolean
	{
		return this._attributes.multiline;
	}
	set multiline(multiline: boolean)
	{
		this._attributes.multiline = multiline;
	}

	get tabsize(): number
	{
		return this._attributes.tabsize;
	}
	set tabsize(tabsize: number)
	{
		this._attributes.tabsize = tabsize;
	}

	get fillbackground(): string
	{
		return this._attributes.fillbackground;
	}
	set fillbackground(fillbackground: string)
	{
		this._attributes.fillbackground = fillbackground;
	}

	get filter(): IDrawableLabelFilter
	{
		return this._attributes.filter;
	}
	set filter(filter: IDrawableLabelFilter)
	{
		this._attributes.filter = filter;
	}
}
