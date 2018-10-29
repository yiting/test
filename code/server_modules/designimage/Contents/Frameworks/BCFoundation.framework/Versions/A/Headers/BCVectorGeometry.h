//
//  Created by Mike on 26/05/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.
//

#import <CoreGraphics/CoreGraphics.h>
#import "BCGeometry.h"  // for BCAxis


// It's a bit ugly but we need to declare a typedef so CF_SWIFT_NAME has something to grip onto, so to speak
typedef CGVector BCVector;


#pragma mark Making Vectors

/// Creates a vector from a to b.
CGVector BCVectorFromPointToPoint(CGPoint a, CGPoint b) CF_SWIFT_NAME(BCVector.init(from:to:));

// Couple of conveniences to make horizontal or vertical vectors
CGVector BCVectorMakeHorizontal(CGFloat dx) CF_SWIFT_NAME(BCVector.init(horizontal:));
CGVector BCVectorMakeVertical(CGFloat dy) CF_SWIFT_NAME(BCVector.init(vertical:));

/// Makes a vector of `length`, along the X or Y axis
CGVector BCVectorAlongAxis(BCAxis axis, CGFloat length) CF_SWIFT_NAME(BCVector.init(along:length:));


#pragma mark Querying Vectors

// A pair of simple convenience tests
static BOOL BCVectorIsHorizontal(CGVector vector) CF_SWIFT_NAME(getter:BCVector.isHorizontal(self:));
static BOOL BCVectorIsVertical(CGVector vector) CF_SWIFT_NAME(getter:BCVector.isVertical(self:));

CG_INLINE BOOL BCVectorIsHorizontal(CGVector vector) {
  return vector.dy == 0;
}
CG_INLINE BOOL BCVectorIsVertical(CGVector vector) {
  return vector.dx == 0;
}

/// Calculates the magnitude (length) of a vector. Note that this involves a square root operation
/// so is a bit slow, and you're often better off calculating magnitude^2 yourself and working with
/// that.
CGFloat BCVectorGetMagnitude(CGVector v) CF_SWIFT_NAME(getter:BCVector.magnitude(self:));

/// The magnitude of the vector expressed as a CGSize, i.e. the dx and dy values of the vector, but
/// standardized to be only positive values.
CGSize BCVectorGetSize(CGVector vector) CF_SWIFT_NAME(getter:BCVector.size(self:));


#pragma mark Operating Upon Vectors

/// Dead simple, inverts all components of the vector.
CG_INLINE CGVector BCVectorReverse(CGVector v) {
  return CGVectorMake(-v.dx, -v.dy);
}

/// Adds together two vectors.
CG_INLINE CGVector BCVectorAdd(CGVector v1, CGVector v2) {
  return CGVectorMake(v1.dx + v2.dx, v1.dy + v2.dy);
}

/// Calculates the dot product of two vectors.
static CGFloat BCVectorDotProduct(CGVector v1, CGVector v2) CF_SWIFT_NAME(BCVector.dotProduct(_:_:));
CG_INLINE CGFloat BCVectorDotProduct(CGVector v1, CGVector v2) {
  return v1.dx * v2.dx + v1.dy * v2.dy;
}

/// Convenience to tell you if two vectors are perpendicular. Perpendicular vectors have a dot
/// product of 0. We compare it using \c margin so small errors due to floating point accuracy or
/// rotation are accounted for.
BOOL BCVectorIsPerpendicular(CGVector v1, CGVector v2, CGFloat margin) CF_SWIFT_NAME(BCVector.isPerpendicular(self:to:margin:));

/// Returns the vector resulting from a transformation of an existing vector.
static CGVector BCVectorApplyAffineTransform(CGVector vector, CGAffineTransform t) CF_SWIFT_NAME(BCVector.applying(self:_:));
CG_INLINE CGVector BCVectorApplyAffineTransform(CGVector vector, CGAffineTransform t) {
  CGVector v;
  v.dx = (t.a * vector.dx + t.c * vector.dy);
  v.dy = (t.b * vector.dx + t.d * vector.dy);
  return v;
}


#pragma mark Manipulating Points Using Vectors

/// Translates the point, \c p by the vector, \c v.
CGPoint BCPointAddVector(CGPoint p, CGVector v);

/// As above, but subtracts the vector instead of adding it. Equivalent to reversing \c v and then
/// adding that to the point.
CGPoint BCPointSubtractVector(CGPoint p, CGVector v);


#pragma mark Wrapping in NSValue

// Annoyingly these APIs exist on iOS but not Mac
#if !TARGET_OS_IOS

@interface NSValue (BCVectorGeometry)

+ (instancetype)valueWithCGVector:(CGVector)vector;

@property (readonly) CGVector CGVectorValue;

@end

#endif
