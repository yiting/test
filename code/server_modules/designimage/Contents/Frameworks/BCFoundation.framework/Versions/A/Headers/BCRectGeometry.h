//  Created by Pieter Omvlee on 19/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

#import "BCGeometry.h"
#import "BCCornerGeometry.h"
#import "BCFloatRange.h"

/// Comparisons take the first direction as preference followed by the
/// second direction if the first is ambiguous.
/// For example BCRectComparisonLeftToRightTopToBottom will compare
/// going from left to right by preference and then top to bottom - i.e.
/// in reading order.
typedef NS_ENUM(NSInteger, BCRectComparison) {
  BCRectComparisonLeftToRightTopToBottom = 0,
  BCRectComparisonRightToLeftTopToBottom,
  BCRectComparisonTopToBottomLeftToRight,
  BCRectComparisonTopToBottomRightToLeft,
  BCRectComparisonLeftToRightBottomToTop,
  BCRectComparisonRightToLeftBottomToTop,
  BCRectComparisonBottomToTopLeftToRight,
  BCRectComparisonBottomToTopRightToLeft,
  BCRectComparisonDefault                 = BCRectComparisonLeftToRightTopToBottom
};


// It's a bit ugly but we need to declare a typedef so CF_SWIFT_NAME has something to grip onto, so to speak
typedef CGRect _BCRect;


CGRect BCRectWithSizeProportionallyInRect(CGSize size, CGRect rect);
CGRect BCRectWithSizeCenteredInRect(CGSize size, CGRect outer);
CGRect BCRectWithOriginAndSize(CGPoint point, CGSize size);
CGRect BCRectWithSizeProportionallyAroundRect(CGSize size, CGRect rect);
CGRect BCRectWithMarginAroundPoint(CGFloat margin, CGPoint point) CF_SWIFT_NAME(_BCRect.init(margin:around:));

CGRect BCRectWithSizeCenteredAtPoint(CGSize size, CGPoint point) CF_SWIFT_NAME(_BCRect.init(size:center:));
CGRect BCRectFromCoordinateSpaceRectToRect(CGRect rect, CGRect fromRect, CGRect toRect);

CGRect BCRectExpand(CGRect rect, CGFloat margin);
CGRect BCRectRelative(CGRect rect, CGRect outer);
CGRect BCRectAbsolute(CGRect rect, CGRect outer);
CGRect BCRectScale(CGRect r, CGFloat scale);

/// If needed, expands \c rect about its center to give \c minSize.
CGRect BCRectWithMinSize(CGRect rect, CGSize minSize);

CGRect BCRectFromPoints(CGPoint point1, CGPoint point2);
CGRect BCUnionRectSafe(CGRect r1, CGRect r2);

BOOL BCRectFuzzyEqualToRect(CGRect rect1, CGRect rect2);
BOOL BCRectIsZero(CGRect rect);

CGFloat BCRectMinForAxis(CGRect rect, BCAxis axis);
CGFloat BCRectMaxForAxis(CGRect rect, BCAxis axis);
CGFloat BCRectSizeForAxis(CGRect rect, BCAxis axis);
/// A range describing the minimum and size of the rect on one of its axes. e.g. left and width.
BCFloatRange BCRectRangeForAxis(CGRect rect, BCAxis axis);

CGRect BCRectWithSizeForAxis(CGRect rect, CGFloat value, BCAxis axis);
CGRect BCRectWithMinForAxis(CGRect rect, CGFloat value, BCAxis axis);
CGRect BCRectWithMaxForAxis(CGRect rect, CGFloat value, BCAxis axis);

/**
 Returns a rect where the width or height is set to the value provided.
 If a non-0 proportions value is provided, then the other dimension will be scaled up by it.
 The proportions are defined as width/height
 */
CGRect BCRectWithWidthRespectingProportions(CGRect rect, CGFloat width, CGFloat proportions);
CGRect BCRectWithHeightRespectingProportions(CGRect rect, CGFloat height, CGFloat proportions);

CGPoint BCRectGetMid(CGRect rect) CF_SWIFT_NAME(getter:_BCRect.center(self:));
CGRect BCRectWithMid(CGRect rect, CGPoint point);

CGRect BCRectWithMidX(CGRect rect, CGFloat midX);
CGRect BCRectWithMidY(CGRect rect, CGFloat midY);

CGRect BCRectResizeMinXTo(CGRect rect, CGFloat minX);
CGRect BCRectResizeMaxXTo(CGRect rect, CGFloat maxX);
CGRect BCRectResizeMinYTo(CGRect rect, CGFloat minY);
CGRect BCRectResizeMaxYTo(CGRect rect, CGFloat maxY);
CGRect BCRectResizeByPuttingCorner(CGRect rect, BCCorner corner, CGPoint point);

/**
 @result The coordinates of \c corner within the rectangle \c rect.
 */
CGPoint BCRectPointForCorner(CGRect rect, BCCorner corner);
BCCorner BCRectClosestCornerForPoint(CGRect rect, CGPoint point, CGFloat margin, NSUInteger cornerMask);
CGSize BCRectDistanceFromCornerToMid(CGRect rect, BCCorner corner);

/// Like `CGRectIntersectsRect()` but only tests the specified `axis`. Useful for snapping to know
/// if two layers overlap on a particular axis.
BOOL BCRectIntersectsRectOnAxis(CGRect rect1, CGRect rect2, BCAxis axis) CF_SWIFT_NAME(_BCRect.intersects(self:_:onAxis:));

/// Compares the min edges of the rectangles, according to `axis`.
NSComparisonResult BCRectCompare(CGRect rect1, CGRect rect2, BCAxis axis);
/**
 Compare two rectangles spatially in a rough 'reading order'.
 The \c options parameter is used to specify the order in which the rectangles
 should be compared. E.g. specifing BCRectComparisonLeftToRightTopToBottom will
 compare the rectangles in the order you'd expect to read them, while specifing
 BCRectComparisonTopToBottomLeftToRight would compare them in Chineese reading
 order.
 */
NSComparisonResult BCRectFuzzyCompareWithOptions( CGRect rect1, CGRect rect2, BCRectComparison options );

CGFloat BCRectValueForKey(CGRect rect, NSString *key);
CGRect BCRectWithSizeOnAxisAspectRatio(CGRect rect, CGFloat size, BCAxis axis, CGFloat aspectRatio);

/**
 Creates a rectangle of size \c size, positioned so that \c corner is placed at \c point. Passsing
 a negative width or height is supported, which extends the rectangle from \c point in the opposite
 direction to normal.
 */
CGRect BCRectWithCornerAtPoint(BCCorner corner, CGPoint point, CGSize size);

CGRect BCRectByEnsuringMidIsContainedInRect(CGRect rect, CGRect outerRect);

/**
 Returns a rect by basically moving innerRect into the outerRect if necessary.
 Conversely, the output rect will be identical to the innerRect if CGRectContainsRect(outerRect, innerRect) is true
 If the innerRect is not inside the outerRect, it'll shift the relevant min or max axis until it does fit
 This method asserts that the innerRect is smaller in both width and height than outerRect. If that is not the case it would otherwise make the innerRect stick out on some sizes in unpredictable ways
 */
CGRect BCRectMoveIntoRect(CGRect innerRect, CGRect outerRect);
