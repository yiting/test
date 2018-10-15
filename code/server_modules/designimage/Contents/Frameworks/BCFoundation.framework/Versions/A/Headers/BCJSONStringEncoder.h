//
//  Created by Gavin on 02/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.
//

#import "BCJSONEncoder.h"

@interface BCJSONEncoder (BCJSONStringEncoder)

/// Encodes \c root as JSON into an NSString object
/// If the encoding fails the method will return nil with any error returned in \c error.
+ (nullable NSString*)encodeObjectAsString:(nonnull NSObject*)root error:(NSError * __nullable __autoreleasing * __nullable)error;

@end

