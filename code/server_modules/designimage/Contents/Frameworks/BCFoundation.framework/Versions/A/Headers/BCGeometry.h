//  Created by Pieter Omvlee on 15/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.


// It's a bit ugly but we need to declare a typedef so CF_SWIFT_NAME has something to grip onto, so to speak
typedef CGSize BCSize;


#pragma mark - Axis
typedef NS_OPTIONS(NSUInteger, BCAxis) {
  BCAxisNone = 0,
  BCAxisX    = 1 << 0,
  BCAxisY    = 1 << 1,
  BCAxisBoth = BCAxisX|BCAxisY,
};

/// Convenience to construct a BCAxis, specifying which axes it operates on.
BCAxis BCAxisMake(BOOL x, BOOL y);

/// Swaps axes. This works for the simple case of a single value: BCAxisX => BCAxisY and visa versa
/// But you can also use it a more bitwise fashion, pass in a bitwise combination of BCAxisX and
/// BCAxisY and it will flip the individual axes on or off.
BCAxis BCAxisFlip(BCAxis axis) CF_SWIFT_NAME(getter:BCAxis.flipped(self:));

#pragma mark - Edges
typedef NS_OPTIONS(NSUInteger, BCEdge) {
  BCEdgeLeft   = 1<<0,
  BCEdgeRight  = 1<<1,
  BCEdgeTop    = 1<<2,
  BCEdgeBottom = 1<<3,
  BCEdgeMidX   = 1<<4,
  BCEdgeMidY   = 1<<5,
  
  BCEdgeAll = BCEdgeLeft | BCEdgeRight | BCEdgeTop | BCEdgeBottom | BCEdgeMidX | BCEdgeMidY,
  BCEdgeVertical = BCEdgeLeft | BCEdgeRight | BCEdgeMidX,
  BCEdgeHorizontal = BCEdgeTop | BCEdgeBottom | BCEdgeMidY,
};

typedef struct BCEdgePaddings {
  CGFloat maxYEdge;
  CGFloat minXEdge;
  CGFloat minYEdge;
  CGFloat maxXEdge;
} BCEdgePaddings;

extern const CGFloat BCSafeFloat;
extern const BCEdgePaddings BCEdgePaddingsZero;

BCEdgePaddings BCEdgePaddingsMake(CGFloat maxY, CGFloat minX, CGFloat minY, CGFloat maxX);
BCEdgePaddings BCEdgePaddingsExpand(BCEdgePaddings paddings, CGFloat expandBy);
BCEdgePaddings BCEdgePaddingsAdd(BCEdgePaddings a, BCEdgePaddings b);
BCEdgePaddings BCEdgePaddingsScale(BCEdgePaddings paddings, CGFloat scale);
CGRect BCPaddedRect(CGRect rect, BCEdgePaddings paddings);
BCEdgePaddings BCEdgePaddingsMakeWithRects(CGRect innerRect, CGRect outerRect);

#pragma mark - Logging
void BCLogRect(CGRect rect);
void BCLogSize(CGSize size);
void BCLogPoint(CGPoint point);

#pragma mark - Rounding
CGRect BCRectByRoundingRect(CGRect rect);
CGSize BCSizeByRoundingSize(CGSize size);
CGPoint BCPointByRoundingPoint(CGPoint point);
/// Rounds x and y values using the specified step amount.
CGPoint BCPointByRoundingPointToStep(CGPoint point, CGFloat step);
CGRect BCRectByRoundingRectToStep(CGRect rect, CGFloat step);
CGFloat BCFloatRoundToStep(CGFloat number, CGFloat step);
CGFloat BCFloatRoundWithNegativeFix(CGFloat val);

#pragma mark - Point, Size & Rect Fuzzy Equality
BOOL BCPointEqualToPointWithAccuracy(CGPoint p1, CGPoint p2, CGFloat accuracy);
BOOL BCSizeEqualToSizeWithAccuracy(CGSize s1, CGSize s2, CGFloat accuracy);
BOOL BCRectEqualToRectWithAccuracy(CGRect r1, CGRect r2, CGFloat accuracy);

#pragma mark - Converting
CGPoint BCPointFromSize(CGSize size);
CGSize BCSizeFromPoint(CGPoint point);
CGRect BCRectFromSize(CGSize size);

#pragma mark - Trigonometry
CGPoint BCPointBetweenPoints(CGPoint p1, CGPoint p2);
CGFloat BCSlopeBetweenPoints(CGPoint a, CGPoint b);
CGFloat BCNormalizeRadians(CGFloat radians);

/// Rounds \c slope to the nearest 90º or 45º angle. Arguments and result are in radians.
CGFloat BCSlopeToStraightAngles(CGFloat slope);

CGFloat BCRadiansToDegrees(CGFloat radians);
CGFloat BCDegreesToRadians(CGFloat degrees);
CGFloat BCReversedDegrees(CGFloat degrees);

#pragma mark - Safety
CGPoint BCPointSafe(CGPoint point);
CGRect BCRectSafe(CGRect rect);
CGFloat BCFloatMakeNotInfOrNan(CGFloat value);
/**
 Ensures a value whose _absolute_ value is at least as large as \c absMin. For example, if you
 specify \c absMin as 1, then the result of this function will always be at least 1 if positive, or
 less than -1 if negative.
 @param absMin Pass a value greater than or equal to zero here please! A negative value gives
 undefined behaviour.
 */
CGFloat BCFloatMakeAbsGreaterThanOrEqual(CGFloat value, CGFloat absMin);


#pragma mark Sizes

/// Directly translates vector into a size, including carrying through negative values. Consider
/// \c BCVectorGetSize if you want only positive values.
CG_INLINE CGSize BCSizeFromVector(CGVector vec) {
  return CGSizeMake(vec.dx, vec.dy);
}

/// Multiplies \c width and \c height by \c scale
CGSize BCSizeScale(CGSize s, CGFloat scale);

/// returns the smallest integral size which could contain \c size
CGSize BCSizeIntegral(CGSize size);

/// returns a size normalised to the range 0-1
CGSize BCSizeNormalise(CGSize size);

/**
 Returns YES if one size is smaller or equal to another.
 */

BOOL BCSizeContainsSize(CGSize container, CGSize contained);

/// Returns a union of 2 sizes - in the same way that NSUnionRect would work with 0,0 origins.
CGSize BCUnionSize(CGSize sizeA, CGSize sizeB) CF_SWIFT_NAME(BCSize.union(self:_:));


#pragma mark - Ranges
BOOL BCRangeContainsRange(NSRange outerRange, NSRange innerRange);

#pragma mark - Strings

NSString* BCStringFromPoint(CGPoint point);
NSString* BCStringFromSize(CGSize size);
NSString* BCStringFromRect(CGRect rect);

CGPoint BCPointFromString(NSString* string);
CGSize BCSizeFromString(NSString* string);
CGRect BCRectFromString(NSString* string);

#if !TARGET_OS_IOS

/**
 Returns an NSEdgeInsets with the left right top bottom sides calculated. It is assumed that the child rect falls fully inside the parent;
 the original of the parent is not inclunded because it should not matter
 */
NSEdgeInsets BCEdgeInsetsCalculate(CGRect childRect, CGSize parentSize);


/**
 Subtracts the NSEdgeInsets from the given rect. The edge insets must not be larger than the original rect.
 */
CGRect BCRectInset(CGRect rect, NSEdgeInsets insets);

#endif
