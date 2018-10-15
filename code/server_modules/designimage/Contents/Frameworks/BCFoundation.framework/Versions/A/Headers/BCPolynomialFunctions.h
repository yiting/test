//
//  Created by Johnnie Walker on 20/04/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.
//

// Finds the roots (where the function crosses the x-axis)
// of a polynomial in the form ax³ + bx² + cx + d = 0
// Any of the parameters may be zero.
// Returns a set of NSNumbers containing one or more real roots (complex roots are ignored)
NSSet <NSNumber *> * BCPolynomialFindRoots(CGFloat a, CGFloat b, CGFloat c, CGFloat d);
