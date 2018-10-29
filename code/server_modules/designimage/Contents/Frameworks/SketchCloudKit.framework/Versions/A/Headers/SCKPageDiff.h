//  Created by Robin Speijer on 06-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
#import "SCKPage.h"

@class SCKCollectionDiff;

@interface SCKPageDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull SCKPage *)object comparedTo:(nonnull SCKPage *)otherObject;
@property (nonatomic, copy, nonnull, readonly) SCKPage *object;
@property (nonatomic, copy, nonnull, readonly) SCKPage *comparedObject;

/// All changed page attributes.
@property (nonatomic, readonly) SCKPageAttributes attributes;

/// A collection diff, describing all inserted, updated or removed artboards from the page.
@property (nonatomic, nonnull, readonly) SCKCollectionDiff *artboardsDiff;

@end

@interface SCKPage (SCKDiff) <SCKDiffable>

- (nonnull SCKPageDiff *)diffComparedTo:(nonnull SCKPage *)object;

@end
