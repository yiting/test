//  Created by Robin Speijer on 20/08/2018.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKAPIURLRequest.h"
@class SCKAPIAuthentication;

NS_ASSUME_NONNULL_BEGIN

extern NSString * _Nonnull const SCKAuthAPIName NS_SWIFT_NAME(OAuthAPIURLRequest.apiName);

/// A Cloud OAuth API request. Use a class method to create a specific request.
NS_SWIFT_NAME(OAuthAPIURLRequest)
@interface SCKOAuthAPIURLRequest : SCKAPIURLRequest

/// The initial sign in request using an email and password combination. The request will return just an APIAuthentication object.
+ (instancetype)requestWithEmail:(NSString *)email password:(NSString *)password;

/// An authentication refresh request to perform when a previous APIAuthentication object has (almost) expired. The request will return just an APIAuthentication object.
+ (instancetype)requestWithAuthentication:(SCKAPIAuthentication *)authentication;

@end

NS_ASSUME_NONNULL_END
