//
//  SCKAuthAPIRequest.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 26-04-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKAPIRequest.h"

NS_ASSUME_NONNULL_BEGIN

extern NSString * _Nonnull const SCKAuthAPIName;

/// A Cloud auth related API request. Use a class method to create a specific request.
@interface SCKAuthAPIRequest : SCKAPIRequest

/// A login request with an access token. Such a token is like a "challenge" to get authenticated. The current authenticated user will be returned by the API.
+ (instancetype)loginRequestWithAccessToken:(NSString *)accessToken;

/// A login request using an old-fashioned e-mail and raw password. The current authenticated user will be returned by the API.
+ (instancetype)loginRequestWithEmail:(NSString *)email password:(NSString *)password;

/// A request to obtain the current authenticated user from the API. This will also refresh the accessToken for the user.
+ (instancetype)profileRequest;

/// A request to start an account recovery session for the account that corresponds to the given e-mail.
+ (instancetype)forgotPasswordRequestWithEmail:(NSString *)email;

@end
NS_ASSUME_NONNULL_END
