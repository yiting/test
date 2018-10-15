//
//  SCKAuthenticatedUser.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKUser.h"
#import "SCKAPIAuthentication.h"

@class SCKEnvironment;

/// Notification name to be posted when the currently logged in user did change within a Cloud environment. Changing environments will not trigger such a notification. In the case of a logout, the posting object is nil. In the case of a login, the posting object is the logged in SCKAuthenticatedUser instance. Posted from the main thread, if all login/logout calls are also done from the main thread (which should be).
extern NSNotificationName _Nonnull const SCKAuthenticatedUserDidChangeNotification;

/// Notification name to be posted when user attributes of the currently logged in user has been updated. Posted from the main thread.
extern NSNotificationName _Nonnull const SCKAuthenticatedUserDidUpdateNotification;

/** 
 A user that contains authentication info for authenticating with the Cloud API. An instance of this object can be logged in by calling the login method. From now on, this instance will be stored in the `current` static variable. From now on, every time an authenticated user is parsed with the same objectID, this instance will be replaced by a new version to keep up-to-date.
 */
@interface SCKAuthenticatedUser : SCKUser <SCKAPIAuthentication>

- (nonnull instancetype)initWithObjectID:(nonnull SCKObjectID *)objectID authToken:(nullable NSString *)authToken;

/// The shared user instance that's currently logged in to cloud. This depends on the current Cloud environment. Thread safe.
+ (nullable instancetype)current;

/**
 Logs out the currently logged in user. As a result, the SCKAuthenticatedUser.current property will be erased as well. Should be called from the main thread.

 @param error Error that occured on return.
 @return Whether the logout has been succesfull.
 */
+ (BOOL)logoutWithError:(NSError * _Nullable * _Nullable)error;

/**
 Logs out the currently logged in user. As a result, the SCKAuthenticatedUser.current property will be erased as well. Should be called from the main thread.
 
 @return Whether the logout has been succesfull.
 */
+ (BOOL)logout;

/**
 Logs in the receiving authenticated user. As a result, the SCKAuthenticatedUser.current will be changed to the receiver. Should be called from the main thread.

 @param error Error that occured on return.
 @return Whether the login has been succesfull.
 */
- (BOOL)loginWithError:(NSError * _Nullable * _Nullable)error;

/**
 Logs in the receiving authenticated user. As a result, the SCKAuthenticatedUser.current will be changed to the receiver. Should be called from the main thread.

 @return Whether the login has been succesfull.
 */
- (BOOL)login;

/**
 Logs in the receiving authenticated user to the given environment. If the given environment is not the current environment, the current property doesn't change. Should be called from the main thread.

 @param environment The environment to log in to.
 @param error The error that occured on return.
 @return Whether the login has been succesfull.
 */
- (BOOL)loginToEnvironment:(nonnull SCKEnvironment *)environment error:(NSError * _Nullable * _Nullable)error;

/**
 Logs in the receiving authenticated user to the given environment. If the given environment is not the current environment, the current property doesn't change. Should be called from the main thread.
 
 @param environment The environment to log in to.
 @return Whether the login has been succesfull.
 */
- (BOOL)loginToEnvironment:(nonnull SCKEnvironment *)environment;

@end
