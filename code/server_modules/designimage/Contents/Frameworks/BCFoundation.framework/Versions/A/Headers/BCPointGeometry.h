//  Created by Pieter Omvlee on 19/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

#import "BCGeometry.h"

CGFloat BCPointPositionForAxis(CGPoint point, BCAxis axis);
CGPoint BCPointWithPositionForAxis(CGPoint point, CGFloat value, BCAxis axis);

BOOL BCPointsEqualWithMargin(CGPoint p1, CGPoint p2, CGFloat margin);

CGPoint BCPointInvert(CGPoint point);
CGPoint BCPointSubtractPoint(CGPoint point1, CGPoint point2);
CGPoint BCPointAddPoint(CGPoint point1, CGPoint point2);
CGPoint BCPointMultiply(CGPoint point, CGFloat scale);
CGPoint BCPointDivide(CGPoint point, CGFloat div);
CGSize BCOffsetBetweenPoints(CGPoint point1, CGPoint point2);
CGPoint BCPointWithOffset(CGPoint point, CGSize offset);

CGFloat BCDistanceBetweenPoints(CGPoint p1, CGPoint p2);

CGPoint BCPointBetweenPointsAt(CGPoint p1, CGPoint p2, CGFloat position);
CGPoint BCPointBetweenPoints(CGPoint p1, CGPoint p2);

CGPoint BCPointAtDistanceAndSlopeFromPoint(CGFloat distance, CGFloat slope, CGPoint point);

/// @result A point that is aligned with \c p2 along the horizontal, vertical, or a 45º axis. \c p1
/// is used to determine which axis is closest, and pick it for alignment.
CGPoint BCPointAlignStraightAngleToPoint(CGPoint p1, CGPoint p2);

CGPoint BCPointSnapToPointWithMargin(CGPoint me, CGPoint other, CGFloat margin);
CGPoint BCPointSnapToRectWithMargin(CGPoint point, CGRect rect, CGFloat margin);

/** Returns the index of a point inside an array of points that lies closest to the \c targetPoint. If the array is empty the result is NSNotFound */
NSUInteger BCIndexOfPointClosestToPoint(CGPoint *points, NSUInteger count, CGPoint targetPoint);


#pragma mark Unit Coordinates

/// Converts \c p from \c outer coordinate space to unit coordinates.
CGPoint BCPointConvertToUnitCoordinates(CGPoint p, CGRect outer);

/// Converts a \c point expressed in unit coordinate space to the space defined by \c outer.
CGPoint BCPointConvertFromUnitCoordinates(CGPoint point, CGRect outer);
