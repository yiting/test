//  Created by Gavin on 02/06/2016.
//  Copyright © 2016 Bohemian Coding. All rights reserved.

#import "BCJSONEncoder.h"

@interface BCJSONEncoder (BCJSONFileEncoder)

/// Creates a new BCJSONEncoder set up to write to \c file
+ (nonnull BCJSONEncoder*)encoderForWritingToFile:(nonnull NSFileHandle*)file;

/// Encodes \c root as JSON into the file \c file
/// If the encoding fails the method will return NO with any error returned in \c error.
+ (BOOL)encodeObject:(nonnull NSObject*)root toFile:(nonnull NSFileHandle*)file error:(NSError * __nullable __autoreleasing * __nullable)error;

/// Creates a new BCJSONEncoder set up to write to \c url
+ (nonnull BCJSONEncoder*)encoderForWritingToURL:(nonnull NSURL*)url;

/// Encodes \c root as JSON into the file \c file
/// If the encoding fails the method will return NO with any error returned in \c error.
+ (BOOL)encodeObject:(nonnull NSObject*)root toURL:(nonnull NSURL*)url error:(NSError * __nullable __autoreleasing * __nullable)error;

@end

