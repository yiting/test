//  Created by Robin Speijer on 07-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import <SketchCloudKit/SketchCloudKit.h>
#import "SCKDiff.h"
#import "SCKCloudDocument.h"

@class SCKCloudDocument;

@interface SCKCloudDocumentDiff : SCKDocumentDiff

- (nonnull instancetype)initWithObject:(nonnull SCKCloudDocument *)object comparedTo:(nonnull SCKCloudDocument *)otherObject;

@end

@interface SCKCloudDocument (SCKDiff) <SCKDiffable>

- (nonnull SCKCloudDocumentDiff *)diffComparedTo:(nonnull SCKCloudDocument *)object;

@end
