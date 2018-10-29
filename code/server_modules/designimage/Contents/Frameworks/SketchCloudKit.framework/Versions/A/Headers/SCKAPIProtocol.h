//  Created by Robin Speijer on 06-11-17.
//  Copyright © 2017 Bohemian Coding. All rights reserved.

@class SCKAPIURLRequest;
@class SCKAPIEnvironment;

/**
 URL protocol to handle all Cloud API communication. This will forward all traffic to the default Cloud session, using the default HTTP protocol and sign all requests.
 */
NS_SWIFT_NAME(APIProtocol)
@interface SCKAPIProtocol : NSURLProtocol

@end
