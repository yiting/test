//  Created by Robin Speijer on 26-04-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

#import "SCKAPIURLRequest.h"

NS_ASSUME_NONNULL_BEGIN

/// A Cloud auth related API request. Use a class method to create a specific request.
NS_SWIFT_NAME(AuthAPIURLRequest)
@interface SCKAuthAPIURLRequest : SCKAPIURLRequest

/// A login request with an access token. Such a token is like a "challenge" to get authenticated. The request will return an APIAuthentication object. The request will return an APIAuthentication object (first) and the current user that has been signed in (last). They are not guaranteed to be included, so a class check is required.
+ (instancetype)loginRequestWithAccessToken:(NSString *)accessToken;

/// A login request using an old-fashioned e-mail and raw password. The request will return an APIAuthentication object (first) and the current user that has been signed in (last). They are not guaranteed to be included, so a class check is required.
+ (instancetype)loginRequestWithEmail:(NSString *)email password:(NSString *)password;

/// A request to obtain the current user from the API. The request will return an APIAuthentication object (first) and the current user (last). They are not guaranteed to be included, so a class check is required.
+ (instancetype)profileRequest;

@end
NS_ASSUME_NONNULL_END
