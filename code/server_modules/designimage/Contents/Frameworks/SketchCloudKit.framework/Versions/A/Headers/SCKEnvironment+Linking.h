//
//  SCKEnvironment+Linking.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 07-08-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import <SketchCloudKit/SketchCloudKit.h>

#import "SCKObject.h"
@class SCKShare;

@interface SCKEnvironment (Linking)

/// URL to the user's account settings.
- (nonnull NSURL *)accountSettingsURLForUserID:(nullable SCKObjectID *)userID;

/// URL to the settings for the provided share.
- (nullable NSURL *)settingsURLForShare:(nullable SCKShare *)share;

/// URL to the user's shares overview.
- (nonnull NSURL *)sharesOverviewURLForUserID:(nullable SCKObjectID *)userID;

/// URL to the sign in page. If a callback is enabled, the browser will try to reopen Sketch once the user is logged in. Providing the variant name will help opening the right Sketch build.
- (nonnull NSURL *)signInURLUsingCallback:(BOOL)usingCallback variant:(nullable NSString *)variant;

/// URL to the sign up page. If a callback is enabled, the browser will try to reopen Sketch once the user is signed up. Providing the variant name will help opening the right Sketch build.
- (nonnull NSURL *)signUpURLUsingCallback:(BOOL)usingCallback variant:(nullable NSString *)variant;

@end
