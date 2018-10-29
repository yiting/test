//  Created by Pieter Omvlee on 09/04/2015.
//  Copyright (c) 2015 Bohemian Coding. All rights reserved.

BOOL BCFloatEqualWithMargin(CGFloat a, CGFloat b, CGFloat margin);
BOOL BCFloatEqual(CGFloat a, CGFloat b);

/// Returns YES if \p a is greater than \p b by \p margin, otherwise NO
BOOL BCFloatGreaterThanWithMargin(CGFloat a, CGFloat b, CGFloat margin);
/// Returns YES if \p a is less than \p b by \p margin, otherwise NO
BOOL BCFloatLessThanWithMargin(CGFloat a, CGFloat b, CGFloat margin);

/**
 Returns a float rounded clamped to a given range as defined by \code min and \code max. In other words; the returned value is guaranteed to be no smaller than min and no bigger than max
 We assert that min < max
 */
CGFloat BCFloatClamp(CGFloat value, CGFloat min, CGFloat max);

/**
 Returns a float clamped to a given range as defined by \code min and \code max. If min > max this method returns the original value.
 Otherwise the returned value is no smaller than min and no bigger than max.
 No assertions.
 
 This function is used where the UI is being setup and view sizes haven't completely been set yet allowing min > max.
 */
CGFloat BCFloatClampQuiet(CGFloat value, CGFloat min, CGFloat max);

/** A floating point version of the % operation.
 Note that fmod and friends exist in the standard C library but they don't seem to handle negative numbers at all,
 instead they round all negatives to 0
 */
CGFloat BCFloatMod(CGFloat value, CGFloat max);
