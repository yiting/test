//  Created by Robin Speijer on 20/08/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKAPIOperation.h"

NS_ASSUME_NONNULL_BEGIN

typedef void(^SCKOAuthAPIHandler)(SCKAPIAuthentication * _Nullable, NSError * _Nullable);

/// A Cloud API operation that performs a OAuth request, resulting in a new `SCKAPIOperation` instance.
NS_SWIFT_NAME(OAuthAPIOperation)
@interface SCKOAuthAPIOperation : SCKAPIOperation

/// The resulting authentication session from the request.
@property (nonatomic, nullable, readonly) SCKAPIAuthentication *authentication;

/// Creates a new OAuth operation, using the given request. This request could for example be a sign in request with an email/password pair, or a refresh request using an existing authentication session.
- (instancetype)initWithRequest:(SCKOAuthAPIURLRequest *)request NS_SWIFT_NAME(init(_:));

/// Performs an initial sign in attempt using the given e-mail/password pair. The completion handler will be executed on the main thread upon completion. In case of an error, the error parameter will be nonnil and could be part of the SCKErrorDomain or SCKKeychainDomain.
+ (void)signinWithEmail:(NSString *)email password:(NSString *)password handler:(SCKOAuthAPIHandler)handler NS_SWIFT_NAME(signin(email:password:handler:));

/**
 Performs an authentication refresh request of the given authentication session. If the authentication is current, the renewed authentication will overwrite the current one.

 @param authentication The authentication to renew.
 @param handler Completion block to be executed when the execution is done. Called on the main thread.
 */
+ (void)refreshAuthentication:(SCKAPIAuthentication *)authentication handler:(SCKOAuthAPIHandler)handler;

@end

NS_ASSUME_NONNULL_END
