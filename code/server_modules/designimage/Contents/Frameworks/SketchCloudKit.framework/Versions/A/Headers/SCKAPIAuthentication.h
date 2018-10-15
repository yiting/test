//
//  SCKAPIAuthentication.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 30-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

/// A protocol describing all information that could be used by the API to be authenticated.
@protocol SCKAPIAuthentication <NSObject>

/// A permanent token to be authenticated with the API.
@property (nonatomic, nullable, readonly) NSString *authToken;

/// A one-time token to be used for retreiving an authToken. When using such a token, it becomes invalid. Use `consumeAccessToken` to nillify the access token after using it.
@property (nonatomic, nullable, readonly) NSString *accessToken;

/// A one-time token to be used for retreiving an authToken. When using such a token, it becomes invalid. Therefore, the next time you call this method will return nil. The user endpoint needs to be called again in order to retreive a new consumeable access token. The implementation of SCKAuthenticatedUser does this automatically.
- (nullable NSString *)consumeAccessToken;

@end
