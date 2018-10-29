//  Created by Robin Speijer on 08-05-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKURLOperation.h"

@class SCKAPIURLRequest, SCKObject;
@protocol SCKAPIRequest;

NS_ASSUME_NONNULL_BEGIN
NS_SWIFT_NAME(APIOperation)
@interface SCKAPIOperation : SCKURLOperation

#pragma mark - Request

/**
 Initializes a new operation with an API request to be executed by this operation.

 @param request The API request to be executed. Could either be a Rest API request, or a GraphQL API request.
 @return The new operation.
 */
- (instancetype)initWithRequest:(id<SCKAPIRequest>)request NS_DESIGNATED_INITIALIZER NS_SWIFT_NAME(init(_:));

/// The API request to be executed. Could either be a Rest API request, or a GraphQL API request.
@property (nonatomic, strong, readonly) id<SCKAPIRequest> request;

/// An error that occured while executing the request.
@property (atomic, strong, nullable) NSError *error;

/// Synchronously refresh the request's authentication. Will be called during executed if needed.
- (void)refreshAuthentication;

/**
 Processes a Cloud API response and sets the appropriate attributes of the operation. This method can be overridden to customize its behavior.
 
 @param data The data that comes in from the Cloud server.
 @param response The HTTP URL response from the Cloud server.
 @param error The error that occured while executing the request.
 */
- (void)processData:(nullable NSData *)data response:(nullable NSHTTPURLResponse *)response error:(nullable NSError *)error;

@end

NS_ASSUME_NONNULL_END
