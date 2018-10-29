//  Created by Aurimas Gasiulis on 15/01/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

extern void BCDrawCustomCheckerboardPatternInRect(NSRect rect, NSUInteger squareSize, CGContextRef context);
extern void BCDrawCustomCheckerboardPatternInRectWithAppearance(NSRect rect, NSUInteger squareSize, CGContextRef context, BOOL dark);
extern void BCDrawCheckerboardPatternInRect(NSRect rect, CGContextRef context);

/**
 Draws a regular pattern of squares over the top of the background with width and height equal to squareSize.
 
 Assumes the background has already been drawn and context properties like the clip, fill color, 
 and alpha have been applied to the context.
 */
extern void BCDrawCustomCheckerboardPatternInRectWithSize(NSRect rect, NSUInteger squareSize, CGContextRef context);
