//  Created by Kevin Meaney on 16/02/2017.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Key for the dictionary returned by \c downloadTaskCurrentStateWithIdentifier: whose value is of type NSNumber(int64_t).
extern NSString *BCDownloadManagerNumberOfBytesExpected;

/// Key for the dictionary returned by \c downloadTaskCurrentStateWithIdentifier: whose value is of type NSNumber(int64_t).
extern NSString *BCDownloadManagerNumberOfBytesDownloaded;

/// Key for the dictionary returned by \c downloadTaskCurrentStateWithIdentifier: whose value is of type NSNumber(NSURLSessionTaskState).
extern NSString *BCDownloadManagerDownloadTaskState;

@protocol BCDownloadManagerDelegate;

/**
 A simple download manager.
 
 Initialized with a session configuration. If you initialize the download manager with a background download session configuration
 you will not need to send resume messages to each download task to start the download, but with any other session configuration
 you will need to send a resume message to each download task.
 */
@interface BCDownloadManager <NSURLSessionDelegate> : NSObject

/// The plugin manager identifier.
@property (nonatomic, copy, readonly) NSString *identifier;

/// Has the download manager been invalidated?
@property (nonatomic, readonly) BOOL hasBeenInvalidated;

/// Can the download manager accept new download tasks?
@property (nonatomic, readonly) BOOL canAcceptNewDownloadTasks;

/// Number of processing download tasks.
@property (nonatomic, readonly) NSInteger numberOfUnfinishedDownloadTasks;

/// Identifiers for all download tasks.
@property (nonatomic, readonly) NSArray <NSString*> *allTasksIdentifiers;

/**
 Initialize a download manager with a default, ephemeral, or a background session configuration.
 @param sessionConfiguration Will be one of default, ephemeral or background tasks.
 @param delegate Not needed if all download tasks added to the download manager take a completion handler.
 @param completionHandler Called if the configuration is a background download or if finishTasksAndInvalidate is called when all tasks have finished.
 */

- (instancetype)initWithSessionConfiguration:(NSURLSessionConfiguration *)sessionConfiguration
                                    delegate:(nullable id<BCDownloadManagerDelegate>)delegate
                           completionHandler:(nullable void (^)(void))completionHandler;

/// Add a download task for the download URL. Returns a unique identifier for this download manager. You should implement the delegate methods if creating download tasks with this method.
- (nullable NSString *)addDownloadTaskWithDownloadRequestURL:(NSURL *)downloadRequestURL;

/// Add a download task for a NSURLRequest object. Returns a unique identifier for this download manager. You should implement the delegate methods if creating download tasks with this method.
- (nullable NSString *)addDownloadTaskWithDownloadRequest:(NSURLRequest *)downloadRequest;

/// Add a download task for a NSURLRequest object. Delegate methods except sessionBecameInvalidWithError are ignored. The completion handler will be called on error or when download is finished.
- (nullable NSString *)addDownloadTaskWithDownloadRequest:(NSURLRequest *)request
                                        completionHandler:(void (^)(NSURL * _Nullable location, NSURLResponse * _Nullable response, NSError * _Nullable error))completionHandler;

/// Remove any download task added to the manager with identifier.
- (BOOL)removeDownloadTaskWithIdentifier:(NSString *)identifier;

/// Resume download task with identifier. To start a download you need to call this method after addDownloadTaskWithIdentifier:downloadRequestURL.
- (void)resumeDownloadTaskWithIdentifier:(NSString *)identifier;

/// Suspend download task with identifier. To restart a download you need to call resumeDownloadTaskWithIdentifier:.
- (void)suspendDownloadTaskWithIdentifier:(NSString *)identifier;

/// Cancel all tasks. The download session will become invalid.
- (void)cancelAllTasksAndInvalidate;

/// Allow all current tasks to finish. New tasks will not able to be added. If completion handler is nil, it will be called when all tasks done.
- (void)finishTasksAndInvalidate;

/// Get the state of the download task with identifier. Returns a dictionary with keys BCDownloadManagerNumberOfBytesExpected, BCDownloadManagerNumberOfBytesDownloaded, BCDownloadManagerDownloadTaskState.
- (nullable NSDictionary <NSString *, NSNumber *> *)downloadTaskCurrentStateWithIdentifier:(NSString *)identifier;

/// Cancel a download task with identifier.
- (void)cancelTaskWithIdentifier:(NSString *)identifier;

@end

#pragma mark BCDownloadManagerDelegate

@protocol BCDownloadManagerDelegate <NSObject>

/// All protocol methods are optional for the case where we use the blocks approach.
@optional

/// The status of one of the downloads has changed.
- (void)downloadManager:(BCDownloadManager *)downloadManager downloadTaskHasUpdatedForIdentifier:(NSString *)identifier downloadedSoFar:(NSUInteger)downloadedSoFar withDownloadSize:(NSUInteger)downloadSize;

/// The file in \c downloadedURL in its implementation of this delegate method should be moved or copied from the downloadedURL in this method.
- (void)downloadManager:(BCDownloadManager *)downloadManager downloadTaskFinishedForIdentifier:(NSString *)identifier downloadedURL:(NSURL *)downloadedURL httpStatusCode:(NSInteger)statusCode;

/// Delegate method called for dealing with download errors.
- (void)downloadManager:(BCDownloadManager *)downloadManager downloadTaskWithIdentifier:(NSString *)identifier failedWithError:(NSError *)error;

/// Delegate method called when the download session has become invalid. Typically as a result of calling finishTasksAndInvalidate in which case error will be equal to nil.
- (void)downloadManager:(BCDownloadManager *)downloadManager sessionBecameInvalidWithError:(nullable NSError *)error;

@end

NS_ASSUME_NONNULL_END
