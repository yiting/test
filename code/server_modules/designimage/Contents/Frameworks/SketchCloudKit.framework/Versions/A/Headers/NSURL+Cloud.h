//  Created by Robin Speijer on 03-03-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

#if TARGET_OS_OSX
#import <Cocoa/Cocoa.h>
#endif

#import "SCKAPIAuthentication.h"

@class SCKArtboard, SCKPage, SCKAPIEnvironment;

/// Helpers to identify Sketch Cloud URLs and their components.
@interface NSURL (Cloud)

/// Checks the URL's components if it is a valid Cloud share.
@property (nonatomic, readonly) BOOL isCloudShare;

/// Constructs a Cloud Share URL based on the Cloud environment and the share's shortID.
+ (nonnull NSURL *)cloudShareURLWithShortID:(nonnull NSString *)shortID environment:(nullable SCKAPIEnvironment *)environment;

/// The URL of only the cloud share itself, if the receiver is a Cloud share. This might come in handy if the receiver contains additional path components like a page and artboard slug.
@property (nonatomic, nullable, readonly) NSURL *cloudShareURL NS_SWIFT_NAME(cloudShareURL);

/// The Cloud share's shortID, if the receiver is a Cloud share.
@property (nonatomic, nullable, readonly) NSString *cloudShareShortID;

/// The Cloud share's page slug, if the receiver is a Cloud share deeplink and contains a reference to a page.
@property (nonatomic, nullable, readonly) NSString *cloudPageSlug;

/// The Cloud share's artboard slug, if the receiver is a Cloud share deeplink and contains a reference to a artboard.
@property (nonatomic, nullable, readonly) NSString *cloudArtboardSlug;

/// If the URL points to a Cloud API endpoint, this will return the Cloud API name.
@property (nonatomic, nullable, readonly) NSString *cloudAPIName;

/// If the URL points to a Cloud API endpoint, this will return the referenced environement.
@property (nonatomic, nullable, readonly) SCKAPIEnvironment *cloudAPIEnvironment;

/**
 Constructs a URL by appending Cloud deeplink components to a given artboard inside the document. To create a valid Cloud URL, the following conditions must be met:
 - The receiver must be a valid non-deeplink Cloud URL to a share. If not, this method returns nil.
 - The artboard must have a page as parent. If not, this method returns nil.
 - The document of the artboard must be the same document that is contained by the share. This is not checked.

 @param artboard The artboard to deeplink to.
 @return A newly constructed URL, if all information is correct.
 */
- (nullable NSURL *)appendingCloudDeeplinkComponentsToArtboard:(nullable SCKArtboard *)artboard;

/**
 Constructs a URL by appending Cloud deeplink components to a given artboard, inside its page. To create a valid Cloud URL, the following conditions must be met:
 - The receiver must be a valid non-deeplink Cloud URL to a share. If not, this method returns nil.
 - The artboard must have a page as parent. If not, this method returns nil.
 - The document of the artboard must be the same document that is contained by the share. This is not checked.
 
 @param artboard The artboard to deeplink to.
 @return A newly constructed URL, if all information is correct.
 */
- (nullable NSURL *)appendingCloudDeeplinkComponentsInPageToArtboard:(nullable SCKArtboard *)artboard;

/**
 Adds the authentication to the Cloud URL, so that the frontend could use that to sign in the user, if it was not signed in yet.

 @param authentication The authentication to provide to the frontend to sign in.
 @return The url including the authentication in the query items. If no token could be added for some reason, the same URL would just be returned.
 */
- (nonnull NSURL *)appendingCloudAuthentication:(nullable SCKAPIAuthentication *)authentication;

@end

#if TARGET_OS_OSX
@interface NSWorkspace (Cloud)

/**
 Open the given URL in the default browser, after adding the current user's authentication to maintain the Cloud sign in session in the browser.

 @param url The URL to add authentication to and opening it.
 */
- (void)openCloudURLByAuthenticating:(nonnull NSURL *)url;

@end
#endif
