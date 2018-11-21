//  Created by Robin Speijer on 18-07-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKOperation.h"

@class SCKShareAPIURLRequest;
@class SCKShareUploadOperation;
@class SCKShare;

/**
 A data source that provides all required data for uploading a Cloud Share appropriately.
 */
NS_SWIFT_NAME(ShareUploadDataSource)
@protocol SCKShareUploadDataSource <NSObject>

/**
 Request for the local fileURL for the item that needs to be uploaded with the given hash.

 @param operation The upload operation that needs the fileURL
 @param hash The file hash of the file to be uploaded
 @return A valid fileURL, or nil if some rare error has occured and the file could not be uploaded anymore.
 */
- (nullable NSURL *)shareUploadOperation:(nonnull SCKShareUploadOperation *)operation fileURLForItemWithHash:(nonnull NSString *)hash;

/**
 Notifies the datasource that the operation has just created a new Cloud share, and all required resources are about to be uploaded. This is the moment to assign the new Cloud share to the document.

 @param operation The operation that's currently uploading the document to Cloud.
 @param share The newly created Cloud share.
 */
- (void)shareUploadOperation:(nonnull SCKShareUploadOperation *)operation willStartUploadingShare:(nonnull SCKShare *)share;

/**
 Receiver should export the document to disk and return a URL using the provided block.
 The document should include a reference to the new Cloud share.
 @param operation The upload operation that needs the document.
 @param handler The completion handler to call with the export result.
 */
- (void)shareUploadOperation:(nonnull SCKShareUploadOperation *)operation exportDocumentWithHandler:(void (^ _Nullable)(NSURL * _Nullable))handler;

@end

NS_ASSUME_NONNULL_BEGIN

/**
 An operation that uploads a Cloud share to the Sketch Cloud API. It handles the initial manifest upload, as well as all the resources that are needed to upload a valid share.
 */
NS_SWIFT_NAME(ShareUploadOperation)
@interface SCKShareUploadOperation : SCKAPIOperation <NSProgressReporting>

/**
 Initializes a new share upload operation.

 @param request The share upload request, created by `-[SCKShareAPIURLRequest shareCreationRequestWithManifest:]` or `-[SCKShareAPIURLRequest shareUpdateRequestWithManifest: existingShare:]`.
 @return The newly created share upload operation.
 */
- (instancetype)initWithRequest:(SCKShareAPIURLRequest *)request;

/// A data source that provides all required data for uploading a Cloud Share appropriately. The operation keeps a strong reference to it, and nillifies it after the operation has finished.
@property (nonatomic, nullable, strong) id<SCKShareUploadDataSource> dataSource;

/// The overall upload progress.
@property (nonatomic, strong, readonly) NSProgress *progress;

/// The resulting share that is uploaded to the API.
@property (nonatomic, strong, nullable, readonly) SCKShare *share;

/// All errors that occured while uploading the Cloud share. Existing errors don't mean that the share has not been uploaded. It might also be the case that some individual files or the document could not be uploaded. If the share property is non-nil, the user can visit the uploaded share on web.
@property (nonatomic, strong, nullable, readonly) NSArray<NSError *> *errors;

@end

NS_ASSUME_NONNULL_END
