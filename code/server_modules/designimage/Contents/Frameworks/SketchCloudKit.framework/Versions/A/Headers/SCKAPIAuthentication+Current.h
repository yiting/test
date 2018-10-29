//  Created by Robin Speijer on 14-08-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKAPIAuthentication.h"

/// Notification to be posted when the current Cloud authentication session could have been changed. This is the case when `setCurrentWithError:` has explicitly been called, but could also be the case when the keychain has been queried. In that case, credentials could have been changed by other applications.
extern NSNotificationName _Nonnull SCKAPIAuthenticationCurrentDidChangeNotification;

@interface SCKAPIAuthentication (Current)

/// Whether the user is currently signed in with a Sketch Cloud account.
@property (nonatomic, class, readonly) BOOL hasCurrent;

/// Whether the receiver is the current default authentication session.
@property (nonatomic, readonly) BOOL isCurrent;

/**
 The current user's cached authentication session.
 @param error An error, possibly with a `SCKKeychainErrorDomain` domain. The status code corresponds to the keychain OSStatus.
 */
+ (nullable SCKAPIAuthentication *)currentAuthenticationWithError:(NSError * _Nullable * _Nullable)error NS_SWIFT_NAME(current());

/**
 Make the receiver the current Cloud authentication session.
 @param error An error, possibly with a `SCKKeychainErrorDomain` domain. The status code corresponds to the keychain OSStatus.
 */
- (BOOL)setCurrentWithError:(NSError * _Nullable * _Nullable)error;

/**
 Make the receiver the current Cloud authentication session, but only if the current authentication session is for the same user.

 @param error An error, possibly with a `SCKKeychainErrorDomain` domain. The status code corresponds to the keychain OSStatus.
 */
- (BOOL)updateCurrentWithError:(NSError * _Nullable * _Nullable)error;

/**
 Signs out the current authentication session.
 @param error An error, possibly with a `SCKKeychainErrorDomain` domain. The status code corresponds to the keychain OSStatus.
 */
+ (BOOL)removeCurrentAuthenticationWithError:(NSError * _Nullable * _Nullable)error NS_SWIFT_NAME(removeCurrent());

/// Removes the current cached authentication from memory. The next time `currentAuthenticationWithError:` is called, the keychain will be queried again.
+ (void)invalidateCurrentCache;

@end
