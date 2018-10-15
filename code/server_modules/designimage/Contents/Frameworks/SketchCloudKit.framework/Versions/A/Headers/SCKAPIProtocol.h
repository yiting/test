//
//  SCKAPIProtocol.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 06-11-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

@class SCKAPIRequest;
@class SCKEnvironment;

/**
 URL protocol to handle all Cloud API communication. This will forward all traffic to the default Cloud session, using the default HTTP protocol and sign all requests.
 */
@interface SCKAPIProtocol : NSURLProtocol

@end
