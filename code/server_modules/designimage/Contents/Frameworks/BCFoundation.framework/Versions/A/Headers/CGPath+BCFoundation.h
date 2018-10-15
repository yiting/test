//  Created by Sam Deane on 29/08/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

/*
 Calls on to CGPathCreateWithRoundedRect, ensuring that the corner values are legal.
 Corner values larger than half the rectangle’s height/width are clamped to half the height/width.
 After clamping, if either one of the corner parameters contains the value 0.0, the returned path is a plain rectangle without rounded corners.
 */

CF_ASSUME_NONNULL_BEGIN

extern CGPathRef CGPathCreateWithRoundedRectSafeCorners(CGRect rect, CGFloat cornerWidth, CGFloat cornerHeight, const CGAffineTransform * __nullable transform) CF_RETURNS_RETAINED;

CF_ASSUME_NONNULL_END
