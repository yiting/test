//
//  SCKCloudDocument.h
//  SketchCloudKit
//
//  Created by Robin Speijer on 07-02-17.
//  Copyright © 2017 Awkward. All rights reserved.
//

#import "SCKDocument.h"

@interface SCKCloudDocument : SCKDocument

@property (nonatomic, nullable, readonly) NSString *slug;
@property (nonatomic, nullable, readonly) NSURL *downloadURL;
@property (nonatomic, readonly) BOOL isProcessing;
@property (nonatomic, nullable, readonly) NSURL *metaImageURL;

@end
