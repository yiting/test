//  Created by Robin Speijer on 01-05-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKOperation.h"

/// An abstract class for all kinds of NSURLSession based operations.
NS_SWIFT_NAME(URLOperation)
@interface SCKURLOperation : SCKOperation

/// The default Cloud URLSession that's used for executing API requests.
+ (nonnull NSURLSession *)sharedURLSession;

/// The URLSession that's used when creating the real task for this operation. If you have no reason to change it, just leave it to the default.
@property (atomic, nonnull, strong) NSURLSession *session;

@end
