//  Created by Robin Speijer on 18-07-18.
//  Copyright © 2018 Bohemian Coding. All rights reserved.

#import "SCKObject.h"

/// An organization on Sketch Cloud. An organization can own multiple shares that are accessible by all its members.
NS_SWIFT_NAME(Organization)
@interface SCKOrganization : SCKObject

/// The user-facing name of the organization.
@property (nonatomic, nullable, strong, readonly) NSString *name;

@end
