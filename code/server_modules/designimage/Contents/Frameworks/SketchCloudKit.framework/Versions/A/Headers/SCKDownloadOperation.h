//  Created by Robin Speijer on 01-05-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKURLOperation.h"

typedef void(^SCKDownloadOperationHandler)(NSURL *location, NSError *error) NS_SWIFT_NAME(DownloadOperationHandler);

/**
 A download operation that maintains a download progress. Eventually, we would also be able to implement pauseable/resumeable downloads using this class.
 
 Note that this class requires the default NSURLSession property on this subclass to be used. Changing the session property might result in inconsistent states.
 */
NS_SWIFT_NAME(DownloadOperation)
@interface SCKDownloadOperation : SCKURLOperation <NSURLSessionDownloadDelegate>

#pragma mark - Setup

/// Initializes a new download operation, that will download the given request.
- (instancetype)initWithRequest:(NSURLRequest *)request;

/// Convenience method for creating a new download operation, while also instantly starting the download.
+ (instancetype)operationByRequesting:(NSURLRequest *)request completionHandler:(SCKDownloadOperationHandler)block;

/// The download request that will be executed.
@property (nonatomic, strong, readonly) NSURLRequest *request;

/**
 When a download completes, this completion block will be called synchronously, even before the operation finishes. This gives you the opportunity to move the downloaded file, before it gets deleted at the end of the operation execution.
 */
@property (nonatomic, copy) SCKDownloadOperationHandler downloadCompletionBlock;

#pragma mark - Result

/// KVO-observeable progress of the download. Will be erased once the download completes. Will only be mutated from the main thread.
@property (nonatomic, strong, readonly) NSProgress *progress;

/// An error that might have occured while downloading the file.
@property (nonatomic, strong, readonly) NSError *error;

@end
