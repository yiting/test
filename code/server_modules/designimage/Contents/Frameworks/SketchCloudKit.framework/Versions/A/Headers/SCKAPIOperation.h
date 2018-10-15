//
//  SCKAPIOperation.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 08-05-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKOperation.h"

@class SCKAPIRequest, SCKObject;

NS_ASSUME_NONNULL_BEGIN

@interface SCKAPIOperation : SCKOperation

#pragma mark - Request

/// The default Cloud URLSession that's used for executing API requests.
+ (NSURLSession *)sharedURLSession;

/**
 Initializes a new operation with an API request to be executed by this operation.

 @param request The API request to be executed.
 @return The new operation.
 */
- (instancetype)initWithRequest:(SCKAPIRequest *)request;

/// The API request to be executed. This can be set during execution.
@property (nonatomic, strong, readonly) SCKAPIRequest *request;

/// The URLSession to use when executing URL requests. By default, this is a dedicated URLSession. When the operation starts executing, the data task will be created using this session.
@property (atomic, strong) NSURLSession *session;

#pragma mark - Response

/// An error that occured while executing the request.
@property (atomic, strong, nullable, readonly) NSError *error;

/// The objects that have been returned by the API. Those are guarenteed to be of type [self.class objectType]. This will be a single object for the most requests.
@property (atomic, strong, nullable, readonly) NSArray<SCKObject *> *result;

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
+ (void)executeRequest:(SCKAPIRequest *)request completionHandler:(void (^ _Nullable)(NSArray<SCKObject *>  * _Nullable objects, NSError * _Nullable error))handler;

@end

NS_ASSUME_NONNULL_END
