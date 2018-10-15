//
//  Created by Gavin on 02/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

#import "BCJSONEncoder.h"

@interface BCJSONEncoder (BCJSONDataEncoder)

/// Creates a new BCJSONEncoder set up to write to \c data
+ (nonnull BCJSONEncoder*)encoderForWritingToMutableData:(nonnull NSMutableData*)data;

/// Encodes \c root as JSON into an NSData object
/// If the encoding fails the method will return nil with any error returned in \c error.
+ (nullable NSData*)encodeObjectAsData:(nonnull NSObject*)root error:(NSError * __nullable __autoreleasing * __nullable)error;

@end
