//
//  SCKShareVersion.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 31-01-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKObject.h"

@class SCKCloudDocument;

/// A Cloud share revision.
@interface SCKShareVersion : SCKObject

@property (nonatomic, readonly) NSUInteger number;
@property (nonatomic, nullable, readonly) NSString *message;
@property (nonatomic, nullable, readonly) SCKCloudDocument *document;

@end
