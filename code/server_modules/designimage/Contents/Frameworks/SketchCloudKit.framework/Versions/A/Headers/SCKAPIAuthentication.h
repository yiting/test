//  Created by Robin Speijer on 14-08-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

/// The user default key to store the relative time period before the authentication becomes stale and needs to be refreshed.
extern NSString * _Nonnull const SCKAPIAuthenticationStalenessDefaultsKey;

/**
 An authentication session of a user in Sketch Cloud. It can be used for adding authorization headers to HTTP requests to the Sketch Cloud API. An authentication object could be created by performing a signin request. It can be persisted by setting it the `current` authentication From that point, the session should be persisted into the keychain for later reuse.
 */
NS_SWIFT_NAME(APIAuthentication)
@interface SCKAPIAuthentication : NSObject <NSCopying>

/// The identifier of the user that has been signed in.
@property (nonatomic, copy, nonnull, readonly) NSString *userID;

/// The date at what point this authentication session is not valid anymore. At that point, this authentication cannot be renewed anymore.
@property (nonatomic, strong, nullable, readonly) NSDate *expirationDate;

/// Whether this authentication session is part of the legacy authentication method. This typically means that there's no expiration date, and the HTTP authorization header value is slightly different.
@property (nonatomic, readonly) BOOL isLegacy;

/// Whether this authentication session should still be valid. If not, you should use the Cloud API to refresh it.
@property (nonatomic, readonly) BOOL isValid;

/// The HTTP authorization header value to include to HTTP requests against the Sketch Cloud API.
@property (nonatomic, nonnull, readonly) NSString *httpAuthorizationValue;

/// Checks if the given authentication is a refreshed version of the receiver.
- (BOOL)isRefreshedByAuthentication:(nonnull SCKAPIAuthentication *)authentication;

@end
