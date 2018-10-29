//  Created by Robin Speijer on 31-01-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKObject.h"

@class SCKCloudDocument;

/// A Cloud share revision.
NS_SWIFT_NAME(ShareVersion)
@interface SCKShareVersion : SCKObject

@property (nonatomic, readonly) NSUInteger number;
@property (nonatomic, nullable, readonly) NSString *message;
@property (nonatomic, nullable, readonly) SCKCloudDocument *document;

@end
