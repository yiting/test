//  Created by Robin Speijer on 06-02-17.
//  Copyright © 2017 Bohemian Coding. 

#import "SCKDiff.h"
#import "SCKDocument.h"

@class SCKCollectionDiff;

@interface SCKDocumentDiff : NSObject <SCKDiff>

- (nonnull instancetype)initWithObject:(nonnull SCKDocument *)object comparedTo:(nonnull SCKDocument *)otherObject;
@property (nonatomic, copy, nonnull, readonly) SCKDocument *object;
@property (nonatomic, copy, nonnull, readonly) SCKDocument *comparedObject;

/// All changed document attributes.
@property (nonatomic, readonly) SCKDocumentAttributes attributes;

/// A collection diff, describing all inserted, updated or removed pages from the document.
@property (nonatomic, nonnull, readonly) SCKCollectionDiff *pageDiff;

/// A collection diff, describing all inserted, updated or removed artboards from the document.
@property (nonatomic, nonnull, readonly) SCKCollectionDiff *artboardsDiff;

@end

@interface SCKDocument (SCKDiff) <SCKDiffable>

- (nonnull SCKDocumentDiff *)diffComparedTo:(nonnull SCKDocument *)object;

@end
