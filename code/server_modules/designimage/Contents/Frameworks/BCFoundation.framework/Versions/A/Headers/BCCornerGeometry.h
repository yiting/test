//  Created by Pieter Omvlee on 19/01/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

#import "BCGeometry.h"

typedef NS_ENUM(NSInteger, BCCorner) {
  BCCornerNone        = -1,
  BCCornerTopLeft     = 0,
  BCCornerTopRight    = 1,
  BCCornerBottomLeft  = 2,
  BCCornerBottomRight = 3,
  BCCornerMidTop      = 4,
  BCCornerMidLeft     = 5,
  BCCornerMidRight    = 6,
  BCCornerMidBottom   = 7,
  
  //not counting when enumerating
  BCCornerMid         = 8,
  
  // The min and max values for referring to a corner, including the mid-point.
  BCCornerMinimum     = BCCornerTopLeft,
  BCCornerMaximum     = BCCornerMid,
};

enum {
  BCCornerTopLeftMask     = 1 << BCCornerTopLeft,
  BCCornerTopRightMask    = 1 << BCCornerTopRight,
  BCCornerBottomLeftMask  = 1 << BCCornerBottomLeft,
  BCCornerBottomRightMask = 1 << BCCornerBottomRight,
  BCCornerMidTopMask      = 1 << BCCornerMidTop,
  BCCornerMidLeftMask     = 1 << BCCornerMidLeft,
  BCCornerMidRightMask    = 1 << BCCornerMidRight,
  BCCornerMidBottomMask   = 1 << BCCornerMidBottom
};

#define BCCornerCount 8
#define BCCornerMaskAll    (BCCornerTopLeftMask | BCCornerTopRightMask | BCCornerBottomLeftMask | BCCornerBottomRightMask | BCCornerMidTopMask | BCCornerMidLeftMask | BCCornerMidRightMask | BCCornerMidBottomMask)
#define BCCornerMaskCorner (BCCornerTopLeftMask | BCCornerTopRightMask | BCCornerBottomLeftMask | BCCornerBottomRightMask)
#define BCCornerMaskMid    (BCCornerMidTopMask | BCCornerMidLeftMask | BCCornerMidRightMask | BCCornerMidBottomMask)

typedef void(^BCCornerEnumeratorBlock)(BCCorner corner);
typedef BOOL(^BCCornerEnumeratorPredicate)(BCCorner corner);



void BCCornerEnumerate(BCCornerEnumeratorBlock block);
BCCorner BCCornerByRotating45DegreesCounterClockwise(BCCorner corner);
BCCorner BCCornerByRotatingByDegrees(BCCorner corner, CGFloat degrees);

/// @result The opposite corner to \c corner.
BCCorner BCCornerFlip(BCCorner corner);

BOOL BCCornerSatisfiesMask(BCCorner corner, NSUInteger mask);
BOOL BCCornerIsInMidHorizontal(BCCorner corner);
BOOL BCCornerIsInMidVertical(BCCorner corner);
BCCorner BCCornerFlipByAxis(BCCorner corner, BCAxis axis);
BCEdge BCCornerRectEdgesMask(BCCorner type);
BCCorner BCCornerFirstCornerSatisfyingPredicate(BCCornerEnumeratorPredicate block);
