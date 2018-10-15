//
//  SCKShare.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKObject.h"

@class SCKShareVersion;

/// A Cloud share for a Sketch document.
@interface SCKShare : SCKObject

/// The shortID that's used within the public URL to represent this share.
@property (nonatomic, nullable, readonly) NSString *shortID;

/// The URL that the user can visit with the browser to view the share.
@property (nonatomic, nullable, readonly) NSURL *publicURL;

/// Whether the share requires a password to be shown for unauthorized users.
@property (nonatomic, readonly) BOOL isPrivate;

/// The owner's userID. This is typically the person who uploaded it to Cloud.
@property (nonatomic, nullable, readonly) SCKObjectID *userID;

/// Whether the user is able to leave comments to the share.
@property (nonatomic, readonly) BOOL commentsEnabled;

/// The latest share revision.
@property (nonatomic, nullable, readonly) SCKShareVersion *currentVersion;

@end
