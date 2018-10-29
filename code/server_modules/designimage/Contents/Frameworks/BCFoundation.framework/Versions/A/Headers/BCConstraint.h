//  Created by Sam Deane on 27/07/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

typedef NS_OPTIONS(NSUInteger, BCConstraint) {
  // See https://github.com/BohemianCoding/Sketch/issues/14271
  // Originally a constraint of BCConstraintNone mean nothing was sizeable.
  // However, as 0 is often a default value this, in hindsight, was a bad choice.
  // It's unlikely we'd ever want to constrain everything and since changing this
  // enumeration could potentially lead to other issues it's probably safer just to
  // let 0 act the same way as BCConstraintAllSizeable.
  BCConstraintNone           = 0,
  
  BCConstraintMaxXSizeable   = 1U << 0,
  BCConstraintWidthSizeable  = 1U << 1,
  BCConstraintMinXSizeable   = 1U << 2,
  BCConstraintMaxYSizeable   = 1U << 3,
  BCConstraintHeightSizeable = 1U << 4,
  BCConstraintMinYSizeable   = 1U << 5,
  
  // If it's really desirable to have everything fixed this will do it.
  BCConstraintAllFixed       = 1U << 6,
  
  BCConstraintAllSizeable    =  BCConstraintMinXSizeable | BCConstraintWidthSizeable  | BCConstraintMaxXSizeable |
  BCConstraintMinYSizeable | BCConstraintHeightSizeable | BCConstraintMaxYSizeable
};

/**
 Scales \c rectToScale using constraints based on the scale between \c relativeSizeOriginal and \c relativeSizeNew.
 To avoid divide by zero the passed in \c relativeSizes will be constrained to have a width and height of at least 0.5.
 If all the flexible constraints have gone to zero, fixed constraints will be resized but we ensure that we don't
 go less than 0.5 in this instance.
 @param rectToScale The bounds to be scaled.
 @param relativeSizeOriginal The size of the original container.
 @param relativeSizeNew The size the container is now.
 @return rectToScale scaled to fit the new container size preserving any set constraints. Note that rectToScale
 does not need to be contained within the original container and, where it is not, the returned rect can be
 outside of \c relativeSizeNew.
 */
CGRect BCRectScaledRelativeToSizeWithConstraints( CGRect rectToScale, CGSize relativeSizeOriginal, CGSize relativeSizeNew, BCConstraint constraints );

/**
 Returns the minimum size to which a container with a current size of \c containerSize can be reduced
 based on a constrained inner rect.
 @param containerSize The size of the container for which the minimum size is required.
 @param inner The CGRect to which the constraints apply.
 @param constraints The constrains applied to \c inner.
 @param minSize The smallest \c inner is allowed to become.
 @return The minumum size container can be without breaking the current constraints on inner.
 Depending on the constraints the width and/or height could be zero.
 */
CGSize BCMinumumSizeForRectWithConstraints( CGSize containerSize, CGRect inner, BCConstraint constraints, CGSize minSize );

