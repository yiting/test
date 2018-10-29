//  Created by Robin Speijer on 25-06-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKAPIOperation.h"

NS_ASSUME_NONNULL_BEGIN

NS_SWIFT_NAME(RestAPIOperation)
@interface SCKRestAPIOperation : SCKAPIOperation

#pragma mark - Response

/// The objects that have been returned by the API. Those are guarenteed to be of type [self.class objectType]. This will be a single object for the most requests.
@property (atomic, strong, nullable, readonly) NSArray *result;

#pragma mark - Overridable

/**
 Processes a Cloud API response and sets the appropriate attributes of the operation. This method can be overridden to customize its behavior.
 
 @param data The data that comes in from the Cloud server.
 @param response The HTTP URL response from the Cloud server.
 @param error The error that occured while executing the request.
 */
- (void)processData:(nullable NSData *)data response:(nullable NSHTTPURLResponse *)response error:(nullable NSError *)error;

/**
 Directly executes a Cloud API request on the default Cloud URLSession.
 
 @param request The request to execute.
 @param handler The completion handler to be executed when the request has been finished and parsed. The completion handler will always be called on the main queue.
 */
+ (void)executeRequest:(SCKAPIURLRequest *)request completionHandler:(void (^ _Nullable)(NSArray * _Nullable objects, NSError * _Nullable error))handler;

@end

NS_ASSUME_NONNULL_END
