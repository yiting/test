//
//  Created by Mike on 23/05/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.
//

#import <CoreGraphics/CoreGraphics.h>

/// Like NSRange but using floating values
typedef struct {
  CGFloat location;
  CGFloat length;
} BCFloatRange;

CG_INLINE BCFloatRange BCFloatRangeMake(CGFloat location, CGFloat length) {
  BCFloatRange range;
  range.location = location;
  range.length = length;
  return range;
}

CG_INLINE CGFloat BCFloatRangeMax(BCFloatRange range) {
  return range.location + range.length;
}

/// Just like NSIntersectionRange but for floating point ranges. Zero length indicates no intersection
BCFloatRange BCFloatRangeIntersection(BCFloatRange range1, BCFloatRange range2);
