//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"

@class SCKShareVersion;
@class SCKUser;

/// A Cloud share for a Sketch document.
NS_SWIFT_NAME(Share)
@interface SCKShare : SCKObject

/// The shortID that's used within the public URL to represent this share.
@property (nonatomic, nullable, readonly) NSString *shortID;

/// The URL that the user can visit with the browser to view the share.
@property (nonatomic, nullable, readonly) NSURL *publicURL;

/// Whether the share requires a password to be shown for unauthorized users.
@property (nonatomic, readonly) BOOL isPrivate;

/// The latest share revision.
@property (nonatomic, nullable, readonly) SCKShareVersion *currentVersion;

/// Whether the current user has permissions to update the share.
@property (nonatomic, assign, readonly) BOOL canUpdate;

/// A copy of the receiver, but by changing the canUpdate property to 'NO'.
- (nonnull instancetype)readOnlyCopy;

/// The user that owns this share, usually the one that originally created it.
@property (nonatomic, nullable, readonly) SCKUser *owner;

@end
