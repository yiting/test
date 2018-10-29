//  Created by Robin Speijer on 31-01-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

/// A protocol that needs to be implemented by all types that can be sent to the server in the request body in order to generate a request signature.
NS_SWIFT_NAME(APISignable)
@protocol SCKAPISignable <NSObject, NSCopying>

/// A string representation of the receiver to be used for the request signature.
@property (nonatomic, readonly) NSString *signableString;

@end
